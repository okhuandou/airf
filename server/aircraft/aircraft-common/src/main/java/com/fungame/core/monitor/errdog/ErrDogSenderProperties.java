package com.fungame.core.monitor.errdog;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "errdog")
public class ErrDogSenderProperties {
	private String sender;
	private Qywx qywx;
	
	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public Qywx getQywx() {
		return qywx;
	}

	public void setQywx(Qywx qywx) {
		this.qywx = qywx;
	}

	public static class Qywx {		
		protected String corpid;
		protected String corpsecret;
		protected String agentid;
		protected String sendto;
		protected String tag;
		public String getCorpid() {
			return corpid;
		}
		public void setCorpid(String corpid) {
			this.corpid = corpid;
		}
		public String getCorpsecret() {
			return corpsecret;
		}
		public void setCorpsecret(String corpsecret) {
			this.corpsecret = corpsecret;
		}
		public String getAgentid() {
			return agentid;
		}
		public void setAgentid(String agentid) {
			this.agentid = agentid;
		}
		public String getSendto() {
			return sendto;
		}
		public void setSendto(String sendto) {
			this.sendto = sendto;
		}
		public String getTag() {
			return tag;
		}
		public void setTag(String tag) {
			this.tag = tag;
		}
	}
}
