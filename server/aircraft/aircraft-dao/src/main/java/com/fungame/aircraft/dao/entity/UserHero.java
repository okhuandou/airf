package com.fungame.aircraft.dao.entity;

import java.util.Date;

public class UserHero extends BaseEntity {
	private int userId;
	private int kind;
	private int heroId;
	private Date createdAt;
	private int status;
	private int level;
	private int power;
	private int powerLevel;
	private double attackSpeed;
	private int attackSpeedLevel;
	private int blood;
	private int bloodLevel;
	
	public final static int STATUS_NOT_GOT = 0;
	public final static int STATUS_GOT = 1;
	public final static int STATUS_FIGHT = 2;
	public final static int STATUS_GET_READY = 3;
	
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public int getHeroId() {
		return heroId;
	}
	public void setHeroId(int heroId) {
		this.heroId = heroId;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getPower() {
		return power;
	}
	public void setPower(int power) {
		this.power = power;
	}
	public int getBlood() {
		return blood;
	}
	public void setBlood(int blood) {
		this.blood = blood;
	}
	public int getPowerLevel() {
		return powerLevel;
	}
	public void setPowerLevel(int powerLevel) {
		this.powerLevel = powerLevel;
	}
	public int getBloodLevel() {
		return bloodLevel;
	}
	public void setBloodLevel(int bloodLevel) {
		this.bloodLevel = bloodLevel;
	}
	public double getAttackSpeed() {
		return attackSpeed;
	}
	public void setAttackSpeed(double attackSpeed) {
		this.attackSpeed = attackSpeed;
	}
	public int getAttackSpeedLevel() {
		return attackSpeedLevel;
	}
	public void setAttackSpeedLevel(int attackSpeedLevel) {
		this.attackSpeedLevel = attackSpeedLevel;
	}
	@Override
	public String toString() {
		return "UserHero [userId=" + userId + ", kind=" + kind + ", heroId=" + heroId + ", createdAt=" + createdAt
				+ ", status=" + status + ", level=" + level + ", power=" + power + ", powerLevel=" + powerLevel
				+ ", attackSpeed=" + attackSpeed + ", attackSpeedLevel=" + attackSpeedLevel + ", blood=" + blood
				+ ", bloodLevel=" + bloodLevel + ", isNull=" + isNull + "]";
	}
	
}
