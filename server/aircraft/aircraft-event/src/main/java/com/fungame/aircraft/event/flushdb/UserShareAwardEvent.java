package com.fungame.aircraft.event.flushdb;

import java.util.Date;

import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.UserShareAward;
import com.fungame.aircraft.dao.mapper.UserShareAwardMapper;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCacheManager;

@Service
public class UserShareAwardEvent extends IEventService<UserShareAward> {
	private static final Logger logger = LoggerFactory.getLogger(UserShareAwardEvent.class);
	@Autowired
	UserShareAwardMapper mapper;
	@Autowired
	JedisCacheManager cacheMgr;
	@Autowired
	UserTouchShareEvent event;
	
	public final static String CacheName = "default";

	@Override
	public void execute(UserShareAward data) throws Exception {
		
	}

	public void insert(UserShareAward userShareAward) {
		try {
			this.event.addAwardFriend(userShareAward.getUserId(), userShareAward.getFriendUserId(), userShareAward.getFriendName(), userShareAward.getFriendHeadimg());
		} catch (CacheException e) {
			logger.error(null, e);
		}
	}

	public void updateIsReceive(@Param("userId")int userId, @Param("id")int id) throws CacheException {
		this.mapper.updateIsReceive(userId, id, new Date());
	}
}
