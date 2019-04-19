package com.fungame.aircraft.ctrl.vo;

public class UserShareAwardVO {
	private int id;
	private String headimg;
	private String name;
	private int award;
	private int isRecv;
	private int remainSec;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getHeadimg() {
		return headimg;
	}
	public void setHeadimg(String headimg) {
		this.headimg = headimg;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAward() {
		return award;
	}
	public void setAward(int award) {
		this.award = award;
	}
	public int getIsRecv() {
		return isRecv;
	}
	public void setIsRecv(int isRecv) {
		this.isRecv = isRecv;
	}
	public int getRemainSec() {
		return remainSec;
	}
	public void setRemainSec(int remainSec) {
		this.remainSec = remainSec;
	}
	@Override
	public String toString() {
		return "UserShareAwardVO [id=" + id + ", headimg=" + headimg + ", name=" + name + ", award=" + award
				+ ", isRecv=" + isRecv + ", remainSec=" + remainSec + "]";
	}
}
