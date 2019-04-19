package com.fungame.core.web;

public enum CommonError {

	SUCCESS(0, "success"),
	SysError(1000, "sys error"),
	IoError(1001, "io error"),
	
	SignError(1002, "验证失败"),
	TokenInvalid(1003, "token失效"),
	MissParam(1004, "缺少参数"),

	Request_Busy(1005, "request frequently please try again"),
	;
	private int code;
	private String msg;
	private CommonError(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
    @Override
    public String toString() {
        return code+"_"+msg;
    }
}
