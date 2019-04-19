package com.fungame.aircraft.event.flushdb;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.UserBaseDao;
import com.fungame.aircraft.dao.entity.UserShareHelp;
import com.fungame.aircraft.dao.flush.UserShareHelpDao;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;

@Service
public class ShareHelpEvent extends IEventService<UserShareHelp> {
	@Autowired
	UserShareHelpDao mapper;
	@Autowired
	JedisCacheManager cacheMgr;
	@Autowired
	UserBaseDao userBaseDao;
	public final static String CacheName = "default";
	
	@Override
	public void execute(UserShareHelp data) throws Exception {
		
	}

	public void insert(UserShareHelp userShareHelp) {
		this.mapper.insert(userShareHelp);
		try {
			JedisCache cache = null;
			cache = cacheMgr.getCache(CacheName);
			cache.del("uhelp:"+userShareHelp.getUserId());
		} catch (CacheException e) {
		}
	}
	public void updateIsReceive(@Param("userId")int userId, @Param("id")int id) {
		this.mapper.updateIsReceive(userId, id);
	}
}
