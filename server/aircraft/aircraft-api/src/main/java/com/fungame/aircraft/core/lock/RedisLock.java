package com.fungame.aircraft.core.lock;

import java.util.Random;

import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;

public class RedisLock {
    //加锁标志
    public static final String LOCKED = "TRUE";
    public static final long ONE_MILLI_NANOS = 1000000L;
    //默认超时时间（毫秒）
    public static final int DEFAULT_EXPIRE = 3000;
    public static final int DEFAULT_TRY_TIMEOUT = 3000;
    public static final Random r = new Random();
    private JedisCache cache;
    //锁状态标志
    private boolean locked = false;

    public RedisLock(JedisCache cache) {
        this.cache = cache;
    }

    public boolean tryLock(String key, int expireMillis, int tryTimeout) {
        long nano = System.nanoTime();
        long tryTimeoutNanos = tryTimeout * ONE_MILLI_NANOS;
        try {
            while ((System.nanoTime() - nano) < tryTimeoutNanos) {
                if (this.lock(key, expireMillis)) {
                    locked = true;
                    return locked;
                }
                // 短暂休眠，nano避免出现活锁
                Thread.sleep(3, r.nextInt(500));
            }
        } catch (Exception e) {
        }
        return false;
    }
    public boolean tryLock(String key) {
        return tryLock(key, DEFAULT_EXPIRE, DEFAULT_TRY_TIMEOUT);
    }
    
    public boolean lock(String key, int expireMillis) {
    	return cache.setNxPx(key, LOCKED, expireMillis);
    }
    
    // 无论是否加锁成功，必须调用
    public void unlock(String key) {
		try {
	    	if (locked) cache.del(key);
		} catch (CacheException e) {
			e.printStackTrace();
		}
    }
    
}
