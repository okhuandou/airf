package com.fungame.core.web.session;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author peter.lim.sz
 *
 */
public class SessionVals {
	private long uid;
	private int appid;
	private String openid;
	private String kvs;
	private int white;//是否白名单
	private JSONObject kvJSON = null;
	/**
	 * 验证是否有效
	 * @return
	 */
	public boolean vaild() {
		return uid > 0;
	}
	public Object getVFromKVs(String k) {
		if(kvJSON == null) {
			kvJSON = JSON.parseObject(kvs);
		}
		return kvJSON.get(k);
	}
	public long getUid() {
		return uid;
	}
	public void setUid(long uid) {
		this.uid = uid;
	}
	public int getAppid() {
		return appid;
	}
	public void setAppid(int appid) {
		this.appid = appid;
	}
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getKvs() {
		return kvs;
	}
	public void setKvs(String kvs) {
		this.kvs = kvs;
	}
	public int getWhite() {
		return white;
	}
	public void setWhite(int white) {
		this.white = white;
	}
	@Override
	public String toString() {
		return "SessionVals [uid=" + uid + ", appid=" + appid + ", openid=" + openid + ", kvs=" + kvs + ", white="
				+ white + "]";
	}
}
