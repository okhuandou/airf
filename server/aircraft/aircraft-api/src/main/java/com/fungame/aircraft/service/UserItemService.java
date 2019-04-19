package com.fungame.aircraft.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.UserItemDao;
import com.fungame.aircraft.dao.entity.UserItem;
import com.fungame.core.cache.CacheException;

@Service
public class UserItemService {
	@Autowired
	UserItemDao userItemDao;
	
	public List<UserItem> getItems(int userId) throws CacheException {
		List<UserItem> items = this.userItemDao.select(userId);
		return items;
	}
	
	public void addItem(int userId, int itemId, int itemNum) throws CacheException {
		UserItem userItem = this.userItemDao.selectOne(userId, itemId, false);
		if(userItem == null) {
			userItem = new UserItem();
			userItem.setId(itemId);
			userItem.setNum(itemNum);
			userItem.setUserId(userId);
			this.userItemDao.insert(userItem);
		}
		else {
			this.userItemDao.updateNum(userId, itemId, itemNum);
		}
	}
}
