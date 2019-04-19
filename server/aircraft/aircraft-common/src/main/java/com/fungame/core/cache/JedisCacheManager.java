package com.fungame.core.cache;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.InitializingBean;
/**
 * 
 * @author peter.lim林炳忠
 *
 */
public class JedisCacheManager implements InitializingBean {
	private Collection<JedisCache> caches;
	private final ConcurrentMap<String, JedisCache> cacheMap = new ConcurrentHashMap<String, JedisCache>(16);
	private Set<String> cacheNames = new LinkedHashSet<String>(16);
	public void setCaches(Collection<JedisCache> caches) {
		this.caches = caches;
	}
	public Collection<JedisCache> getCaches() {
		return this.caches;
	}
	@Override
	public void afterPropertiesSet() {
		Collection<JedisCache> caches = getCaches();
		this.cacheMap.clear();
		this.cacheNames.clear();
		for (JedisCache cache : caches) {
			addCache(cache);
		}
	}
	protected final void addCache(JedisCache cache) {
		if(this.cacheNames.contains(cache.getName())) {
			throw new RuntimeException(cache.getName() + ", the cache name had bean named!");
		}
		this.cacheMap.put(cache.getName(), cache);
		this.cacheNames.add(cache.getName());
	}
	public JedisCache getCache(String name) {
		return this.cacheMap.get(name);
	}
}
