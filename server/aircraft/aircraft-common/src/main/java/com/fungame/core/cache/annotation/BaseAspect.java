package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;
import com.fungame.utils.StringBuilderHolder;

/**
 * cache 切面封装
 * 
 * @author peter.lim林炳忠
 *
 */
@Component
public abstract class BaseAspect {
	@Resource
	JedisCacheManager jedisCacheManager;
	ThreadLocal<StringBuilderHolder> stringBuilder = new ThreadLocal<StringBuilderHolder>() {
		protected StringBuilderHolder initialValue() {
	        return new StringBuilderHolder(256);
	    }
	};
	/**
	 * 解析出被切面的方法
	 * @param point
	 * @return
	 */
	protected Method parseMethod(ProceedingJoinPoint point) {
		Method method = ((MethodSignature) point.getSignature()).getMethod();
		return method;
	}
	/**
	 * 不同cacheName对应不同的分布cache
	 * @param cacheName
	 * @return
	 */
	protected JedisCache cache(String cacheName) {
		if (StringUtils.isEmpty(cacheName)) {
			throw new NullPointerException("cache name can not be null");
		}
		JedisCache jedisCache = jedisCacheManager.getCache(cacheName);
		if (jedisCache == null) {
			throw new NullPointerException("the cache that named " + cacheName + " can not be found");
		}
		return jedisCache;
	}
	/**
	 * 解析出key的值
	 * @param key
	 * @param method
	 * @param args
	 * @return
	 */
	protected String parseKey(String prefix, String []suffix, Method method, Object[] args) {
		StringBuilder sb = new StringBuilder();//stringBuilder.get().resetAndGetStringBuilder();
		sb.append(prefix);
		if(suffix != null && suffix.length > 0) {
			String params = this.parseParams(suffix, method, args);
			if(StringUtils.isNotBlank(params)) {
				if(sb.length()>0){
					sb.append(":").append(params);
				}else{
					sb.append(params);
				}
			}
		}
		return sb.toString();
	}
	protected String[] parseKey(String[] prefix, String[] suffix, Method method, Object[] args) {
		String[] keys =new String[prefix.length];
		for(int i=0;i<prefix.length;i++){
			String[] s =new String[]{suffix[i]};
			String params = this.parseParams(s, method, args);
			if(!StringUtils.isEmpty(params)){
				keys[i] = prefix[i]+":"+params;
			}else{
				keys[i] = prefix[i];
			}
		}
		return keys;
	}
	@SuppressWarnings("unchecked")
	private <T>T notSPLE(String exp, Class<T> clazz) {
		if(clazz == byte.class || clazz == Byte.class) {
			return (T) Byte.valueOf(exp);
		}
		if(clazz == short.class || clazz == Short.class) {
			return (T) Short.valueOf(exp);
		}
		if(clazz == int.class || clazz == Integer.class) {
			return (T) Integer.valueOf(exp);
		}
		if(clazz == long.class || clazz == Long.class) {
			return (T) Long.valueOf(exp);
		}
		if(clazz == float.class || clazz == Float.class) {
			return (T) Float.valueOf(exp);
		}
		if(clazz == double.class || clazz == Double.class) {
			return (T) Double.valueOf(exp);
		}
		return (T)exp;
	}
	public String parseParams(String []suffix, Method method, Object[] args) {
		// 获取被拦截方法参数名列表
		LocalVariableTableParameterNameDiscoverer u = new LocalVariableTableParameterNameDiscoverer();
		String[] paramNameArr = u.getParameterNames(method);
		if(paramNameArr == null || paramNameArr.length == 0) {
			return null;
		}
		// 使用SPEL进行key的解析
		ExpressionParser parser = new SpelExpressionParser();
		StandardEvaluationContext context = new StandardEvaluationContext();
		for (int i = 0; i < paramNameArr.length; i++) {
			context.setVariable(paramNameArr[i], args[i]);
		}
		StringBuilder sb = stringBuilder.get().resetAndGetStringBuilder();
		if(suffix != null && suffix.length > 0) {
			int cnt = 0;
			for(String t: suffix) {
				Object k = null;
				if( ! t.startsWith("#")) {
					k = this.notSPLE(t, String.class);
				}
				else {
					k = parser.parseExpression(t).getValue(context);
				}
				if(k == null) {
					continue;
				}
				sb.append(k);
				if(cnt < suffix.length-1) sb.append(":");
				cnt++;
			}
		}
		return sb.toString();
	}
	/**
	 * 如果exp不是#spl,则判断返回clazz指定的类型,这种情况只支持基础类型
	 * @param exp
	 * @param method
	 * @param args
	 * @param clazz
	 * @return
	 */
	public <T>T parse(String exp, Method method, Object[] args, Class<T> clazz) {
		if( ! exp.startsWith("#")) {
			return this.notSPLE(exp, clazz);
		}
		// 获取被拦截方法参数名列表
		LocalVariableTableParameterNameDiscoverer u = new LocalVariableTableParameterNameDiscoverer();
		String[] paramNameArr = u.getParameterNames(method);

		// 使用SPEL进行key的解析
		ExpressionParser parser = new SpelExpressionParser();
		StandardEvaluationContext context = new StandardEvaluationContext();
		for (int i = 0; i < paramNameArr.length; i++) {
			context.setVariable(paramNameArr[i], args[i]);
		}
		return parser.parseExpression(exp).getValue(context, clazz);
	}
	/**
	 * 解析出值
	 * @param exp
	 * @param method
	 * @param args
	 * @return
	 */
	protected Object parseObject(String exp, Method method, Object[] args) {
		if( ! exp.startsWith("#")) {
			return exp;
		}
		// 获取被拦截方法参数名列表
		LocalVariableTableParameterNameDiscoverer u = new LocalVariableTableParameterNameDiscoverer();
		String[] paramNameArr = u.getParameterNames(method);

		// 使用SPEL进行key的解析
		ExpressionParser parser = new SpelExpressionParser();
		StandardEvaluationContext context = new StandardEvaluationContext();
		for (int i = 0; i < paramNameArr.length; i++) {
			context.setVariable(paramNameArr[i], args[i]);
		}
		return parser.parseExpression(exp).getValue(context);
	}
}
