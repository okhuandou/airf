package com.fungame.aircraft.event.flushdb;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.UserMatch;
import com.fungame.aircraft.dao.mapper.UserMatchMapper;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.JedisCacheManager;
@Service
public class UserMatchEvent extends IEventService<UserMatch> {
	@Autowired
	UserMatchMapper mapper;
	@Autowired
	JedisCacheManager cacheMgr;
	public final static String CacheName = "default";

	private List<Object> locks = new ArrayList<>();
	@PostConstruct
	public void init() {
		for(int i=0; i<100000; i++) {
			locks.add(new Object());
		}
	}
	@Override
	public void execute(UserMatch data) throws Exception {
		
	}
	
	public void insert(UserMatch userMatch) {
		synchronized (this.locks.get(userMatch.getUserId() % locks.size())) {				
			UserMatch match = this.mapper.selectOne(userMatch.getUserId(), userMatch.getFriendUserId());
			if(match == null) {
				this.mapper.insert(userMatch);
			}
			else {
				this.mapper.update(userMatch);
			}
		}
	}
	
	public void update(UserMatch userMatch) {
		this.mapper.update(userMatch);
	}
	
	public void delete(@Param("userId")int userId) {
		this.mapper.delete(userId);
	}
	
	public void insertNew(UserMatch userMatch) {
		this.delete(userMatch.getUserId());
		this.insert(userMatch);
	}
}
