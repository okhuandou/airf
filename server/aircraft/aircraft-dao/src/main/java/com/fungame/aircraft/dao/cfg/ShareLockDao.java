package com.fungame.aircraft.dao.cfg;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.ShareLock;
import com.fungame.aircraft.dao.mapper.ShareLockMapper;

@Repository
public class ShareLockDao extends BaseLocalCacheDao<Integer, List<ShareLock>> {
	@Autowired
	ShareLockMapper mapper;
	
	@PostConstruct
	public void init() {
		this.load(1);
	}

	@Override
	public List<ShareLock> load(Integer key) {
		return this.mapper.selectAll();
	}
	
	public List<ShareLock> selectAll() {
		List<ShareLock> list = this.get(1);
		return list;
	}
}
