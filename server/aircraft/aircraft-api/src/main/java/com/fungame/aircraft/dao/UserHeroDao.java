package com.fungame.aircraft.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.dao.mapper.UserHeroMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableKVSet;
import com.fungame.core.cache.annotation.CacheableKVSetFields;
import com.fungame.core.cache.annotation.ExpireMode;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

@Repository
public class UserHeroDao extends BaseDao {
	@Autowired
	UserHeroMapper mapper;
	
	@CacheableKVSetFields(prefix="uhero", suffix={"#userHero.userId","#userHero.kind"},value="#userHero",expire=3,expireMode=ExpireMode.Daily)
	public void insert(UserHero userHero) {
//		this.mapper.insert(userHero);
		this.flushDbEvent("userHero.insert", userHero);
	}
	
	@CacheableKVSet(prefix="uhero:status", suffix= {"#userId","#kind"}, value="#status", expire=3, expireMode=ExpireMode.Daily)
	public void updateStatusJustOne(int userId, int kind, int oldStatus, int status) {
//		this.mapper.updateStatus(userId, kind, status);
		this.flushDbEvent("userHero.updateStatusJustOne", new JSONObject().fluentPut("userId",userId).fluentPut("kind", kind).fluentPut("oldStatus", oldStatus).fluentPut("status", status));
	}
	
	public void updateStatus(int userId, int kind, int status) {
//		this.mapper.updateStatus(userId, kind, status);
		this.flushDbEvent("userHero.updateStatus", new JSONObject().fluentPut("userId",userId).fluentPut("kind", kind).fluentPut("status", status));
	}
	
	public void updateStatusAll(int userId, Set<Integer> kinds, int status, int oldStatus) {
		Jedis jedis = null;
		JedisCache cache = null;
		try {
			cache = cacheMgr.getCache(CacheName);
			jedis = cache.getJedis();
			Pipeline pipeline = jedis.pipelined();
			for(int kind: kinds) {
				String str = jedis.get("uhero:status:"+userId+":"+kind);
				if( ! StringUtils.isNotBlank(str) && oldStatus == NumberUtils.toInt(str)) {
					pipeline.set("uhero:status:"+userId+":"+kind, String.valueOf(status));
				}
			}
			pipeline.sync();
		}
		finally {			
			if(cache!=null) cache.release(jedis);
		}
//		this.mapper.updateStatusAll(userId, status, oldStatus);
	}
	
	public void updatePower(int userId, int kind, int power, int powerLevel, int heroId, int level) throws CacheException {
		this.flushDbEvent("userHero.updatePower", new JSONObject().fluentPut("userId",userId)
				.fluentPut("kind", kind).fluentPut("power", power).fluentPut("powerLevel", powerLevel)
				.fluentPut("heroId", heroId).fluentPut("level", level));
		Jedis jedis = null;
		JedisCache cache = null;
		try {
			cache = cacheMgr.getCache(CacheName);
			jedis = cache.getJedis();
			Pipeline pipeline = jedis.pipelined();
			pipeline.set("uhero:power:"+userId+":"+kind, String.valueOf(power));
			pipeline.set("uhero:powerlevel:"+userId+":"+kind, String.valueOf(powerLevel));
			pipeline.set("uhero:heroid:"+userId+":"+kind, String.valueOf(heroId));
			pipeline.set("uhero:level:"+userId+":"+kind, String.valueOf(level));
			pipeline.sync();
		}
		finally {			
			if(cache!=null) cache.release(jedis);
		}
//		this.mapper.updatePower(userId, kind, power, powerLevel, heroId, level);
	}
	
	public void updateAttackSpeed(int userId, int kind, int attackSpeed, int attackSpeedLevel, int heroId, int level) {
		this.flushDbEvent("userHero.updateAttackSpeed", new JSONObject().fluentPut("userId",userId)
				.fluentPut("kind", kind).fluentPut("attackSpeed", attackSpeed).fluentPut("attackSpeedLevel", attackSpeedLevel)
				.fluentPut("heroId", heroId).fluentPut("level", level));
		Jedis jedis = null;
		JedisCache cache = null;
		try {
			cache = cacheMgr.getCache(CacheName);
			jedis = cache.getJedis();
			Pipeline pipeline = jedis.pipelined();
			pipeline.set("uhero:attackspeed:"+userId+":"+kind, String.valueOf(attackSpeed));
			pipeline.set("uhero:attackspeedlevel:"+userId+":"+kind, String.valueOf(attackSpeedLevel));
			pipeline.set("uhero:heroid:"+userId+":"+kind, String.valueOf(heroId));
			pipeline.set("uhero:level:"+userId+":"+kind, String.valueOf(level));
			pipeline.sync();
		}
		finally {			
			if(cache!=null) cache.release(jedis);
		}
//		this.mapper.updateAttackSpeed(userId, kind, attackSpeed, attackSpeedLevel, heroId, level);
	}
	
	public void updateBlood(int userId, int kind, int blood, int bloodLevel, int heroId, int level) {
//		this.mapper.updateBlood(userId, kind, blood, bloodLevel, heroId, level);
		this.flushDbEvent("userHero.updateBlood", new JSONObject().fluentPut("userId",userId)
				.fluentPut("kind", kind).fluentPut("blood", blood).fluentPut("bloodLevel", bloodLevel)
				.fluentPut("heroId", heroId).fluentPut("level", level));
		Jedis jedis = null;
		JedisCache cache = null;
		try {
			cache = cacheMgr.getCache(CacheName);
			jedis = cache.getJedis();
			Pipeline pipeline = jedis.pipelined();
			pipeline.set("uhero:blood:"+userId+":"+kind, String.valueOf(blood));
			pipeline.set("uhero:bloodlevel:"+userId+":"+kind, String.valueOf(bloodLevel));
			pipeline.set("uhero:heroid:"+userId+":"+kind, String.valueOf(heroId));
			pipeline.set("uhero:level:"+userId+":"+kind, String.valueOf(level));
			pipeline.sync();
		}
		finally {			
			if(cache!=null) cache.release(jedis);
		}
	}
	
	public List<UserHero> selectAll(int userId, Set<Integer> kinds) {
		Jedis jedis = null;
		JedisCache cache = null;
		List<UserHero> rs = new ArrayList<>();
		try {
			cache = cacheMgr.getCache(CacheName);
			jedis = cache.getJedis();
			for(int kind: kinds) {
				UserHero userHero = this._select(cache, userId, kind);
				if(userHero == null || userHero.isNull()) continue;
				rs.add(userHero);
			}
		}
		finally {
			if(cache != null) cache.release(jedis);
		}
		return rs;
	}
	public UserHero select(int userId, int kind) {
		JedisCache cache = cacheMgr.getCache(CacheName);
		UserHero userHero = this._select(cache, userId, kind);
		return userHero;
	}
	private UserHero _select(JedisCache cache, int userId, int kind) {
		UserHero userHero = null;
		userHero = cache.getFields("uhero", userId+":"+kind, "userId", UserHero.class);//getUserHeroCache(jedis, userId, kind);
		if(userHero != null) return userHero;
		userHero = this.mapper.select(userId, kind);
		if(userHero != null) cache.setFields("uhero", userId+":"+kind, userHero, ExpireMode.Daily.getExpire(3));
		else {
			userHero = new UserHero();
			userHero.setUserId(userId);
			userHero.setKind(kind);
			userHero.setNull(true);
			cache.setFields("uhero", userId+":"+kind, userHero, ExpireMode.Daily.getExpire(3));
		}
		return userHero;
	}
}
