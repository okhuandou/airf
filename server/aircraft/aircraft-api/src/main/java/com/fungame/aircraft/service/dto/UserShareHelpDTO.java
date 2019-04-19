package com.fungame.aircraft.service.dto;

public class UserShareHelpDTO {
	private int id;
	private int userId;
	private String friendHeadimg;
	private String friendName;
	private int isRecv;
	private int award;
	private int remainSec;
	private int isNew;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getFriendHeadimg() {
		return friendHeadimg;
	}
	public void setFriendHeadimg(String friendHeadimg) {
		this.friendHeadimg = friendHeadimg;
	}
	public String getFriendName() {
		return friendName;
	}
	public void setFriendName(String friendName) {
		this.friendName = friendName;
	}
	public int getIsRecv() {
		return isRecv;
	}
	public void setIsRecv(int isRecv) {
		this.isRecv = isRecv;
	}
	public int getAward() {
		return award;
	}
	public void setAward(int award) {
		this.award = award;
	}
	public int getRemainSec() {
		return remainSec;
	}
	public void setRemainSec(int remainSec) {
		this.remainSec = remainSec;
	}
	public int getIsNew() {
		return isNew;
	}
	public void setIsNew(int isNew) {
		this.isNew = isNew;
	}
	@Override
	public String toString() {
		return "UserShareHelpDTO [id=" + id + ", userId=" + userId + ", friendHeadimg=" + friendHeadimg
				+ ", friendName=" + friendName + ", isRecv=" + isRecv + ", award=" + award + ", remainSec=" + remainSec
				+ ", isNew=" + isNew + "]";
	}
	
}
