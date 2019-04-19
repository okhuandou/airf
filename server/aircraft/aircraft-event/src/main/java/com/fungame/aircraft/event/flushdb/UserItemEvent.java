package com.fungame.aircraft.event.flushdb;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.UserItem;
import com.fungame.aircraft.dao.mapper.UserItemMapper;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.JedisCacheManager;

@Service
public class UserItemEvent extends IEventService<UserItem> {
	@Autowired
	UserItemMapper mapper;
	@Autowired
	JedisCacheManager cacheMgr;
	public final static String CacheName = "default";

	@Override
	public void execute(UserItem data) throws Exception {
		
	}

	public void insert(UserItem item) {
		if(this.mapper.selectOne(item.getUserId(), item.getId()) != null) return ;
		this.mapper.insert(item);
	}
	
	public void updateNum(@Param("userId") int userId, @Param("id") int id, @Param("incrNum") int incrNum) {
		this.mapper.updateNum(userId, id, incrNum);
	}
}
