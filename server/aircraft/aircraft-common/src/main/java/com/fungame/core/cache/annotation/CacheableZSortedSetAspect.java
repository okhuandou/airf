package com.fungame.core.cache.annotation;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.JedisCache;
/**
 * sorted set（有序set），名称z开头的操作
 * @author peter.lim林炳忠
 *
 */
@Component
@Aspect
public class CacheableZSortedSetAspect extends BaseAspect{

	private double toDouble(Object obj) {
		double val = 0D;
		if(obj instanceof Long) {
			val = ((Long)obj).doubleValue();
		}
		else if(obj instanceof Integer) {
			val = ((Integer)obj).doubleValue();
		}
		else if(obj instanceof Double) {
			val = ((Double)obj).doubleValue();
		}
		else if(obj instanceof String) {
			if("+inf".equals(obj)) return 0D;
			val = Long.valueOf((String)obj);
		}
		return val;
	}
	private long toLong(Object obj) {
		long val = 0L;
		if(obj instanceof Long) {
			val = ((Long)obj).longValue();
		}
		else if(obj instanceof Integer) {
			val = ((Integer)obj).longValue();
		}
		else if(obj instanceof String) {
			if("+inf".equals(obj)) return 0L;
			val = Long.valueOf((String)obj);
		}
		return val;
	}
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
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZadd)")
    public Object zadd(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZadd cacheable = method.getAnnotation(CacheableZadd.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		Object ret = point.proceed(point.getArgs());
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object value = parseObject(cacheable.value(), method, point.getArgs());
		Object scoreObj = parseObject(cacheable.score(), method, point.getArgs());
		double score = this.toDouble(scoreObj);
		
		cache.zadd(key, score, value);
		if(cacheable.expire() > 0) {
			int expire = cacheable.expire();
			expire = cacheable.expireMode().getExpire(expire);
			cache.expire(key, expire);
		}
		return ret;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZaddBatch)")
    public Object zaddBatch(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZaddBatch cacheable = method.getAnnotation(CacheableZaddBatch.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		Object ret = point.proceed(point.getArgs());
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		@SuppressWarnings("unchecked")
		Map<String, Double> value = (Map<String, Double>)parseObject(cacheable.value(), method, point.getArgs());
		cache.zadd(key, value);
		if(cacheable.expire() > 0) {
			int expire = cacheable.expire();
			expire = cacheable.expireMode().getExpire(expire);
			cache.expire(key, expire);
		}
		return ret;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZcard)")
    public Object zcard(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZcard cacheable = method.getAnnotation(CacheableZcard.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		
		long rs = cache.zcard(key);
		if(rs == 0) {
			return point.proceed(point.getArgs());
		}
		return rs;
	}

	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZrangeByScore)")
    public Object zrangeByScore(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZrangeByScore cacheable = method.getAnnotation(CacheableZrangeByScore.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object minObj = this.parseObject(cacheable.min(), method, point.getArgs());
		double min = this.toDouble(minObj);
		Object maxObj = null;
		if("+inf".equals(cacheable.max())) {
			maxObj = Long.MAX_VALUE;
		}
		else {
			maxObj = this.parseObject(cacheable.max(), method, point.getArgs());
		}
		double max = this.toDouble(maxObj);
		
		Object offsetObj = this.parseObject(cacheable.offset(), method, point.getArgs());
		int offset = this.toInt(offsetObj);
		Object limitObj = this.parseObject(cacheable.limit(), method, point.getArgs());
		int limit = this.toInt(limitObj);
		List<?> list = cache.zrangeByScore(key, min, max, offset, limit,  cacheable.valueType());
		if(list == null || list.isEmpty()) {
			return point.proceed(point.getArgs());
		}
		return list;
	}
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZrevrangeByScore)")
    public Object zrevrangeByScore(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZrevrangeByScore cacheable = method.getAnnotation(CacheableZrevrangeByScore.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object minObj = this.parseObject(cacheable.min(), method, point.getArgs());
		double min = this.toDouble(minObj);
		Object maxObj = null;
		if("+inf".equals(cacheable.max())) {
			maxObj = cacheable.max();
		}
		else {
			maxObj = this.parseObject(cacheable.max(), method, point.getArgs());
		}
		double max = this.toDouble(maxObj);
		Object offsetObj = this.parseObject(cacheable.offset(), method, point.getArgs());
		int offset = this.toInt(offsetObj);
		Object limitObj = this.parseObject(cacheable.limit(), method, point.getArgs());
		int limit = this.toInt(limitObj);
		List<?> list = cache.zrevrangeByScore(key, min, max, offset, limit, cacheable.valueType());
		if(list == null || list.isEmpty()) {
			return point.proceed(point.getArgs());
		}
		return list;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZremRangeByScore)")
    public Object zremRangeByScore(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZremRangeByScore cacheable = method.getAnnotation(CacheableZremRangeByScore.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object minObj = this.parseObject(cacheable.min(), method, point.getArgs());
		Object maxObj = this.parseObject(cacheable.max(), method, point.getArgs());
		double min = this.toDouble(minObj);
		double max = this.toDouble(maxObj);
		
		cache.zremRangeByScore(key, min, max);
		return point.proceed(point.getArgs());
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZrem)")
    public Object Zrem(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZrem cacheable = method.getAnnotation(CacheableZrem.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object value = this.parseObject(cacheable.value(), method, point.getArgs());
		if(null != value){
			cache.zrem(key, value.toString());
		}
		return point.proceed(point.getArgs());
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZrevrange)")
    public Object zrevrange(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZrevrange cacheable = method.getAnnotation(CacheableZrevrange.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object startObj = this.parseObject(cacheable.start(), method, point.getArgs());
		Object stopObj = this.parseObject(cacheable.stop(), method, point.getArgs());
		long start = this.toLong(startObj);
		long end = this.toLong(stopObj);
		Class<?> valueType = cacheable.valueType();
		
		List<?> list = cache.zrevrange(key, start, end, valueType);
		if(list == null || list.isEmpty()) {
			return point.proceed(point.getArgs());
		}
		return list;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZcount)")
    public Object zCount(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZcount cacheable = method.getAnnotation(CacheableZcount.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Double minObj = null;
		Double maxObj = null;
		if("-inf".equals(cacheable.min())) {
			minObj = Double.MIN_VALUE;
		}else {
			minObj = (Double)this.parseObject(cacheable.min(), method, point.getArgs());
		}
		if("+inf".equals(cacheable.max())) {
			maxObj = Double.MAX_VALUE;
		}else{
			maxObj = (Double)this.parseObject(cacheable.max(), method, point.getArgs());
		}
		long ret = cache.zcount(key, minObj, maxObj);
		if(ret ==0L) {
			return point.proceed(point.getArgs());
		}
		return ret;
	}
	
	@Around("@annotation(com.fungame.core.cache.annotation.CacheableZrevRank)")
    public Object zRevRank(ProceedingJoinPoint point) throws Throwable {
		Method method = this.parseMethod(point);
		CacheableZrevRank cacheable = method.getAnnotation(CacheableZrevRank.class);
		
		String cacheName = cacheable.cacheName();
		JedisCache cache = cache(cacheName);
		
		String key = parseKey(cacheable.prefix(), cacheable.suffix(), method, point.getArgs());
		Object value = this.parseObject(cacheable.value(), method, point.getArgs());
		long ret = cache.zrevrank(key, String.valueOf(value));
		if(ret ==0L) {
			return point.proceed(point.getArgs());
		}
		return ret;
	}
}
