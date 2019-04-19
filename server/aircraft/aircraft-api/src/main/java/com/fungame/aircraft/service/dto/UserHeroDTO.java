package com.fungame.aircraft.service.dto;

import com.fungame.aircraft.dao.entity.UserHero;

public class UserHeroDTO extends UserHero {
	private int subSeq;
	public int getSubSeq() {
		return subSeq;
	}
	public void setSubSeq(int subSeq) {
		this.subSeq = subSeq;
	}
	@Override
	public String toString() {
		return "UserHeroDTO [subSeq=" + subSeq + ", isNull=" + isNull + ", getUserId()=" + getUserId() + ", getKind()="
				+ getKind() + ", getHeroId()=" + getHeroId() + ", getCreatedAt()=" + getCreatedAt() + ", getStatus()="
				+ getStatus() + ", getLevel()=" + getLevel() + ", getPower()=" + getPower() + ", getBlood()="
				+ getBlood() + ", getPowerLevel()=" + getPowerLevel() + ", getBloodLevel()=" + getBloodLevel()
				+ ", getAttackSpeed()=" + getAttackSpeed() + ", getAttackSpeedLevel()=" + getAttackSpeedLevel()
				+ ", toString()=" + super.toString() + ", isNull()=" + isNull() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + "]";
	}

}
