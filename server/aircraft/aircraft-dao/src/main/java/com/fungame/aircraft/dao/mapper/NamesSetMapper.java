package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.NamesSet;

@Mapper
public interface NamesSetMapper {
	
	@Select("select * from names_set limit #{offset}, #{limit}")
	public List<NamesSet> select(@Param("offset") int offset, @Param("limit") int limit);
}
