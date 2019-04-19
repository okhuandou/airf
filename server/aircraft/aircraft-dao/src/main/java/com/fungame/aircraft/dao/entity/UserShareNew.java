package com.fungame.aircraft.dao.entity;

import java.util.Date;

public class UserShareNew {
	private int id;
	private int userId;
	private int friendUserId;
	private String friendHeadimg;
	private String friendName;
	private Date createdAt;
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
	public int getFriendUserId() {
		return friendUserId;
	}
	public void setFriendUserId(int friendUserId) {
		this.friendUserId = friendUserId;
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
	@Override
	public String toString() {
		return "UserShareHelp [id=" + id + ", userId=" + userId + ", friendUserId=" + friendUserId + ", friendHeadimg="
				+ friendHeadimg + ", friendName=" + friendName + ", createdAt=" + createdAt + "]";
	}
	
}
