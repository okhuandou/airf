package com.fungame.aircraft.dao;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.cfg.BaseLocalCacheDao;
import com.fungame.aircraft.dao.entity.NamesSet;
import com.fungame.aircraft.dao.mapper.NamesSetMapper;

@Repository
public class NamesSetDao extends BaseLocalCacheDao<Integer, List<NamesSet>> {
	@Autowired
	NamesSetMapper mapper;
	
	@Override
	public List<NamesSet> load(Integer key) {
		return this.mapper.select(RandomUtils.nextInt(0, 100), 1000);
	}
	
	public List<NamesSet> getLimit(int limit) {
		List<NamesSet> list = new ArrayList<>();
		List<NamesSet> all = this.get(1);
		for(int i=0; i<limit; i++) {
			list.add(all.get(RandomUtils.nextInt(0, all.size())));
		}
		return list;
	}
}
