package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.JedisCache;
/**
 * map 切面
 * @author 林炳忠
 *
 */
@Component
@Aspect
public class CacheableHashmapAspect extends BaseAspect{
	private static Logger logger = LoggerFactory.getLogger(CacheableHashmapAspect.class);
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableHexsits)")
	public Object hexsits(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableHexsits cacheable = method.getAnnotation(CacheableHexsits.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		String field = parseParams(cacheable.field(), method, point.getArgs());
		
		boolean exists = cache.hexists(key, field);
		
		if(logger.isDebugEnabled()) {
			logger.debug("hexsits key="+key+",field="+field+",rs="+exists);
		}
		
		return exists;
	}

	@Around("@annotation(com.fungame.core.cache.annotation.CacheableHgetAll)")
	public Object hgetAll(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableHgetAll cacheable = method.getAnnotation(CacheableHgetAll.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Class<?> fieldType = cacheable.fieldType();
		Class<?> valueType = cacheable.valueType();
		Map map = cache.hgetAll(key, fieldType, valueType);
		
		if(logger.isDebugEnabled()) {
			logger.debug("hgetAll key="+key+",rs="+map);
		}
		
		if(map == null || map.isEmpty()) {
			Object rs = point.proceed(point.getArgs());
			if(rs != null) {
				map = (Map) rs;
				cache.hmset(key, map, fieldType, valueType);
			}
		}
		
		return map;
	}
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableHget)")
	public Object hget(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableHget cacheable = method.getAnnotation(CacheableHget.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object field = parseObject(cacheable.field(), method, point.getArgs());
		Class<?> valueType = cacheable.valueType();
		Object value = cache.hget(key, field, valueType);
		
		if(logger.isDebugEnabled()) {
			logger.debug("hgetAll key="+key+",rs="+value);
		}
		if(value == null) {
			Object rs = point.proceed(point.getArgs());
			value = rs;
		}
		
		return value;
	}
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableHset)")
	public Object hset(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableHset cacheable = method.getAnnotation(CacheableHset.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object field = parseObject(cacheable.field(), method, point.getArgs());
		Object value = parseObject(cacheable.value(), method, point.getArgs());
		
		point.proceed(point.getArgs());
		cache.hsetObj(key, field, value);
		
		return null;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableHlen)")
	public Object hlen(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableHlen cacheable = method.getAnnotation(CacheableHlen.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		int value = cache.hlen(key);
		if(value == 0) {
			value = (int) point.proceed(point.getArgs());
		}
		return value;
	}
}
