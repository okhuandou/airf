package com.fungame.aircraft.dao.entity;

import java.util.Date;

public class UserShareAward {
	private int id;
	private int userId;
	private int friendUserId;
	private String friendHeadimg;
	private String friendName;
	private Date createdAt;
	private int isRecv;
	private Date recvAt;
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
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public int getIsRecv() {
		return isRecv;
	}
	public void setIsRecv(int isRecv) {
		this.isRecv = isRecv;
	}
	public Date getRecvAt() {
		return recvAt;
	}
	public void setRecvAt(Date recvAt) {
		this.recvAt = recvAt;
	}
	public int getFriendUserId() {
		return friendUserId;
	}
	public void setFriendUserId(int friendUserId) {
		this.friendUserId = friendUserId;
	}
	@Override
	public String toString() {
		return "UserShareAward [id=" + id + ", userId=" + userId + ", friendHeadimg=" + friendHeadimg + ", friendName="
				+ friendName + ", createdAt=" + createdAt + ", isRecv=" + isRecv + ", friendUserId=" + friendUserId
				+ "]";
	}
	
}
