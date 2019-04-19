package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;
import java.util.Arrays;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.JedisCache;
/**
 * incr 切面
 * @author peter.lim林炳忠
 *
 */
@Component
@Aspect
public class CacheableIncrAspect extends BaseAspect{
	private static Logger logger = LoggerFactory.getLogger(CacheableIncrAspect.class);
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableExists)")
	public Object exists(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableExists cacheableIncr = method.getAnnotation(CacheableExists.class);
		String cacheName = cacheableIncr.cacheName();
		JedisCache cache = cache(cacheName);
		String key = parseKey(cacheableIncr.prefix(), cacheableIncr.suffix(), method, point.getArgs());
		return cache.exits(key);
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableIncr)")
	public Object icnr(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableIncr cacheableIncr = method.getAnnotation(CacheableIncr.class);
		
		String cacheName = cacheableIncr.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheableIncr.prefix(), cacheableIncr.suffix(), method, point.getArgs());
		String incrParam = cacheableIncr.incr();
		try {
			int incr = 1;
			if(incrParam != null) {
				Integer iIncrParam = this.parse(incrParam, method, point.getArgs(), Integer.class);
				if(iIncrParam != null && iIncrParam != 0) {
					incr = iIncrParam;
				}
			}
			Object procceedReturn = point.proceed(point.getArgs());
			
			//如果返回值是boolean类型，那么方法体返回false的时候不执行redis的操作
			Class<?> returnType = method.getReturnType();
			if(returnType == boolean.class || returnType == Boolean.class) {
				Boolean procceedResult = (Boolean) procceedReturn;
				if(procceedResult == null || procceedResult.booleanValue() == false) {
					return false;
				}
			}
			
			long rs = -1;
			do {
				if(cacheableIncr.checkExist()) {
					if( ! cache.exits(key)) {
						break;
					}
				}
				rs = cache.incrby(key, incr);
				if(cacheableIncr.expire() > 0) {
					int expire = cacheableIncr.expire();
					expire = cacheableIncr.expireMode().getExpire(expire);
					cache.expire(key, expire);
				}
			}while(false);
			
			if(cacheableIncr.incrResult()) {
				if(returnType == int.class || returnType == Integer.class) {
					return (int)rs;
				}
				else if(returnType == long.class || returnType == Long.class) {
					return rs;
				}
				else if(returnType == void.class || returnType == Void.class) {
					return null;
				}
				else if(returnType == boolean.class || returnType == Boolean.class) {
					return true;
				}
				throw new RuntimeException(method.getName() + " return type is must be int or long or void.");
			}
		}
		finally {
			logger.info("incr "+key+" " + incrParam);
		}
		return null;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableDecr)")
	public Object decr(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableDecr cacheableDecr = method.getAnnotation(CacheableDecr.class);
		
		String cacheName = cacheableDecr.cacheName();
		JedisCache cache = cache(cacheName);
		
		Object ret = point.proceed(point.getArgs());
		
		String key = parseKey(cacheableDecr.prefix(), cacheableDecr.suffix(), method, point.getArgs());
		cache.decr(key);
		return ret;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableIncrGet)")
	public Object get(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableIncrGet cacheableIncr = method.getAnnotation(CacheableIncrGet.class);
		
		String cacheName = cacheableIncr.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheableIncr.prefix(), cacheableIncr.suffix(), method, point.getArgs());
		String val = null;
		if(StringUtils.isNotBlank(key)) {
			val = cache.get(key, String.class);
		}
		else {
			logger.error("key is null.prefix="+cacheableIncr.prefix()+",suffix="+cacheableIncr.suffix()+",Args="+Arrays.toString(point.getArgs()));
		}
		long rs = 0L;
		if(StringUtils.isBlank(val)) {
			Object rt = point.proceed(point.getArgs());
			if(rt instanceof Integer) {
				rs = ((Integer) rt).longValue();
			}
			else if(rt instanceof Long) {
				rs = ((Long) rt).longValue();
			}
			cache.set(key, rt+"");
			if(cacheableIncr.expire() > 0) {
				int expire = cacheableIncr.expire();
				expire = cacheableIncr.expireMode().getExpire(expire);
				cache.expire(key, expire);
			}
		}
		else {
			rs = Long.valueOf(val);
		}
		Class<?> returnType = method.getReturnType();
		
		if(returnType == int.class || returnType == Integer.class) {
			return (int)rs;
		}
		else if(returnType == long.class || returnType == Long.class) {
			return rs;
		}
		throw new RuntimeException(method.getName() + " return type is must be int or long.");
	}
}
