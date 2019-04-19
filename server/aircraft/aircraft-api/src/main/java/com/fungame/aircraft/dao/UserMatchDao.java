package com.fungame.aircraft.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.UserMatch;
import com.fungame.aircraft.dao.mapper.UserMatchMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.utils.time.DateTimeUtils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

@Repository
public class UserMatchDao extends BaseDao {
	@Autowired
	UserMatchMapper mapper;
	
	public void insert(UserMatch userMatch) throws CacheException {
		this.flushDbEvent("userMatch.insert", userMatch);
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		cache.hsetObj("umatch:"+userMatch.getUserId(), String.valueOf(userMatch.getFriendUserId()), userMatch);
	}
	
	public void update(UserMatch userMatch) throws CacheException {
		this.flushDbEvent("userMatch.update", userMatch);
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		cache.hsetObj("umatch:"+userMatch.getUserId(), String.valueOf(userMatch.getFriendUserId()), userMatch);
	}
	
	public void insertNewMatch(UserMatch userMatch) throws CacheException {
		this.flushDbEvent("userMatch.insertNew", userMatch);
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		cache.del("umatch:"+userMatch.getUserId());
		cache.hsetObj("umatch:"+userMatch.getUserId(), String.valueOf(userMatch.getFriendUserId()), userMatch);
	}
	
	public void delete(int userId) throws CacheException {
		this.flushDbEvent("userMatch.delete", new JSONObject().fluentPut("userId", userId));
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		cache.del("umatch:"+userId);
	}
	
	public UserMatch selectUser(int userId, int friendUserId) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		UserMatch match = cache.hget("umatch:"+userId, String.valueOf(friendUserId), UserMatch.class);
		
		return match;
	}
	public List<UserMatch> select(int userId) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		List<UserMatch> list = null;
		Map<Integer, UserMatch> map = cache.hgetAll("umatch:"+userId, Integer.class, UserMatch.class);
		Date nowDate = new Date();
		Date startTime = DateTimeUtils.getDayStartTime(nowDate);
		long endtime = DateTimeUtils.getDayEndTime(nowDate.getTime());
		if(map == null || map.isEmpty()) {
			list = this.mapper.select(userId);
			if(list != null && ! list.isEmpty()) {
				Jedis jedis = null;
				try {
					jedis = cache.getJedis();
					Pipeline pipeline = jedis.pipelined();
					for(UserMatch match: list) {
						pipeline.hset(cache.serializeKey("umatch:"+userId), cache.serializeKey(String.valueOf(match.getFriendUserId())), cache.serializeValue(match));
					}
					pipeline.expire("umatch:"+userId, (int) ((endtime - nowDate.getTime())/1000));
					pipeline.sync();
				}
				finally {
					if(cache!=null) cache.release(jedis);
				}
			}
		}
		else {
			list = new ArrayList<>();
			for(UserMatch match: map.values()) {
				list.add(match);
			}
		}
		return list;
	}
	
	
}
