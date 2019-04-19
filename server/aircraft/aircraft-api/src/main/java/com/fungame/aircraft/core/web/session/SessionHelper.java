package com.fungame.aircraft.core.web.session;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.fungame.core.web.session.ISessionHelper;

@Component
public class SessionHelper extends ISessionHelper {
	@Resource
	private SessionConfig config;
	
	@Override
	public String getCookiePath() {
		return this.config.getPath();
	}

	@Override
	public String getDomain() {
		return this.config.getDomain();
	}

	@Override
	public int getCookieMaxage() {
		return this.config.getMaxage();
	}

	@Override
	public boolean getCookieSecure() {
		return this.config.isSecure();
	}

	@Override
	public boolean getCookieHttponly() {
		return this.config.isHttponly();
	}
	
}
