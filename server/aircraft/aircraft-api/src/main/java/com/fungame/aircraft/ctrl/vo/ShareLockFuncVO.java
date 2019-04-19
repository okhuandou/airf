package com.fungame.aircraft.ctrl.vo;

public class ShareLockFuncVO {
	private String func;
	private String mode;
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
		return "ShareLockFuncVO [func=" + func + ", mode=" + mode + "]";
	}
	
}
