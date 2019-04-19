package com.fungame.aircraft.dao.flush;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.mapper.UserGameMapper;
import com.fungame.core.cache.annotation.CacheableKVGetFields;

@Repository
public class UserGameDao extends BaseDao {
	@Autowired
	UserGameMapper mapper;
	
	@CacheableKVGetFields(prefix="ugame", suffix="#userId")
	public UserGame selectWithCached(int userId) {
		UserGame userGame = this.mapper.select(userId);
		if(userGame != null) {
			this.cacheMgr.getCache(CacheName).setFields("ugame", String.valueOf(userGame.getId()), userGame, 3*24*3600);
		}
		return userGame;
	}
	
	public void insert(UserGame userGame) {
		this.mapper.insert(userGame);
	}
	
	public void updateCoin(int userId, int incrCoin) {
		this.mapper.updateCoin(userId, incrCoin);
	}
	
	public void updateBestScore(int userId, int higthScore) {
		this.mapper.updateBestScore(userId, higthScore, new Date());
	}
	
	public void updateQzb(int userId, int incrQzb) {
		this.mapper.updateQzb(userId, incrQzb);
	}
	
	public List<UserGame> getBestScoreTop(@Param("top")int top, Date modifiedStart) {
		return this.mapper.getBestScoreTop(top, modifiedStart);
	}
	public void updateSignIn(@Param("id")int id,@Param("signNum")int signNum,@Param("coin")int coin, @Param("signTime")Date signTime) {
		this.mapper.updateSignIn(id, signNum, coin, signTime);
	}
	public void updateInviteNew(@Param("id")int id,@Param("inviteNewRecv")int inviteNewRecv, @Param("inviteNewRecvAt")Date inviteNewRecvAt) {
		this.mapper.updateInviteNew(id, inviteNewRecv, inviteNewRecvAt);
	}
	
	public void updateMoney(@Param("userId")int userId, @Param("money") double money) {
		this.mapper.updateMoney(userId, money);
	}
	
	public void updateMoneyNewUser(@Param("userId")int userId, @Param("money") int money, @Param("moneyNewUser") int moneyNewUser) {
		this.mapper.updateMoneyNewUser(userId, money, moneyNewUser);
	}
}
