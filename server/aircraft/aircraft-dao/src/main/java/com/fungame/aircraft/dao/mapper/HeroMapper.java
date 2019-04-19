package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.Hero;

public interface HeroMapper {

	@Select("select * from hero")
	public List<Hero> selectAll();
}
