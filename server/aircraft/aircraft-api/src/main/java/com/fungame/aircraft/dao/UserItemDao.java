package com.fungame.aircraft.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.UserItem;
import com.fungame.aircraft.dao.mapper.UserItemMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableKVSetFields;
import com.fungame.core.cache.annotation.ExpireMode;

@Repository
public class UserItemDao extends BaseDao {
	@Autowired
	UserItemMapper mapper;

	public UserItem selectOne(int userId, int id, boolean isNullCached) throws CacheException {
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		UserItem item = cache.getFields("uitem", userId+":"+id, "id", UserItem.class);
		if(item == null || item.isNull()) {
			return null;
		}
		item = this.mapper.selectOne(userId, id);
		if(item != null) {
			cache.setFields("uitem", userId+":"+id, item, ExpireMode.Daily.getExpire(3));
		}
		else {
			if(isNullCached) {				
				item = new UserItem();
				item.setId(id);
				item.setUserId(userId);
				item.setNull(true);
				cache.setFields("uitem", userId+":"+id, item, ExpireMode.Daily.getExpire(3));
			}
		}
		return item;
	}
	public List<UserItem> select(int userId) throws CacheException {
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		List<Integer> ids = cache.list("uitemids:"+userId, Integer.class);
		List<UserItem> list = new ArrayList<>();
		if(ids != null && ! ids.isEmpty()) {
			for(int id: ids) {
				if(id == 0) continue;
				UserItem item = cache.getFields("uitem", userId+":"+id, "id", UserItem.class);
				if(item == null) continue;
				if(item.getNum() <= 0) continue;
				list.add(item);
			}
		}
		else {
			list = this.mapper.select(userId);
			if(list != null && ! list.isEmpty()) {
				for(UserItem item: list) {
					if(item.getNum() <= 0) continue;
					cache.setFields("uitem", userId+":"+item.getId(), item, ExpireMode.Daily.getExpire(3));
					cache.lpush("uitemids:"+userId, item.getId());
				}
			}
			else cache.lpush("uitemids:"+userId, 0);
			cache.expire("uitemids:"+userId, ExpireMode.Daily.getExpire(3));
		}
		return list;
	}
	
	@CacheableKVSetFields(prefix="uitem", suffix={"#item.userId","#item.id"},value="#item",expire=3,expireMode=ExpireMode.Daily)
	public void insert(UserItem item) throws CacheException {
//		this.mapper.insert(item);
		this.flushDbEvent("userItem.insert", item);
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		cache.lpush("uitemids:"+item.getUserId(), item.getId());
	}
	
	public void updateNum(int userId, int id, int incrNum) throws CacheException {
//		this.mapper.update(item);
		this.cacheMgr.getCache(CacheName).incrby("uitem:num:"+userId+":"+id, incrNum);
		this.flushDbEvent("userItem.updateNum", new JSONObject().fluentPut("userId", userId).fluentPut("id", id).fluentPut("incrNum", incrNum));
	}
	
}
