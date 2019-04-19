package com.fungame.aircraft.ctrl.vo;

public class UserShareHelpRecvVO {
	private int id;
	private int remainSec;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRemainSec() {
		return remainSec;
	}
	public void setRemainSec(int remainSec) {
		this.remainSec = remainSec;
	}
	@Override
	public String toString() {
		return "UserShareHelpRecv [id=" + id + ", remainSec=" + remainSec + "]";
	}
}
