package com.fungame.aircraft.event.flushdb;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.dao.flush.UserHeroDao;
import com.fungame.aircraft.event.IEventService;
import com.fungame.core.cache.CacheException;
import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;

@Service
public class UserHeroEvent extends IEventService<UserHero> {
	private static final Logger logger = LoggerFactory.getLogger(UserHeroEvent.class);
	@Autowired
	UserHeroDao userHeroDao;
	
	private List<Object> locks = new ArrayList<>();
	@PostConstruct
	public void init() {
		for(int i=0; i<100000; i++) {
			locks.add(new Object());
		}
	}
	@Override
	public void execute(UserHero data) throws Exception {
		
	}

	public void insert(UserHero userHero) {
		synchronized (this.locks.get(userHero.getUserId() % locks.size())) {			
			try {
				UserHero uhero = this.userHeroDao.select(userHero.getUserId(), userHero.getKind());
				if(uhero != null && ! uhero.isNull()) return;
				
				this.userHeroDao.insert(userHero);
			}
			catch (Throwable e) {
				logger.info("{} {}", e.getMessage(), userHero.toString());
				if(e instanceof MySQLIntegrityConstraintViolationException) {
					if(e.getMessage().contains("Duplicate entry")) {
						return;
					}
				}
				logger.error(userHero.toString(), e);
				throw e;
			}
		}
	}
	
	public void updateStatusJustOne(@Param("userId")int userId, @Param("kind")int kind, 
			@Param("oldStatus")int oldStatus, @Param("status")int status) {
		
		this.userHeroDao.updateStatusAll(userId, status, oldStatus);
		this.userHeroDao.updateStatus(userId, kind, status);
	}
	
	public void updateStatus(@Param("userId")int userId, @Param("kind")int kind, @Param("status")int status) {
		this.userHeroDao.updateStatus(userId, kind, status);
	}
	
	public void updatePower(@Param("userId")int userId, @Param("kind")int kind, 
			@Param("power")int power, @Param("powerLevel")int powerLevel, 
			@Param("heroId")int heroId, @Param("level")int level) throws CacheException {
		this.userHeroDao.updatePower(userId, kind, power, powerLevel, heroId, level);
	}
	
	public void updateAttackSpeed(@Param("userId")int userId, @Param("kind")int kind, 
			@Param("attackSpeed")int attackSpeed, @Param("attackSpeedLevel")int attackSpeedLevel, 
			@Param("heroId")int heroId, @Param("level")int level) {
		this.userHeroDao.updateAttackSpeed(userId, kind, attackSpeed, attackSpeedLevel, heroId, level);
	}
	
	public void updateBlood(@Param("userId")int userId, @Param("kind")int kind, 
			@Param("blood")int blood, @Param("bloodLevel")int bloodLevel, 
			@Param("heroId")int heroId, @Param("level")int level) {
		this.userHeroDao.updateBlood(userId, kind, blood, bloodLevel, heroId, level);
	}
}
