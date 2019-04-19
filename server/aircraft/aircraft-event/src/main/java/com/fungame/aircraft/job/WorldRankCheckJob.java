package com.fungame.aircraft.job;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;
import com.fungame.utils.timer.TimerScheduler;

@Component
public class WorldRankCheckJob implements Runnable {
	private Logger logger = LoggerFactory.getLogger(WorldRankCheckJob.class);
	@Autowired
	WorldRankJob worldRankJob;
	@Autowired
	JedisCacheManager jedisCacheManager;
	
	@PostConstruct
	public void init() {
		TimerScheduler.getInstance().addLoopTask(this, 5*1000, 60*1000);
	}
	
	public void execute() {
		logger.debug("execute check world ranking...");
		JedisCache cache = this.jedisCacheManager.getCache("default");
		try {
			if( ! cache.exits("wrank")) {				
				this.worldRankJob.execute();
			}
		} catch (CacheException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void run() {
		this.execute();
	}

}
