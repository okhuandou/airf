package com.fungame.core.cache.annotation;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.utils.mapper.JSONMapper;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
/**
 * kv cache切面
 * redis get set del 操作
 * @author peter.lim林炳忠
 *
 */
@Component
@Aspect
public class CacheableKVAspect extends BaseAspect{
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKV)")
    public Object cache(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKV cacheableKV = method.getAnnotation(CacheableKV.class);
		
		String cacheName = cacheableKV.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheableKV.prefix(), cacheableKV.suffix(), method, point.getArgs());
		
		Class<?> returnType = method.getReturnType();
		
		Object rs = cache.get(key, returnType);
		if(rs == null) {
			rs = point.proceed(point.getArgs());
			
			if(rs != null && cacheableKV.addIfNull()) {
				if(cacheableKV.expire() > 0) {
					int expire = cacheableKV.expire();
					expire = cacheableKV.expireMode().getExpire(expire);
					cache.setex(key, expire, rs);
				}
				else {
					cache.set(key, rs);
				}
			}
		}
		return rs;
	}
	
	@SuppressWarnings("rawtypes")
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVMget)")
    public Object mget(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVMget cacheableKV = method.getAnnotation(CacheableKVMget.class);
		
		String cacheName = cacheableKV.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheableKV.prefix(), cacheableKV.suffix(), method, point.getArgs());
		Object[] suffixKeys = this.parse(cacheableKV.keys(), method, point.getArgs(), Object[].class);
		String[] keys = new String[suffixKeys.length];
		for(int i=-0; i< suffixKeys.length; i++) {
			keys[i] = key + "_" + suffixKeys[i];
		}
		Class<?> valueType = cacheableKV.valueType();
		Class<?> returnType = cacheableKV.returnType();
		Class<?> methodReturnValue = method.getReturnType();
		Object rs = mget(cache, valueType, returnType, 
				methodReturnValue, keys);
		boolean flag = false;
		if(rs == null) {
			flag = true;
		}
		else {
			if(rs instanceof List) {
				List list = (List) rs;
				flag = list.isEmpty();
			}
			else if(rs instanceof Map) {
				Map map = (Map) rs;
				flag = map.isEmpty();
			}
		}
		if(flag) {
			Object methodResult = point.proceed(point.getArgs());
			return methodResult;
		}
		return rs;
	}
	
	private Object mget(JedisCache cache, Class<?> valueType,
			Class<?> returnType, Class<?> methodReturnValue, String[] keys) throws CacheException {
		List<?> rs = cache.mget(valueType, keys);
		if(rs == null || rs.isEmpty()) {
			return null;
		}
		else {
			if(methodReturnValue == List.class) {
				if(valueType == returnType) {
					return rs;
				}
				else {
					List<Object> ret = new ArrayList<>();
					for(Object obj: rs) {
						if(obj == null) {
							ret.add(null);
							continue;
						}
						Long v = null;
						if(valueType == String.class) {
							v = Long.valueOf((String)obj);
						}
						else if(valueType == Long.class) {
							v = Long.valueOf((Long)obj);
						}
						else if(valueType == Integer.class) {
							v = Long.valueOf((Integer)obj);
						}
						if(returnType == Integer.class) {
							ret.add(v.intValue());
						}
						else {
							ret.add(v);
						}
					}
					return ret;
				}
			}
			if(methodReturnValue == Map.class) {
				Map<String, Object> ret = new HashMap<>();
				for(int i=0; i<keys.length; i++) {
					String k = keys[i];
					Object obj = rs.get(i);
					if(obj == null) {
						ret.put(k, null);
						continue;
					}
					String tv = (String) obj;
					Long v = Long.valueOf(tv);
					if(returnType == Integer.class) {
						ret.put(k, v.intValue());
					}
					else {
						ret.put(k, v);
					}
				}
				return ret;
			}
			
		}
		return rs;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVSet)")
    public void put(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVSet cacheable = method.getAnnotation(CacheableKVSet.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);

		point.proceed(point.getArgs());
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		
   		Object value = parseObject(cacheable.value(), method, point.getArgs());
		
		if(cacheable.expire() > 0) {
			int expire = cacheable.expire();
			expire = cacheable.expireMode().getExpire(expire);
			cache.setex(key, expire, value);
		}
		else {
			cache.set(key, value);
		}
	}

	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVSetFields)")
    public void setFields(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVSetFields cacheable = method.getAnnotation(CacheableKVSetFields.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);

		point.proceed(point.getArgs());

		String keySuffix = parseParams(cacheable.suffix(), method, point.getArgs());
   		Object value = parseObject(cacheable.value(), method, point.getArgs());
		
   		int expire = cacheable.expire();
   		if(expire > 0) {
   			expire = cacheable.expireMode().getExpire(expire);
   		}
		
		cache.setFields(cacheable.prefix(), keySuffix, value, expire);
	}
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVGetFields)")
    public Object getFields(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVGetFields cacheable = method.getAnnotation(CacheableKVGetFields.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String keySubfix = parseParams(cacheable.suffix(), method, point.getArgs());
		String idName = cacheable.idName();
		Class<?> returnType = method.getReturnType();
		
		Object value = cache.getFields(cacheable.prefix(), keySubfix, idName, returnType);
		if(Objects.isNull(value)) {
			return point.proceed(point.getArgs());
		}
		return value;
 	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVSetExpire)")
    public void setExpire(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVSetExpire cacheable = method.getAnnotation(CacheableKVSetExpire.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);

		point.proceed(point.getArgs());
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		
   		Object value = parseObject(cacheable.value(), method, point.getArgs());
		
   		int expire = cacheable.expireMode().getExpire(cacheable.expire());
		if(expire > 0) {
			cache.setex(key, expire, value);
		}
		else {
			cache.set(key, value);
		}
	}
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVDel)")
	public void evict(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVDel cacheable = method.getAnnotation(CacheableKVDel.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		
		cache.del(key);
		
		point.proceed(point.getArgs());
	}
	@SuppressWarnings("rawtypes")
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableKVKeysMget)")
	public Object keysmget(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableKVKeysMget cacheable = method.getAnnotation(CacheableKVKeysMget.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object rs = null;
		boolean flag = false;
		Set<String> keys = cache.keys(key);
		if(keys == null || keys.isEmpty()) {
			flag = true;
		}
		else {
			Class<?> valueType = cacheable.valueType();
			Class<?> returnType = cacheable.returnType();
			Class<?> methodReturnValue = method.getReturnType();
			
			rs = mget(cache, valueType, returnType, 
					methodReturnValue, keys.toArray(new String[]{}));
			if(rs == null) {
				flag = true;
			}
			else {
				if(rs instanceof List) {
					List list = (List) rs;
					flag = list.isEmpty();
				}
				else if(rs instanceof Map) {
					Map map = (Map) rs;
					flag = map.isEmpty();
				}
			}
		}
		if(flag) {
			Object methodResult = point.proceed(point.getArgs());
			return methodResult;
		}
		return rs;
	}
	
}
