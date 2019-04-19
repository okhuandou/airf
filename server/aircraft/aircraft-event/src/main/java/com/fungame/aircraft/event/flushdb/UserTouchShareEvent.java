package com.fungame.aircraft.event.flushdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.entity.Task;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserShareAward;
import com.fungame.aircraft.dao.entity.UserShareHelp;
import com.fungame.aircraft.dao.entity.UserShareNew;
import com.fungame.aircraft.dao.flush.UserShareAwardDao;
import com.fungame.aircraft.dao.flush.UserShareHelpDao;
import com.fungame.aircraft.dao.flush.UserShareNewDao;
import com.fungame.aircraft.event.IEventService;
import com.fungame.aircraft.service.UserTaskService;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;
@Service
public class UserTouchShareEvent extends IEventService<Object> {
	@Autowired
	UserShareNewDao userShareNewDao;
	@Autowired
	UserShareAwardDao userShareAwardDao;
	@Autowired
	DictCfgDao dictCfgDao;
	@Autowired
	JedisCacheManager cacheMgr;
	@Autowired
	UserTaskService userTaskService;
	@Autowired
	UserShareHelpDao userShareHelpDao;

	
	public final static String CacheName = "default";

	@Override
	public void execute(Object data) throws Exception {
		
	}

	public void touch(@Param("userBase") UserBase userBase, @Param("isNewUser") boolean isNewUser, 
			@Param("fromUserId") int fromUserId, @Param("fromType") String fromType) throws CacheException {
		
		if(fromUserId > 0) {
			String friendName = userBase.getName();
			String friendHeadimg = userBase.getImg();
			int friendUserId = userBase.getId();
			if("shareHelp".equals(fromType)) {
				this.addHelpFriend(fromUserId, friendUserId, friendName, friendHeadimg, isNewUser);
			}
			else {
				this.addAwardFriend(fromUserId, friendUserId, friendName, friendHeadimg);
			}
			if(isNewUser) {
				this.addInviteNewFriend(fromUserId, friendUserId, friendName, friendHeadimg);
			}
			
			userTaskService.doTask(fromUserId, Task.TaskKind_InviteFriend, 1);
		}
	}
	
	public void addHelpFriend(int userId, int friendUserId, String friendName, String friendHeadimg, boolean isNewUser) throws CacheException {
		if(userId == friendUserId) {
			return;
		}
		int cnt = this.userShareHelpDao.selectCount(userId);
		int size = this.dictCfgDao.intValue(DictCfg.ShareHelpCount, 3);
		if(cnt >= size) {
			return;
		}
		List<UserShareHelp> list = this.userShareHelpDao.select(userId);
		if(list != null) {
			for(UserShareHelp tmp: list) {
				if(tmp.getFriendUserId() == friendUserId) {
					return ;
				}
			}
		}
		UserShareHelp award = new UserShareHelp();
		award.setCreatedAt(new Date());
		award.setUserId(userId);
		award.setFriendUserId(friendUserId);
		award.setFriendHeadimg(friendHeadimg);
		award.setFriendName(friendName);
		award.setIsRecv(0);
		award.setIsNew(isNewUser ? 1 : 0);
		this.userShareHelpDao.insert(award);
		
		try {
			JedisCache cache = null;
			cache = cacheMgr.getCache(CacheName);
			cache.del("uhelp:"+userId);
		} catch (CacheException e) {
		}
	}
	
	public void addAwardFriend(int userId, int friendUserId, String friendName, String friendHeadimg) throws CacheException {
		if(userId == friendUserId) {
			return;
		}
		int cnt = this.userShareAwardDao.selectCount(userId);
		JSONArray arr = this.dictCfgDao.jsonArrayValue(DictCfg.ShareAwardCoin, "[200,200,300,300,500,500]");
		if(cnt >= arr.size()) {
			return;
		}
		List<UserShareAward> list = this.userShareAwardDao.select(userId);
		if(list != null) {
			for(UserShareAward tmp: list) {
				if(tmp.getFriendUserId() == friendUserId) {
					return ;
				}
			}
		}
		UserShareAward award = new UserShareAward();
		award.setCreatedAt(new Date());
		award.setFriendHeadimg(friendHeadimg);
		award.setFriendName(friendName);
		award.setIsRecv(0);
		award.setUserId(userId);
		award.setFriendUserId(friendUserId);
		this.userShareAwardDao.insert(award);
		
		try {
			JedisCache cache = null;
			cache = cacheMgr.getCache(CacheName);
			cache.del("ushare:"+userId);
		} catch (CacheException e) {
		}
	}
	
	public void addInviteNewFriend(int userId, int friendUserId, String friendName, String friendHeadimg) throws CacheException {
		if(userId == friendUserId) {
			return;
		}
		int cnt = this.userShareNewDao.selectCount(userId);
		int cfgSize = 3;
		if(cnt >= cfgSize) {
			return;
		}
		List<UserShareNew> list = this.userShareNewDao.select(userId);
		if(list != null) {
			for(UserShareNew tmp: list) {
				if(tmp.getFriendUserId() == friendUserId) {
					return;
				}
			}
		}
		UserShareNew newUserShare = new UserShareNew();
		newUserShare.setCreatedAt(new Date());
		newUserShare.setFriendHeadimg(friendHeadimg);
		newUserShare.setFriendName(friendName);
		newUserShare.setFriendUserId(friendUserId);
		newUserShare.setUserId(userId);
		this.userShareNewDao.insert(newUserShare);
		
		try {
			JedisCache cache = null;
			cache = cacheMgr.getCache(CacheName);
			cache.del("unew:"+userId);
		} catch (CacheException e) {
		}
	}
}
