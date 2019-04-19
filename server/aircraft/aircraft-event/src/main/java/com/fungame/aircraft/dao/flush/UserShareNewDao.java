package com.fungame.aircraft.dao.flush;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserShareNew;
import com.fungame.aircraft.dao.mapper.UserShareNewMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableHlen;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

@Repository
public class UserShareNewDao extends BaseDao {
	@Autowired
	UserShareNewMapper mapper;
	
	public void insert(UserShareNew newUserShare) {
		this.mapper.insert(newUserShare);
	}
	
	public List<UserShareNew> select(int userId) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		List<UserShareNew> list = null;
		Map<Integer, UserShareNew> map = cache.hgetAll("unew:"+userId, Integer.class, UserShareNew.class);
		if(map == null || map.isEmpty()) {
			list = this.mapper.select(userId);
			if(list != null && ! list.isEmpty()) {
				Jedis jedis = null;
				try {
					jedis = cache.getJedis();
					Pipeline pipeline = jedis.pipelined();
					for(UserShareNew award: list) {
						pipeline.hset(cache.serializeKey("unew:"+userId), cache.serializeKey(award.getId()+""), cache.serializeValue(award));
					}
					pipeline.sync();
				}
				finally {
					if(cache!=null) cache.release(jedis);
				}
			}
		}
		else {
			list = new ArrayList<>();
			for(UserShareNew award: map.values()) {
				list.add(award);
			}
		}
		return list;
	}
	
	@CacheableHlen(prefix="unew",suffix="#userId")
	public int selectCount(int userId) {
		return this.mapper.selectCount(userId);
	}
}	

