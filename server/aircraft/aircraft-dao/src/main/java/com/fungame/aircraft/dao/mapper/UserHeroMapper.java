package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fungame.aircraft.dao.entity.UserHero;

@Mapper
public interface UserHeroMapper {
	
	@Insert("insert into user_hero set user_id=#{userId}, hero_id=#{heroId},kind=#{kind},"
			+ "created_at=#{createdAt},status=#{status},level=#{level},power=#{power},"
			+ "power_level=#{powerLevel},attack_speed=#{attackSpeed},attack_speed_level=#{attackSpeedLevel},"
			+ "blood=#{blood},blood_level=#{bloodLevel}")
	public void insert(UserHero userHero);
	
	@Update("update user_hero set status=#{status} where user_id=#{userId} and kind=#{kind}")
	public void updateStatus(@Param("userId") int userId, @Param("kind") int kind, @Param("status") int status);
	
	@Update("update user_hero set status=#{status} where user_id=#{userId} and status=#{oldStatus}")
	public void updateStatusAll(@Param("userId") int userId, @Param("status") int status, @Param("oldStatus") int oldStatus);
	
	@Update("update user_hero set power=#{power},power_level=#{powerLevel},level=#{level},hero_id=#{heroId} where user_id=#{userId} and kind=#{kind}")
	public void updatePower(@Param("userId") int userId, @Param("kind") int kind, 
			@Param("power") int power, @Param("powerLevel") int powerLevel, 
			@Param("heroId")int heroId, @Param("level") int level);
	
	@Update("update user_hero set attack_speed=#{attackSpeed},attack_speed_level=#{attackSpeedLevel},level=#{level},hero_id=#{heroId} where user_id=#{userId} and kind=#{kind}")
	public void updateAttackSpeed(@Param("userId") int userId, @Param("kind") int kind, 
			@Param("attackSpeed") int attackSpeed, @Param("attackSpeedLevel") int attackSpeedLevel, 
			@Param("heroId")int heroId, @Param("level") int level);
	
	@Update("update user_hero set blood=#{blood},blood_level=#{bloodLevel},level=#{level},hero_id=#{heroId} where user_id=#{userId} and kind=#{kind}")
	public void updateBlood(@Param("userId") int userId, @Param("kind") int kind, 
			@Param("blood") int blood, @Param("bloodLevel") int bloodLevel, 
			@Param("heroId")int heroId, @Param("level") int level);
	
	@Select("select * from user_hero where user_id=#{userId} ")
	public List<UserHero> selectAll(@Param("userId") int userId);
	
	@Select("select * from user_hero where user_id=#{userId} and kind=#{kind}")
	public UserHero select(@Param("userId") int userId, @Param("kind") int kind);
	
	@Select("select * from user_hero where user_id=#{userId} order by level desc limit 1")
	public UserHero selectBestOne(@Param("userId") int userId);
}
