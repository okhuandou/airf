package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.entity.WorldRank;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.JedisCacheManager;

@Service
public class RankService {
	@Autowired
	JedisCacheManager jedisCacheManager;

	public List<WorldRank> getWorldRankList() throws CacheException {
		List<WorldRank> list = new ArrayList<>();
		JedisCache cache = jedisCacheManager.getCache("default");		
		list = cache.zrevrange("wrank", 0, -1, WorldRank.class);
//		list = new ArrayList<>();
//		WorldRank r = new WorldRank();
//		r.setHero("1_1");
//		r.setId(1);
//		r.setAvatarUrl("");
//		r.setNickname("abcdd");
//		r.setScore(3333);
//		list.add(r);
//		
		return list;
	}
}
