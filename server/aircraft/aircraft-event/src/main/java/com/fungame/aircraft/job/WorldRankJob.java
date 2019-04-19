package com.fungame.aircraft.job;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fungame.aircraft.dao.UserBaseDao;
import com.fungame.aircraft.dao.cfg.HeroDao;
import com.fungame.aircraft.dao.entity.Hero;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.dao.entity.WorldRank;
import com.fungame.aircraft.dao.flush.UserGameDao;
import com.fungame.aircraft.dao.flush.UserHeroDao;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;
import com.fungame.utils.mapper.JSONMapper;
import com.fungame.utils.timer.TimerScheduler;

@Component
public class WorldRankJob implements Runnable {
	private Logger logger = LoggerFactory.getLogger(WorldRankJob.class);
	@Autowired
	UserGameDao userGameDao;
	@Autowired
	UserBaseDao userBaseDao;
	@Autowired
	JedisCacheManager jedisCacheManager;
	@Autowired
	UserHeroDao userHeroDao;
	@Autowired
	HeroDao heroDao;
	ReentrantLock lock = new ReentrantLock();
	
	@PostConstruct
	public void init() {
		TimerScheduler.getInstance().addLoopTask(this, 5*1000, 5*60*1000);
	}
	
	//每周第一天第一时刻
	private Date cnWeekFirstDayStartTime() {
		Calendar cal = Calendar.getInstance();
		if(cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
			cal.set(Calendar.DAY_OF_MONTH, cal.get(Calendar.DAY_OF_MONTH) - 6);
		}
		else cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		Date modifiedStart = cal.getTime();
		return modifiedStart;
	}
	public void execute() {
		if(lock.isLocked()) return;
		try {
			logger.info("execute world ranking...");
			lock.lock();
			JedisCache cache = this.jedisCacheManager.getCache("default");
//			Date lastUpdateAt = cache.get("wrankLastUpdate", Date.class);
			Date modifiedStart = this.cnWeekFirstDayStartTime();
//			if(lastUpdateAt != null && lastUpdateAt.before(modifiedStart)) {
//				cache.del("wrank");
//			}
			List<UserGame> userGames = this.userGameDao.getBestScoreTop(50, modifiedStart);
			logger.info("at time {} best score top size={}", modifiedStart.getTime(), userGames.size());
			cache.del("wrank");
			for(UserGame ug: userGames) {
				UserBase user = this.userBaseDao.selectById(ug.getId());
				if(user == null || StringUtils.isBlank(user.getImg())) continue;
				WorldRank rank = new WorldRank();
				rank.setId(ug.getId());
				rank.setAvatarUrl(user.getImg());
				rank.setNickname(user.getName());
				rank.setScore(ug.getBestScore());
				UserHero userHero = this.userHeroDao.selectBestOne(ug.getId());
				if(userHero == null) {
					logger.warn("user {} hero is null", ug.getId());
					continue;
				}
				Hero hero = this.heroDao.getHeroCfgByHeroId(userHero.getHeroId(), userHero.getKind());
				rank.setHero(hero.getKind()+"_"+hero.getSubSeq());
				try {
					cache.zadd("wrank", ug.getBestScore(), JSONMapper.toJSONString(rank));
				} catch (CacheException e) {
					logger.error(null, e);
				}
			}
			cache.set("wrankLastUpdate", new Date());
		}
		catch (Exception e) {
			logger.error(null, e);
		}
		finally {
			lock.unlock();
		}
	}

	@Override
	public void run() {
		this.execute();
	}
}
