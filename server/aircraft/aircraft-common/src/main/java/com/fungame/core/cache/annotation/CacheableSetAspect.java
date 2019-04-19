package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;
import java.util.Set;

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
public class CacheableSetAspect extends BaseAspect{
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableSadd)")
    public void sadd(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableSadd cacheable = method.getAnnotation(CacheableSadd.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);

		point.proceed(point.getArgs());
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		
   		Object value = parseObject(cacheable.value(), method, point.getArgs());
		
		if(cacheable.expire() > 0) {
			int expire = cacheable.expire();
			expire = cacheable.expireMode().getExpire(expire);
			cache.sadd(key, value);
			cache.expire(key, expire);
		}
		else {
			cache.sadd(key, value);
		}
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableSinter)")
    public Object sinter(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableSinter cacheable = method.getAnnotation(CacheableSinter.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String[] key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Set<String> set  = cache.sinter(key);
		if(null == set || set.isEmpty()){
		    return point.proceed(point.getArgs());
		}
		return set;
	}
}
