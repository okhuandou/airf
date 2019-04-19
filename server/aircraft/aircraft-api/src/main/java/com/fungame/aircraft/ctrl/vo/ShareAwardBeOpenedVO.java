package com.fungame.aircraft.ctrl.vo;


public class ShareAwardBeOpenedVO {
	private String fromKey;
	private int fromUserId;
	private String name;
	private String headimg;
	public String getFromKey() {
		return fromKey;
	}
	public void setFromKey(String fromKey) {
		this.fromKey = fromKey;
	}
	public int getFromUserId() {
		return fromUserId;
	}
	public void setFromUserId(int fromUserId) {
		this.fromUserId = fromUserId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHeadimg() {
		return headimg;
	}
	public void setHeadimg(String headimg) {
		this.headimg = headimg;
	}
	@Override
	public String toString() {
		return "ShareAwardBeOpenedVO [fromKey=" + fromKey + ", name=" + name + ", headimg=" + headimg + "]";
	}
	
}
