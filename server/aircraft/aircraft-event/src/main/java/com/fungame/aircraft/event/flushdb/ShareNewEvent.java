package com.fungame.aircraft.event.flushdb;

import org.springframework.beans.factory.annotation.Autowired;

import com.fungame.aircraft.dao.entity.UserShareNew;
import com.fungame.aircraft.dao.flush.UserShareNewDao;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.JedisCacheManager;

public class ShareNewEvent extends IEventService<UserShareNew> {
	@Autowired
	UserShareNewDao mapper;
	@Autowired
	JedisCacheManager cacheMgr;
	public final static String CacheName = "default";

	@Override
	public void execute(UserShareNew data) throws Exception {
		
	}

	public void insert(UserShareNew userShareNew) {
		this.mapper.insert(userShareNew);
	}

}
