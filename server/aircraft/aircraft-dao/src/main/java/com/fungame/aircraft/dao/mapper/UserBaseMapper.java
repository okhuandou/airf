package com.fungame.aircraft.dao.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.UserBase;

@Mapper
public interface UserBaseMapper {
	
	@Insert("insert into user_base set openid=#{openid},unionid=#{unionid},session_key=#{sessionKey},created_at=#{createdAt},name=#{name},img=#{img}")
	@Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
	public void insert(UserBase userBase);
	
	@Select("select id from user_base where openid=#{openid} limit 1")
	public Integer selectIdByOpenid(@Param("openid") String openid);
	
	@Select("select * from user_base where openid=#{openid} limit 1")
	public UserBase select(@Param("openid") String openid);
	
	@Select("select * from user_base where id=#{id} limit 1")
	public UserBase selectById(@Param("id") int id);
}
