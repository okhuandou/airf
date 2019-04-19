package com.fungame.aircraft.dao.cfg;

import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.ListeningExecutorService;
import com.google.common.util.concurrent.MoreExecutors;

public abstract class BaseLocalCacheDao<K, V> {
	private LoadingCache<K, V> cache;
	private int maximumSize = 10000;
	private long refreshAfterWriteDuration = 60 * 1000;
	private TimeUnit refreshAfterWriteTimeUnit = TimeUnit.MILLISECONDS;
	private ListeningExecutorService pool = MoreExecutors.listeningDecorator(Executors.newFixedThreadPool(4));
	
	public BaseLocalCacheDao<K, V> refreshAfterWrite(long duration, TimeUnit unit) {
		this.refreshAfterWriteDuration = duration;
		this.refreshAfterWriteTimeUnit = unit;
		return this;
	}

	public void maximumSize(int maximumSize) {
		this.maximumSize = maximumSize;
	}

	public abstract V load(K key);
	
	public LoadingCache<K, V> getCache() {
		if(this.cache == null) {
			synchronized (this) {
				if(this.cache != null) return this.cache;
				this.cache = CacheBuilder.newBuilder()
						.maximumSize(this.maximumSize)
						.refreshAfterWrite(this.refreshAfterWriteDuration, this.refreshAfterWriteTimeUnit)
						.build(new CacheLoader<K, V>(){
							@Override
							public V load(K key) throws Exception {
								return BaseLocalCacheDao.this.load(key);
							}
							@Override
							public ListenableFuture<V> reload(K key, V oldValue) throws Exception {
								return pool.submit(new Callable<V>() {
									
									@Override
									public V call() throws Exception {
										return BaseLocalCacheDao.this.load(key);
									}
								});
							}
						});
			}
		}
		return this.cache;
	}
	
	public V get(K key) {
		try {
			return this.getCache().get(key);
		} catch (Exception e) {
			return this.getCache().getIfPresent(key);
		}
	}
}
