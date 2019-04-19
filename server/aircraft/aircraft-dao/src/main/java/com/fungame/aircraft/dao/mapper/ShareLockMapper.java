package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.ShareLock;

@Mapper
public interface ShareLockMapper {

	@Select("select * from share_lock")
	public List<ShareLock> selectAll();
}
