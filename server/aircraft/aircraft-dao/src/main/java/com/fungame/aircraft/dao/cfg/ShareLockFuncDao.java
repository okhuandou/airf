package com.fungame.aircraft.dao.cfg;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.ShareLockFunc;
import com.fungame.aircraft.dao.mapper.ShareLockFuncMapper;

@Repository
public class ShareLockFuncDao extends BaseLocalCacheDao<Integer, List<ShareLockFunc>> {
	@Autowired
	ShareLockFuncMapper mapper;
	
	@PostConstruct
	public void init() {
	}
	
	@Override
	public List<ShareLockFunc> load(Integer key) {
		List<ShareLockFunc> list = this.mapper.selectAllByLockId(key);
		return list;
	}
	
	public List<ShareLockFunc> selectAll(int lockId) {
		List<ShareLockFunc> list = this.get(lockId);
		return list;
	}
}
