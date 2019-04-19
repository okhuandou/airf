package com.fungame;

import com.fungame.aircraft.service.AppError;
import com.fungame.core.web.CommonError;

/**
 * 自定义异常
 * @author peter.lim林炳忠
 *
 */
public class AppException extends Exception{
	private static final long serialVersionUID = 8481786734823477581L;
	private int code;
	private String errmsg;
	public AppException(int code, String errmsg) {
		super(code+";"+errmsg);
		this.code = code;
		this.errmsg = errmsg;
	}
	public AppException(AppError error) {
		this(error.getCode(), error.getMsg());
	}
	public AppException(CommonError error) {
		this(error.getCode(), error.getMsg());
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getErrmsg() {
		return errmsg;
	}
	public void setErrmsg(String errmsg) {
		this.errmsg = errmsg;
	}
	@Override
	public Throwable fillInStackTrace() {
		return this;
	}
	@Override
	public String toString() {
		return "AppException [code=" + code + ", errmsg=" + errmsg + "]";
	}
	
}
