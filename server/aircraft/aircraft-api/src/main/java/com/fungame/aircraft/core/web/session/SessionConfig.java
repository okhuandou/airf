package com.fungame.aircraft.core.web.session;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@PropertySource(value="classpath:config-cookie.properties")
@Component
public class SessionConfig {
	@Value("${cookie.path}")
	private String path;
	@Value("${cookie.maxage}")
	private int maxage;
	@Value("${cookie.secure}")
	private boolean secure;
	@Value("${cookie.domain}")
	private String domain;
	@Value("${cookie.httponly}")
	private boolean httponly;
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public int getMaxage() {
		return maxage;
	}
	public void setMaxage(int maxage) {
		this.maxage = maxage;
	}
	public boolean isSecure() {
		return secure;
	}
	public void setSecure(boolean secure) {
		this.secure = secure;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public boolean isHttponly() {
		return httponly;
	}
	public void setHttponly(boolean httponly) {
		this.httponly = httponly;
	}
	@Override
	public String toString() {
		return "SessionConfig [path=" + path + ", maxage=" + maxage + ", secure=" + secure + ", domain=" + domain
				+ ", httponly=" + httponly + "]";
	}
	
}
