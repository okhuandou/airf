package com.fungame.aircraft.dao.cfg;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.SignCfg;
import com.fungame.aircraft.dao.mapper.SignCfgMapper;

@Repository
public class SignCfgDAO extends BaseLocalCacheDao<Integer, List<SignCfg>> {

	@Autowired
	SignCfgMapper mapper;
	
	@PostConstruct
	public void init() {
		this.load(1);
	}
	
	@Override
	public List<SignCfg> load(Integer key) {
		List<SignCfg> list = this.mapper.selectAll();
		Collections.sort(list, new Comparator<SignCfg>() {
			@Override
			public int compare(SignCfg o1, SignCfg o2) {
				return o1.getId() - o2.getId();
			}
		});
		return list;
	}
	
	public List<SignCfg> selectAll(){
		List<SignCfg> list = this.get(1);
		return list;
	}

}
