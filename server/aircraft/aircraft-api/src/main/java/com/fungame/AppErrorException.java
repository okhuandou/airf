package com.fungame;

/**
 * 自定义异常
 * @author peter.lim林炳忠
 *
 */
public class AppErrorException extends Exception{
	private static final long serialVersionUID = -6685601521112034793L;
	public AppErrorException(String message) {
		super(message);
	}
	@Override
	public Throwable fillInStackTrace() {
		return this;
	}
}
