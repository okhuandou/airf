package com.fungame.aircraft.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserShareAward;
import com.fungame.aircraft.dao.mapper.UserShareAwardMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableHlen;
import com.fungame.utils.time.DateTimeUtils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

@Repository
public class UserShareAwardDao extends BaseDao {
	@Autowired
	UserShareAwardMapper mapper;
	
	
	public void insert(UserShareAward userShareAward) {
//		@CacheableHset(prefix="ushare",suffix="#userShareAward.userId",field="#userShareAward.id",value="#userShareAward")
//		this.mapper.insert(userShareAward);
		this.flushDbEvent("userShareAward.insert", userShareAward);
	}
	
	public List<UserShareAward> select(int userId) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		List<UserShareAward> list = null;
		Map<Integer, UserShareAward> map = cache.hgetAll("ushare:"+userId, Integer.class, UserShareAward.class);
		Date nowDate = new Date();
		Date startTime = DateTimeUtils.getDayStartTime(nowDate);
		long endtime = DateTimeUtils.getDayEndTime(nowDate.getTime());
		if(map == null || map.isEmpty()) {
			this.mapper.delete(userId, startTime);
			list = this.mapper.select(userId);
			if(list != null && ! list.isEmpty()) {
				Jedis jedis = null;
				try {
					jedis = cache.getJedis();
					Pipeline pipeline = jedis.pipelined();
					for(UserShareAward award: list) {
						pipeline.hset(cache.serializeKey("ushare:"+userId), cache.serializeKey(award.getId()+""), cache.serializeValue(award));
					}
					pipeline.expire("ushare:"+userId, (int) ((endtime - nowDate.getTime())/1000));
					pipeline.sync();
				}
				finally {
					if(cache!=null) cache.release(jedis);
				}
			}
		}
		else {
			list = new ArrayList<>();
			Jedis jedis = null;
			try {
				jedis = cache.getJedis();
				Pipeline pipeline = jedis.pipelined();
				int cnt = 0;
				for(UserShareAward award: map.values()) {
					if(award.getCreatedAt().before(startTime)) {
						pipeline.hdel(cache.serializeKey("ushare:"+userId), cache.serializeKey(award.getId()+""), cache.serializeValue(award));
						cnt ++;
						continue;
					}
					list.add(award);
				}
				if(cnt > 0) {
					pipeline.sync();
				}
			}
			finally {
				if(cache!=null) cache.release(jedis);
			}
		}
		return list;
	}
	
	@CacheableHlen(prefix="ushare",suffix="#userId")
	public int selectCount(int userId) {
		return this.mapper.selectCount(userId);
	}

	public boolean updateIsReceive(int userId, int id) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		UserShareAward award = cache.hget("ushare:"+userId, id, UserShareAward.class);
		if(award != null) {			
			award.setIsRecv(1);
			award.setRecvAt(new Date());
			cache.hsetObj("ushare:"+userId, id, award);
		}
//		return this.mapper.updateIsReceive(userId, id) > 0;
		this.flushDbEvent("userShareAward.updateIsReceive", new JSONObject().fluentPut("userId",userId).fluentPut("id", id));
		return true;
	}

	public void touchShareEvent(UserBase userBase, boolean isNewUser, int fromUserId, String fromType) {
		this.flushDbEvent("touchShare.touch", new JSONObject().fluentPut("userBase",userBase)
				.fluentPut("isNewUser", isNewUser).fluentPut("fromUserId", fromUserId)
				.fluentPut("fromType", fromType));
	}
}
