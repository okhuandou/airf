package com.fungame.aircraft.dao.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fungame.aircraft.dao.entity.UserShareHelp;

@Mapper
public interface UserShareHelpMapper {
	
	@Insert("insert into user_share_help set user_id=#{userId},friend_headimg=#{friendHeadimg},"
			+ "friend_name=#{friendName},created_at=#{createdAt},is_recv=#{isRecv},"
			+ "friend_user_id=#{friendUserId},is_new=#{isNew}")
	@Options(useGeneratedKeys = true, keyColumn="id", keyProperty="id")
	public void insert(UserShareHelp userShareAward);
	
	@Select("select * from user_share_help where user_id=#{userId}")
	public List<UserShareHelp> select(@Param("userId")int userId);

	@Select("select * from user_share_help where id=#{id} and user_id=#{userId}")
	public UserShareHelp selectOne(@Param("id")int id, @Param("userId")int userId);
	
	@Select("select count(1) from user_share_help where user_id=#{userId}")
	public int selectCount(@Param("userId")int userId);

	@Update("update user_share_help set is_recv=1,recv_at=#{recvAt} where id=#{id} and user_id=#{userId} and is_recv = 0")
	public int updateIsReceive(@Param("userId")int userId, @Param("id")int id, @Param("recvAt") Date recvAt);

	@Select("delete from user_share_help where user_id=#{userId} and created_at<#{lastAt}")
	public void delete(@Param("userId")int userId, @Param("lastAt") Date lastAt);
}
