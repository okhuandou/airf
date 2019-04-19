package com.fungame.aircraft.service.dto;

public class UserShareNewDTO {
	private String headimg;
	private String name;
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
	@Override
	public String toString() {
		return "UserShareNewDTO [headimg=" + headimg + ", name=" + name + "]";
	}
}
