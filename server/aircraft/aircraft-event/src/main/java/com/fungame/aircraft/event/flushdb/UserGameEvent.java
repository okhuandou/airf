package com.fungame.aircraft.event.flushdb;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.Task;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.flush.UserGameDao;
import com.fungame.aircraft.event.IEventService;
import com.fungame.aircraft.service.UserTaskService;
import com.fungame.core.cache.CacheException;
import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;

@Service
public class UserGameEvent extends IEventService<UserGame> {
	private static final Logger logger = LoggerFactory.getLogger(UserGameEvent.class);
	@Autowired
	UserGameDao userGameDao;
	@Autowired
	UserTaskService userTaskService;

	private List<Object> locks = new ArrayList<>();
	@PostConstruct
	public void init() {
		for(int i=0; i<100000; i++) {
			locks.add(new Object());
		}
	}
	@Override
	public void execute(UserGame data) throws Exception {
	}

	public void insert(UserGame userGame) {
		synchronized (this.locks.get(userGame.getId() % locks.size())) {				
			try {
				UserGame tugame = this.userGameDao.selectWithCached(userGame.getId());
				if(tugame != null && tugame.getId() > 0) {
					return ;
				}
				this.userGameDao.insert(userGame);
			}
			catch (Throwable e) {
				if(e instanceof MySQLIntegrityConstraintViolationException) {
					logger.info("{} {}", e.getMessage(), userGame.toString());
					if(e.getMessage().contains("Duplicate entry")) {
						return;
					}
				}
				logger.error(userGame.toString(), e);
				throw e;
			}
		}
	}
	
	public void updateCoin(@Param("userId")int userId, @Param("incrCoin")int incrCoin) throws CacheException {
		this.userGameDao.updateCoin(userId, incrCoin);
	}
	
	public void updateCoin2(@Param("userId")int userId, @Param("incrCoin")int incrCoin, @Param("reason") int reason) throws CacheException {
		this.userGameDao.updateCoin(userId, incrCoin);
		
		if(incrCoin > 0) {
			this.userTaskService.doTask(userId, Task.TaskKind_GetCoin, incrCoin);
		}
		if(reason == 1001) {
			this.userTaskService.doTask(userId, Task.TaskKind_Upgrade_CostCoin, Math.abs(incrCoin));
		}
		else if(reason == 1003) {
			this.userTaskService.doTask(userId, Task.TaskKind_Figth, 1);
		}
	}
	
	public void updateBestScore(@Param("userId")int userId, @Param("bestScore")int bestScore) {
		this.userGameDao.updateBestScore(userId, bestScore);
	}
	
	public void updateQzb(@Param("userId")int userId, @Param("incrQzb")int incrQzb) {
		this.userGameDao.updateQzb(userId, incrQzb);
	}
	
	public void updateSignIn(@Param("userId")int userId, @Param("signNum")int signNum, @Param("coin")int coin, @Param("signTime")Date signTime) {
		this.userGameDao.updateSignIn(userId, signNum, coin, signTime);
	}
	
	public void updateInviteNew(@Param("userId") int userId, @Param("inviteNewRecv") int inviteNewRecv) {
		this.userGameDao.updateInviteNew(userId, inviteNewRecv, new Date());
	}
	
	public void updateMoney(@Param("userId") int userId, @Param("money") double money) {
		this.userGameDao.updateMoney(userId, money);
	}
	
	public void updateMoneyNewUser(@Param("userId")int userId, @Param("money") int money, @Param("moneyNewUser") int moneyNewUser) {
		this.userGameDao.updateMoneyNewUser(userId, money, moneyNewUser);
	}
}
