package com.fungame.aircraft.ctrl.vo;

public class HeroUpdateStatusVO {
	private int kind;
	private int fromStatus;
	private int toStatus;
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public int getFromStatus() {
		return fromStatus;
	}
	public void setFromStatus(int fromStatus) {
		this.fromStatus = fromStatus;
	}
	public int getToStatus() {
		return toStatus;
	}
	public void setToStatus(int toStatus) {
		this.toStatus = toStatus;
	}
	@Override
	public String toString() {
		return "HeroUpdateStatusVO [kind=" + kind + ", fromStatus=" + fromStatus + ", toStatus=" + toStatus + "]";
	}
	
}
