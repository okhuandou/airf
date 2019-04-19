package com.fungame.aircraft.dao.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fungame.aircraft.dao.entity.UserGame;

@Mapper
public interface UserGameMapper {
	
	@Insert("insert into user_game set id=#{id},coin=#{coin},qzb=#{qzb},created_at=#{createdAt},"
			+ "best_score=0,sign_num=#{signNum},sign_time=#{signTime},best_score_modified_at=#{bestScoreModifiedAt}")
	public void insert(UserGame userGame);
	
	@Select("select * from user_game where id=#{id}")
	public UserGame select(@Param("id")int id);
	
	@Update("update user_game set coin=coin+#{incrCoin} where id=#{id}")
	public void updateCoin(@Param("id")int id, @Param("incrCoin") int incrCoin);
	
	@Update("update user_game set best_score=#{bestScore},best_score_modified_at=#{bestScoreModifiedAt} where id=#{id}")
	public void updateBestScore(@Param("id")int id, @Param("bestScore") int bestScore, @Param("bestScoreModifiedAt") Date bestScoreModifiedAt);
	
	@Update("update user_game set qzb=qzb+#{incrQzb} where id=#{id}")
	public void updateQzb(@Param("id")int id, @Param("incrQzb") int incrQzb);

	@Update("update user_game set sign_num=#{signNum},sign_time=#{signTime},coin=coin+#{coin} where id=#{id}")
	public void updateSignIn(@Param("id")int id,@Param("signNum")int signNum,@Param("coin")int coin, @Param("signTime")Date signTime);
	
	@Select("select best_score,id from user_game where best_score_modified_at>=#{modifiedStart} order by best_score desc limit #{top}")
	public List<UserGame> getBestScoreTop(@Param("top")int top, @Param("modifiedStart")Date modifiedStart);

	@Update("update user_game set invite_new_recv=#{inviteNewRecv},invite_new_recv_at=#{inviteNewRecvAt} where id=#{id}")
	public void updateInviteNew(@Param("id")int id,@Param("inviteNewRecv")int inviteNewRecv, @Param("inviteNewRecvAt")Date inviteNewRecvAt);
	
	@Update("update user_game set money=#{money} where id=#{id}")
	public void updateMoney(@Param("id")int id, @Param("money") double money);
	
	@Update("update user_game set money=#{money},money_new_user=#{moneyNewUser} where id=#{id}")
	public void updateMoneyNewUser(@Param("id")int id, @Param("money") double money, @Param("moneyNewUser") double moneyNewUser);
}
