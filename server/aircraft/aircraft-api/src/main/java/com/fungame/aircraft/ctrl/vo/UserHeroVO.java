package com.fungame.aircraft.ctrl.vo;

public class UserHeroVO {
	private int kind;
	private int id;
	private int status;
	private int level;
	private int power;
	private int powerLevel;
	private double attackSpeed;
	private int attackSpeedLevel;
	private int blood;
	private int bloodLevel;
	private int subSeq;	
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public int getPowerLevel() {
		return powerLevel;
	}
	public void setPowerLevel(int powerLevel) {
		this.powerLevel = powerLevel;
	}
	public int getBlood() {
		return blood;
	}
	public void setBlood(int blood) {
		this.blood = blood;
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
	public int getSubSeq() {
		return subSeq;
	}
	public void setSubSeq(int subSeq) {
		this.subSeq = subSeq;
	}
	@Override
	public String toString() {
		return "UserHeroVO [kind=" + kind + ", id=" + id + ", status=" + status + ", level=" + level + ", power="
				+ power + ", powerLevel=" + powerLevel + ", attackSpeed=" + attackSpeed + ", attackSpeedLevel="
				+ attackSpeedLevel + ", blood=" + blood + ", bloodLevel=" + bloodLevel + ", subSeq=" + subSeq + "]";
	}
}
