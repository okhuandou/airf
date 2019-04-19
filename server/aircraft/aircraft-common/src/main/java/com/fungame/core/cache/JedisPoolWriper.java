package com.fungame.core.cache;

import java.io.Closeable;
import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;

import redis.clients.jedis.JedisPool;
/**
 * 
 * @author peter.lim林炳忠
 *
 */
public class JedisPoolWriper implements Closeable {
	private JedisPool jedisPool = null;
    public JedisPoolWriper(final GenericObjectPoolConfig poolConfig, final String host, int port,
    	      int timeout, final String password, final int database){
    	if(StringUtils.isNotBlank(password)) {
    		jedisPool = new JedisPool(poolConfig, host, port, timeout, password, database);
    	}
    	else {
    		jedisPool = new JedisPool(poolConfig, host, port, timeout,null,database);
    	}
	}
    public JedisPoolWriper(final GenericObjectPoolConfig poolConfig, final String host, int port,
  	      int timeout){
    	jedisPool = new JedisPool(poolConfig, host, port, timeout);
	}
	public JedisPool getJedisPool() {
		return jedisPool;
	}
	@Override
	public void close() throws IOException {
		if(jedisPool != null) {
			jedisPool.close();
		}
	}
}