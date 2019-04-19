package com.fungame.aircraft.dao.entity;

public class ShareLockFunc {
	private int lockId;
	private String func;
	private String mode;
	public int getLockId() {
		return lockId;
	}
	public void setLockId(int lockId) {
		this.lockId = lockId;
	}
	public String getFunc() {
		return func;
	}
	public void setFunc(String func) {
		this.func = func;
	}
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	@Override
	public String toString() {
		return "ShareLockFunc [lockId=" + lockId + ", func=" + func + ", mode=" + mode + "]";
	}
}
