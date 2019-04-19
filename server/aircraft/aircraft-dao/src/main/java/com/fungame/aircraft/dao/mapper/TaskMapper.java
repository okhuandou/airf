package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.Task;

@Mapper
public interface TaskMapper {

	@Select("select * from task ")
	public List<Task> selectAll();

	@Select("select * from task where id=#{id}")
	public Task select(int id);
}
