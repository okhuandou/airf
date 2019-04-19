package com.fungame.aircraft.dao.entity;

public class Hero {
	private int id;
	private int kind;
	private String name;
	private int access;
	private int accessParam;
	private String descr;
	private int level;
	private int skill;
	private int type;
	private double powerRadix;
	private double attackSpeedRadix;
	private double bloodRadix;
	private int initPower;
	private int initAttackSpeed;
	private int initBlood;
	private int initArmor;
	private int ballistic;
	private int powerNeed;
	private int powerNeedIncr;
	private int attackSpeedNeed;
	private int attackSpeedNeedIncr;
	private int bloodNeed;
	private int bloodNeedIncr;
	private int subSeq;
	
	public int getPowerNeedIncr() {
		return powerNeedIncr;
	}
	public void setPowerNeedIncr(int powerNeedIncr) {
		this.powerNeedIncr = powerNeedIncr;
	}
	public int getAttackSpeedNeedIncr() {
		return attackSpeedNeedIncr;
	}
	public void setAttackSpeedNeedIncr(int attackSpeedNeedIncr) {
		this.attackSpeedNeedIncr = attackSpeedNeedIncr;
	}
	public int getBloodNeedIncr() {
		return bloodNeedIncr;
	}
	public void setBloodNeedIncr(int bloodNeedIncr) {
		this.bloodNeedIncr = bloodNeedIncr;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAccess() {
		return access;
	}
	public void setAccess(int access) {
		this.access = access;
	}
	public int getAccessParam() {
		return accessParam;
	}
	public void setAccessParam(int accessParam) {
		this.accessParam = accessParam;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getSkill() {
		return skill;
	}
	public void setSkill(int skill) {
		this.skill = skill;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public double getPowerRadix() {
		return powerRadix;
	}
	public void setPowerRadix(double powerRadix) {
		this.powerRadix = powerRadix;
	}
	public double getAttackSpeedRadix() {
		return attackSpeedRadix;
	}
	public void setAttackSpeedRadix(double attackSpeedRadix) {
		this.attackSpeedRadix = attackSpeedRadix;
	}
	public double getBloodRadix() {
		return bloodRadix;
	}
	public void setBloodRadix(double bloodRadix) {
		this.bloodRadix = bloodRadix;
	}
	public int getInitPower() {
		return initPower;
	}
	public void setInitPower(int initPower) {
		this.initPower = initPower;
	}
	public int getInitAttackSpeed() {
		return initAttackSpeed;
	}
	public void setInitAttackSpeed(int initAttackSpeed) {
		this.initAttackSpeed = initAttackSpeed;
	}
	public int getInitBlood() {
		return initBlood;
	}
	public void setInitBlood(int initBlood) {
		this.initBlood = initBlood;
	}
	public int getInitArmor() {
		return initArmor;
	}
	public void setInitArmor(int initArmor) {
		this.initArmor = initArmor;
	}
	public int getBallistic() {
		return ballistic;
	}
	public void setBallistic(int ballistic) {
		this.ballistic = ballistic;
	}
	public int getPowerNeed() {
		return powerNeed;
	}
	public void setPowerNeed(int powerNeed) {
		this.powerNeed = powerNeed;
	}
	public int getAttackSpeedNeed() {
		return attackSpeedNeed;
	}
	public void setAttackSpeedNeed(int attackSpeedNeed) {
		this.attackSpeedNeed = attackSpeedNeed;
	}
	public int getBloodNeed() {
		return bloodNeed;
	}
	public void setBloodNeed(int bloodNeed) {
		this.bloodNeed = bloodNeed;
	}
	public int getSubSeq() {
		return subSeq;
	}
	public void setSubSeq(int subSeq) {
		this.subSeq = subSeq;
	}
	@Override
	public String toString() {
		return "Hero [id=" + id + ", kind=" + kind + ", name=" + name + ", access=" + access + ", accessParam="
				+ accessParam + ", descr=" + descr + ", level=" + level + ", skill=" + skill + ", type=" + type
				+ ", powerRadix=" + powerRadix + ", attackSpeedRadix=" + attackSpeedRadix + ", bloodRadix=" + bloodRadix
				+ ", initPower=" + initPower + ", initAttackSpeed=" + initAttackSpeed + ", initBlood=" + initBlood
				+ ", initArmor=" + initArmor + ", ballistic=" + ballistic + ", powerNeed=" + powerNeed
				+ ", powerNeedIncr=" + powerNeedIncr + ", attackSpeedNeed=" + attackSpeedNeed + ", attackSpeedNeedIncr="
				+ attackSpeedNeedIncr + ", bloodNeed=" + bloodNeed + ", bloodNeedIncr=" + bloodNeedIncr + ", subSeq="
				+ subSeq + "]";
	}
}
