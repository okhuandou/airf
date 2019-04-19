package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.UserTask;

@Mapper
public interface UserTaskMapper {

	@Select("select * from user_task where user_id=#{userId}")
	public List<UserTask> select(@Param("userId")int userId);
	
	@Select("select * from user_task where user_id=#{userId} and task_id=#{taskId}")
	public UserTask selectOne(@Param("userId")int userId, @Param("taskId")int taskId);
	
	@Insert("insert into user_task set user_id=#{userId},task_id=#{taskId},is_complete=#{isComplete}"
			+ ",is_receive=#{isReceive},curr_num=#{currNum},last_modified=#{lastModified}")
	public void insert(UserTask userTask);
	
	@Insert("update user_task set is_complete=#{isComplete}"
			+ ",is_receive=#{isReceive},curr_num=#{currNum},last_modified=#{lastModified}"
			+ " where user_id=#{userId} and task_id=#{taskId}")
	public void update(UserTask userTask);
}
