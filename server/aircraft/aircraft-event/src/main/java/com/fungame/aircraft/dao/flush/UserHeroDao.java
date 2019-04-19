package com.fungame.aircraft.dao.flush;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.dao.mapper.UserHeroMapper;

@Repository
public class UserHeroDao extends BaseDao {
	@Autowired
	UserHeroMapper mapper;
	
	public void insert(UserHero userHero) {
		this.mapper.insert(userHero);
	}
	
	public void updateStatus(int userId, int kind, int status) {
		this.mapper.updateStatus(userId, kind, status);
	}
	
	public void updateStatusAll(int userId, int status, int oldStatus) {
		this.mapper.updateStatusAll(userId, status, oldStatus);
	}
	
	public void updatePower(int userId, int kind, int power, int powerLevel, int heroId, int level) {
		this.mapper.updatePower(userId, kind, power, powerLevel, heroId, level);
	}
	
	public void updateAttackSpeed(int userId, int kind, int attackSpeed, int attackSpeedLevel, int heroId, int level) {
		this.mapper.updateAttackSpeed(userId, kind, attackSpeed, attackSpeedLevel, heroId, level);
	}
	
	public void updateBlood(int userId, int kind, int blood, int bloodLevel, int heroId, int level) {
		this.mapper.updateBlood(userId, kind, blood, bloodLevel, heroId, level);
	}
	
	public UserHero selectBestOne(@Param("userId") int userId) {
		return this.mapper.selectBestOne(userId);
	}
	public UserHero select(int userId, int kind) {
		UserHero userHero = this.mapper.select(userId, kind);
		return userHero;
	}
}
