package com.fungame.aircraft.ctrl.vo;

public class UserBaseVO {
	private String name;
	private String img;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	@Override
	public String toString() {
		return "UserBaseVO [name=" + name + ", img=" + img + "]";
	}
}
