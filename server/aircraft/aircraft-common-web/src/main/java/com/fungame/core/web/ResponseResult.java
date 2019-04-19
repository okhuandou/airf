package com.fungame.core.web;

/**
 * 返回结果集
 * @author peter.lim林炳忠
 *
 */
public class ResponseResult {
	private int code = 0;//返回code，比如0表示成功
	private String msg = "";//出错时候的信息描述
	private Object data;//可以放单独的object，也可以放list集合
	private Object ext;//扩展字段
	
	public ResponseResult() {
	}
	public ResponseResult(Object data, Object ext) {
		this.data = data;
		this.ext = ext;
	}
	public ResponseResult(Object data) {
		this.data = data;
	}
	public ResponseResult(int code, String msg) {
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
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public Object getExt() {
		return ext;
	}
	public void setExt(Object ext) {
		this.ext = ext;
	}
	@Override
	public String toString() {
		return "ResponseResult [code=" + code + ", msg=" + msg + ", data=" + data + ", ext=" + ext + "]";
	}
}
