package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fungame.aircraft.dao.entity.UserMatch;

@Mapper
public interface UserMatchMapper {
	
	@Insert("insert into user_match set user_id=#{userId},friend_user_id=#{friendUserId},"
			+ "friend_name=#{friendName},friend_headimg=#{friendHeadimg},created_at=#{createdAt},"
			+ "score=#{score},success=#{success},award=#{award},award_got=#{awardGot},"
			+ "hero_kind=#{heroKind},hero_seq=#{heroSeq}")
	public void insert(UserMatch userMatch);
	
	@Insert("update user_match set "
			+ "friend_name=#{friendName},friend_headimg=#{friendHeadimg},created_at=#{createdAt},"
			+ "score=#{score},success=#{success},award=#{award},award_got=#{awardGot},"
			+ "hero_kind=#{heroKind},hero_seq=#{heroSeq} where user_id=#{userId} and friend_user_id=#{friendUserId}")
	public void update(UserMatch userMatch);
	
	@Select("select * from user_match where user_id=#{userId}")
	public List<UserMatch> select(@Param("userId") int userId);
	
	@Select("select * from user_match where user_id=#{userId} and friend_user_id=#{friendUserId}")
	public UserMatch selectOne(@Param("userId") int userId, @Param("friendUserId") int friendUserId);
	
	@Delete("delete from user_match where user_id=#{userId} ")
	public void delete(@Param("userId") int userId);
}
