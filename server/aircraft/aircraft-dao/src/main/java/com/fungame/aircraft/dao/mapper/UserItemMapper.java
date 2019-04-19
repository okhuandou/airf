package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fungame.aircraft.dao.entity.UserItem;
@Mapper
public interface UserItemMapper {

	@Select("select * from user_item where user_id=#{userId}")
	public List<UserItem> select(@Param("userId") int userId);

	@Select("select * from user_item where user_id=#{userId} and id=#{id}")
	public UserItem selectOne(@Param("userId") int userId, @Param("id") int id);
	
	@Insert("insert into user_item set user_id=#{userId},id=#{id},num=#{num}")
	public void insert(UserItem item);
	
	@Update("update user_item set num=num+#{incrNum} where user_id=#{userId} and id=#{id}")
	public void updateNum(@Param("userId") int userId, @Param("id") int id, @Param("incrNum") int incrNum);
	
}
