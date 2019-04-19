package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.RedpackCfg;

@Mapper
public interface RedpackCfgMapper {
	
	@Select("select * from redpack_cfg")
	public List<RedpackCfg> selectAll();
	
	@Select("select * from redpack_cfg where id=#{id}")
	public RedpackCfg select(@Param("id") int id);
}
