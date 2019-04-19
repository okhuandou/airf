package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.ShareLockFunc;

@Mapper
public interface ShareLockFuncMapper {

	@Select("select * from share_lock_func")
	public List<ShareLockFunc> selectAll();

	@Select("select * from share_lock_func where lock_id=#{lockId}")
	public List<ShareLockFunc> selectAllByLockId(@Param("lockId") int lockId);
}
