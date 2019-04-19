package com.fungame.aircraft.dao.flush;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserShareHelp;
import com.fungame.aircraft.dao.entity.UserShareHelp;
import com.fungame.aircraft.dao.mapper.UserShareHelpMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableHlen;
import com.fungame.utils.time.DateTimeUtils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

@Repository
public class UserShareHelpDao extends BaseDao {
	@Autowired
	UserShareHelpMapper mapper;
	
	public void insert(UserShareHelp userShareHelp) {
		this.mapper.insert(userShareHelp);
	}
	
	public List<UserShareHelp> select(int userId) throws CacheException {
		JedisCache cache = null;
		cache = cacheMgr.getCache(CacheName);
		List<UserShareHelp> list = null;
		Map<Integer, UserShareHelp> map = cache.hgetAll("uhelp:"+userId, Integer.class, UserShareHelp.class);
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
					for(UserShareHelp award: list) {
						pipeline.hset(cache.serializeKey("uhelp:"+userId), cache.serializeKey(award.getId()+""), cache.serializeValue(award));
					}
					pipeline.expire("uhelp:"+userId, (int) ((endtime - nowDate.getTime())/1000));
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
				for(UserShareHelp award: map.values()) {
					if(award.getCreatedAt().before(startTime)) {
						pipeline.hset(cache.serializeKey("uhelp:"+userId), cache.serializeKey(award.getId()+""), cache.serializeValue(award));
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
	
	public boolean updateIsReceive(int userId, int id) {
		return this.mapper.updateIsReceive(userId, id, new Date()) > 0;
	}

	@CacheableHlen(prefix="uhelp",suffix="#userId")
	public int selectCount(int userId) {
		return this.mapper.selectCount(userId);
	}
}
