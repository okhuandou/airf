package com.fungame.aircraft.ctrl.vo;

public class TaskVO {
	private int taskId;
	private int isComplete;
	private int isReceive;
	private int currNum;
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
	@Override
	public String toString() {
		return "TaskVO [taskId=" + taskId + ", isComplete=" + isComplete + ", isReceive=" + isReceive + ", currNum="
				+ currNum + "]";
	}

}
