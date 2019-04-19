package com.fungame.aircraft.dao.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.UserShareNew;
@Mapper
public interface UserShareNewMapper {

	@Insert("insert into user_share_new set user_id=#{userId},friend_user_id=#{friendUserId},friend_headimg=#{friendHeadimg},friend_name=#{friendName},created_at=#{createdAt}")
	@Options(useGeneratedKeys = true, keyColumn="id", keyProperty="id")
	public void insert(UserShareNew userShareAward);
	
	@Select("select * from user_share_new where user_id=#{userId}")
	public List<UserShareNew> select(@Param("userId")int userId);
	
	@Select("delete from user_share_new where user_id=#{userId} and created_at<#{lastAt}")
	public void delete(@Param("userId")int userId, @Param("lastAt") Date lastAt);
	
	@Select("select count(1) from user_share_new where user_id=#{userId}")
	public int selectCount(@Param("userId")int userId);
	
	@Select("delete from user_share_new where user_id=#{userId}")
	public void deleteAll(@Param("userId")int userId);
}
