package com.fungame.aircraft.ctrl.vo;

public class TaskRecvVO {
	private int taskId;
	private AwardItemsVO award;
	private TaskVO next;
	public int getTaskId() {
		return taskId;
	}
	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}
	public AwardItemsVO getAward() {
		return award;
	}
	public void setAward(AwardItemsVO award) {
		this.award = award;
	}
	public TaskVO getNext() {
		return next;
	}
	public void setNext(TaskVO next) {
		this.next = next;
	}
	@Override
	public String toString() {
		return "TaskRecvVO [taskId=" + taskId + ", award=" + award + "]";
	}
}
