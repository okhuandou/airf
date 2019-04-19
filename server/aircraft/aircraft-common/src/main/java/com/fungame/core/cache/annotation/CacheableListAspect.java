package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;
import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.JedisCache;
/**
 * kv cache切面
 * redis get set del 操作
 * @author peter.lim林炳忠
 *
 */
@Component
@Aspect
public class CacheableListAspect extends BaseAspect{
	
	private int toInt(Object obj) {
		int val = 0;
		if(obj instanceof Long) {
			val = ((Long)obj).intValue();
		}
		else if(obj instanceof Integer) {
			val = ((Integer)obj).intValue();
		}
		else if(obj instanceof String) {
			val = Integer.valueOf((String)obj);
		}
		return val;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableLLen)")
    public Object llen(ProceedingJoinPoint point) throws Throwable {
		
		Method method = this.parseMethod(point);
		CacheableLLen cacheableLLen = method.getAnnotation(CacheableLLen.class);
		
		String cacheName = cacheableLLen.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheableLLen.prefix(), cacheableLLen.suffix(), method, point.getArgs());
		
		int len = cache.llen(key);
		if(len == 0){
			Object ret = point.proceed(point.getArgs());
			return ret;
		}
		return len;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableLPush)")
    public Object lpush(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableLPush cacheableLPush = method.getAnnotation(CacheableLPush.class);
		
		String cacheName = cacheableLPush.cacheName();
		JedisCache cache = cache(cacheName);
		
		Object ret = point.proceed(point.getArgs());
		
		String key = parseKey(cacheableLPush.prefix(), cacheableLPush.suffix(), method, point.getArgs());
		Object value = parseObject(cacheableLPush.value(), method, point.getArgs());
		
		cache.lpush(key, value);
		
		if(cacheableLPush.expire() > 0) {
			int expire = cacheableLPush.expire();
			expire = cacheableLPush.expireMode().getExpire(expire);
			cache.expire(key, expire);
		}
		
		return ret;
	}
	
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableLRange)")
    public Object put(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableLRange cacheableLRange = method.getAnnotation(CacheableLRange.class);
		
		String cacheName = cacheableLRange.cacheName();
		JedisCache cache = cache(cacheName);

		String key = parseKey(cacheableLRange.prefix(), cacheableLRange.suffix(), method, point.getArgs());
		
		Object minObj = parseObject(cacheableLRange.min(), method, point.getArgs());
		Object maxObj = this.parseObject(cacheableLRange.max(), method, point.getArgs());
		
		int start = toInt(minObj);
		int end = toInt(maxObj);
		
		List<?> list = cache.lrange(key, start, end, cacheableLRange.valueType());
		
		if(list == null || list.isEmpty()) {
			return point.proceed(point.getArgs());
		}
		return list;
	}

	@Around("@annotation(com.fungame.core.cache.annotation.CacheableLRem)")
	public Object evict(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableLRem cacheableLRem = method.getAnnotation(CacheableLRem.class);
		
		String cacheName = cacheableLRem.cacheName();
		JedisCache cache = cache(cacheName);
		
		Object ret = point.proceed(point.getArgs());
		
		String key = parseKey(cacheableLRem.prefix(), cacheableLRem.suffix(), method, point.getArgs());
		
		Object value = parseObject(cacheableLRem.value(), method, point.getArgs());
		
		cache.lrem(key, value.toString());
		
		return ret;
	}
}
