package com.fungame.aircraft.dao.flush;

import org.springframework.beans.factory.annotation.Autowired;

import com.fungame.core.cache.JedisCacheManager;

public class BaseDao {
	@Autowired
	JedisCacheManager cacheMgr;
	
	public final static String CacheName = "default";
	
}
