package com.fungame.aircraft.service.dto;

public class HeroUpgradeRspDTO {
	private int type;
	private UserHeroDTO hero;
	private int myCoin;
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public UserHeroDTO getHero() {
		return hero;
	}
	public void setHero(UserHeroDTO hero) {
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
		return "HeroUpgradeRspDTO [type=" + type + ", hero=" + hero + ", myCoin=" + myCoin + "]";
	}
}
