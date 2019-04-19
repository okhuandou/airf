package com.fungame.aircraft.dao.entity;

import java.util.Date;

public class UserTask extends BaseEntity {
	private int userId;
	private int taskId;
	private int isComplete;
	private int isReceive;
	private int currNum;
	private Date createdAt;
	private Date lastModified;
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getTaskId() {
		return taskId;
	}
	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}
	public int getIsComplete() {
		return isComplete;
	}
	public void setIsComplete(int isComplete) {
		this.isComplete = isComplete;
	}
	public int getIsReceive() {
		return isReceive;
	}
	public void setIsReceive(int isReceive) {
		this.isReceive = isReceive;
	}
	public int getCurrNum() {
		return currNum;
	}
	public void setCurrNum(int currNum) {
		this.currNum = currNum;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public Date getLastModified() {
		return lastModified;
	}
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	public void reset() {
		this.createdAt = this.lastModified = new Date();
		this.currNum = 0;
		this.isComplete = 0;
		this.isNull = false;
		this.isReceive = 0;
	}
	@Override
	public String toString() {
		return "UserTask [userId=" + userId + ", taskId=" + taskId + ", isComplete=" + isComplete + ", isReceive="
				+ isReceive + ", currNum=" + currNum + ", createdAt=" + createdAt + ", lastModified=" + lastModified
				+ "]";
	}
	
}
