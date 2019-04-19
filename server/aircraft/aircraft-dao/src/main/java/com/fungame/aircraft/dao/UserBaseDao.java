package com.fungame.aircraft.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.mapper.UserBaseMapper;
import com.fungame.core.cache.annotation.CacheableKV;
import com.fungame.core.cache.annotation.CacheableKVSetExpire;
import com.fungame.core.cache.annotation.ExpireMode;

@Repository
public class UserBaseDao {
	@Autowired
	UserBaseMapper mapper;
	
	@CacheableKVSetExpire(prefix="user", suffix="#userBase.openid",value="#userBase",expire=1,expireMode=ExpireMode.Daily)
	public void insert(UserBase userBase) {
		mapper.insert(userBase);
	}
	
	public Integer selectIdByOpenid(String openid) {
		Integer id = this.mapper.selectIdByOpenid(openid);
		return id == null ? 0 : id;
	}
	
	@CacheableKV(prefix="user", suffix="#openid",expire=3,expireMode=ExpireMode.Daily,addIfNull=true)
	public UserBase select(String openid) {
		return this.mapper.select(openid);
	}
	
	@CacheableKV(prefix="iuser", suffix="#id",expire=3,expireMode=ExpireMode.Daily,addIfNull=true)
	public UserBase selectById(int id) {
		return this.mapper.selectById(id);
	}
}
