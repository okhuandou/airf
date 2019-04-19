package com.fungame.aircraft.ctrl.vo;

public class HeroUpgradeRspVO {
	private int type;
	private UserHeroVO hero;
	private int myCoin;
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public UserHeroVO getHero() {
		return hero;
	}
	public void setHero(UserHeroVO hero) {
		this.hero = hero;
	}
	public int getMyCoin() {
		return myCoin;
	}
	public void setMyCoin(int myCoin) {
		this.myCoin = myCoin;
	}
	@Override
	public String toString() {
		return "HeroUpgradeRspVO [type=" + type + ", hero=" + hero + ", myCoin=" + myCoin + "]";
	}
	
}
