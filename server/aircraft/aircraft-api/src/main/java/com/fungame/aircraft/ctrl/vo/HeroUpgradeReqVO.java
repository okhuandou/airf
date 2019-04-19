package com.fungame.aircraft.ctrl.vo;

public class HeroUpgradeReqVO {
	private int kind;
	private int type;
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "HeroUpgradeReqVO [kind=" + kind + ", type=" + type + "]";
	}
}
