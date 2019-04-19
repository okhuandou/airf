package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.SignCfg;

@Mapper
public interface SignCfgMapper {
	
	@Select("select * from sign_cfg")
	public List<SignCfg> selectAll();
}
