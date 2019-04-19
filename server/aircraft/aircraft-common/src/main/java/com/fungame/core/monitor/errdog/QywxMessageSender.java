package com.fungame.core.monitor.errdog;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;

public class QywxMessageSender implements IMessageSender {
	private Logger logger = LoggerFactory.getLogger(QywxMessageSender.class);
	protected String corpid;
	protected String corpsecret;
	protected String agentid;
	protected String sendto;
	protected String tag;
	private String accessToken;
	private long expireAt ;
	
	private final int ExpireTime = 720;//token过期秒数
	private final String AccessTokenUrl="https://qyapi.weixin.qq.com/cgi-bin/gettoken?";//corpid=$corpid\&corpsecret=$corpsecret;
	private final String SendMsgUrl="https://qyapi.weixin.qq.com/cgi-bin/message/send?";//access_token=$access_token;
	
	@Override
	public void send(String message) {
		long nowTime = System.currentTimeMillis();
		if(this.accessToken == null || this.expireAt < nowTime) {
			this.init();
		}
		
		//msg_body="{\"touser\":\"$touser\",\"toparty\":\"$toparty\",\"msgtype\":\"text\",\"agentid\":$agentid,\"text\":{\"content\":\"$content\"}}"
		JSONObject body = new JSONObject();
		body.put("touser", this.sendto);
		body.put("toparty", "");
		body.put("msgtype", "text");
		body.put("agentid", this.agentid);
		body.put("text", new JSONObject().fluentPut("content", tag+"\n"+message));
		
		String url = new StringBuilder().append(SendMsgUrl).append("access_token=")
				.append(this.accessToken).toString();
		this.httpRequest(url, "POST", body.toJSONString());
	}

	private void init() {
		long nowTime = System.currentTimeMillis();
		String url = new StringBuilder().append(AccessTokenUrl).append("corpid=")
				.append(corpid).append("&corpsecret=").append(corpsecret).toString();
		String rsp = httpRequest(url, "GET", null);
		JSONObject json = JSONObject.parseObject(rsp);
		this.accessToken = json.getString("access_token");
		this.expireAt = nowTime + ExpireTime * 1000;
	}
	
	private String httpRequest(String url, String requestMethod, String params) {
		String result = null;
		try {
			URL urlCon = new URL(url);
			URLConnection rulConnection = urlCon.openConnection();
			
			HttpURLConnection httpUrlConnection = (HttpURLConnection) rulConnection; 
			httpUrlConnection.setRequestMethod(requestMethod);    
			httpUrlConnection.setDoOutput(true);    
			httpUrlConnection.setDoInput(true);    
			httpUrlConnection.setUseCaches(false);    
			httpUrlConnection.setConnectTimeout(5000);
			httpUrlConnection.setReadTimeout(5000);
			httpUrlConnection.connect();    
			
			if(StringUtils.isNotBlank(params)) {
				OutputStream outStrm = httpUrlConnection.getOutputStream();				
				outStrm.write(params.getBytes());
				outStrm.flush();
				outStrm.close();
			}
			
			InputStream inputStream = httpUrlConnection.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
			StringBuffer sbf = new StringBuffer();
			String temp = null;
			// 循环遍历一行一行读取数据
			while ((temp = br.readLine()) != null) {
				sbf.append(temp);
			}
			result = sbf.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
