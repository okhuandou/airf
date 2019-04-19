package com.fungame.aircraft.dao;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.mapper.UserGameMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.annotation.CacheableIncr;
import com.fungame.core.cache.annotation.CacheableKVGetFields;
import com.fungame.core.cache.annotation.CacheableKVSet;
import com.fungame.core.cache.annotation.CacheableKVSetFields;
import com.fungame.core.cache.annotation.ExpireMode;

@Repository
public class UserGameDao extends BaseDao {
	@Autowired
	UserGameMapper mapper;
	
	@CacheableKVSetFields(prefix="ugame", suffix="#userGame.id",value="#userGame",expire=3,expireMode=ExpireMode.Daily)
	public void insert(UserGame userGame) {
//		this.mapper.insert(userGame);
		this.flushDbEvent("userGame.insert", userGame);
	}
	
	@CacheableKVGetFields(prefix="ugame", suffix="#userId")
	public UserGame select(int userId) {
		UserGame userGame = this.mapper.select(userId);
		if(userGame != null) {
			this.cacheMgr.getCache(CacheName).setFields("ugame", String.valueOf(userGame.getId()), userGame, 3*24*3600);
		}
		return userGame;
	}
	
	@CacheableIncr(prefix="ugame:coin",suffix="#userId",incr="#incrCoin",checkExist=true,expire=3,expireMode=ExpireMode.Daily)
	public void updateCoin(int userId, int incrCoin, int reason) {
//		this.mapper.updateCoin(userId, incrCoin);
		this.flushDbEvent("userGame.updateCoin2", new JSONObject().fluentPut("userId",userId).fluentPut("incrCoin", incrCoin).fluentPut("reason", reason));
	}
	
	@CacheableKVSet(prefix="ugame:bestscore",suffix="#userId",value="#bestScore",expire=3,expireMode=ExpireMode.Daily)
	public void updateBestScore(int userId, int bestScore) {
//		this.mapper.updateBestScore(userId, bestScore);
		this.flushDbEvent("userGame.updateBestScore", new JSONObject().fluentPut("userId",userId).fluentPut("bestScore", bestScore));
	}
	
	@CacheableIncr(prefix="ugame:qzb",suffix="#userId",incr="#incrQzb",checkExist=true,expire=3,expireMode=ExpireMode.Daily)
	public void updateQzb(int userId, int incrQzb) {
//		this.mapper.updateQzb(userId, incrQzb);
		this.flushDbEvent("userGame.updateQzb", new JSONObject().fluentPut("userId",userId).fluentPut("incrQzb", incrQzb));
	}
	
	public void updateSignIn(int userId, int signNum, int coin, Date signTime) throws CacheException {
//		this.mapper.updateSignIn(userId, signNum, signTime);
		this.flushDbEvent("userGame.updateSignIn", new JSONObject().fluentPut("userId",userId).fluentPut("signNum", signNum).fluentPut("coin", coin).fluentPut("signTime", signTime));
		
		this.cacheMgr.getCache(CacheName).incrby("ugame:coin:"+userId,coin);
		this.cacheMgr.getCache(CacheName).set("ugame:signnum:"+userId, signNum);
		this.cacheMgr.getCache(CacheName).set("ugame:signtime:"+userId, signTime);
	}
    
    public void updateInviteNew(int userId, int inviteNewRecv) throws CacheException {
		this.flushDbEvent("userGame.updateInviteNew", new JSONObject().fluentPut("userId",userId).fluentPut("inviteNewRecv", inviteNewRecv));
		
		this.cacheMgr.getCache(CacheName).set("ugame:invitenewrecv:"+userId, 1);
		this.cacheMgr.getCache(CacheName).set("ugame:invitenewrecvat:"+userId, new Date());
    }
    
	public void updateMoney(int userId, double money) throws CacheException {
		this.cacheMgr.getCache(CacheName).set("ugame:money:"+userId, money);
		this.flushDbEvent("userGame.updateMoney", new JSONObject().fluentPut("userId",userId).fluentPut("money", money));
	}
	
	public void updateMoneyNewUser(int userId, double money, double moneyNewUser) throws CacheException {
		this.cacheMgr.getCache(CacheName).set("ugame:money:"+userId, money);
		this.cacheMgr.getCache(CacheName).set("ugame:moneynewuser:"+userId, moneyNewUser);
		this.flushDbEvent("userGame.updateMoneyNewUser", new JSONObject().fluentPut("userId",userId).fluentPut("money", money).fluentPut("moneyNewUser", moneyNewUser));
	}
}
