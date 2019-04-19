package com.fungame.aircraft.dao.entity;

public class UserItem extends BaseEntity {
	private int userId;
	private int id;
	private int num;
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	@Override
	public String toString() {
		return "UserItem [userId=" + userId + ", id=" + id + ", num=" + num + "]";
	}
}
