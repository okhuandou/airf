package com.fungame.aircraft.service.dto;

public class LoginDTO {
	private int uid;
	private String token;
	private String openid;
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	@Override
	public String toString() {
		return "[uid=" + uid + ", token=" + token + ", openid=" + openid + "]";
	}
	
}
