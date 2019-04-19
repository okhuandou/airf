package com.fungame.core.web.session;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ISessionHelper {
	private Logger logger = LoggerFactory.getLogger(ISessionHelper.class);
	
	public abstract String getCookiePath();
	public abstract String getDomain();
	public abstract int getCookieMaxage();
	public abstract boolean getCookieSecure();
	public abstract boolean getCookieHttponly();
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @param pairs
	 * @param writeToHeader 把cookie写到http头去
	 */
	public void setSession(HttpServletRequest request, 
			HttpServletResponse response, 
			Map<String, Object> pairs, boolean writeToHeader) {
		String cookiePath = getCookiePath();
		int cookieMaxage = getCookieMaxage();
		boolean cookieSecure = getCookieSecure();
		String domain = getDomain();
		generateCookie(response, pairs, cookiePath, cookieMaxage, domain, cookieSecure);
		if(writeToHeader) {
			this.generateHeader(response, pairs);
		}
	}
	private void generateHeader(HttpServletResponse response, Map<String, Object> pairs) {
		
		for(String name: pairs.keySet()) {
			Object obj = pairs.get(name);
			String value = null;
			if(obj instanceof String) {				
				try {
					value = URLEncoder.encode((String)obj, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
			else {
				value = String.valueOf(obj);
			}
			response.addHeader(name, value);
		}
	}
	private void generateCookie(HttpServletResponse response, Map<String, Object> pairs,
			String path, int maxage, String domain, boolean isSecure) {
		
		for(String name: pairs.keySet()) {
			Object obj = pairs.get(name);
			String value = null;
			if(obj instanceof String) {				
				try {
					value = URLEncoder.encode((String)obj, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
			else {
				value = String.valueOf(obj);
			}
			Cookie cookie = new Cookie(name, value);
			cookie.setDomain(domain);
			cookie.setHttpOnly(true);
			cookie.setSecure(isSecure);
			cookie.setMaxAge(maxage);
			cookie.setPath(path);
			response.addCookie(cookie);
		}
	}
	/**
	 * 获取cookie的多个值
	 * @param request
	 * @return
	 */
	public Map<String, Object> getPairs(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		Map<String, Object> pairs = new HashMap<>();
		if (cookies == null)
			return pairs;
		for (int i = 0; i < cookies.length; i++) {
			try {
				pairs.put(cookies[i].getName(), URLDecoder.decode(cookies[i].getValue(),"UTF-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return pairs;
	}
	public Cookie findCookieByName(HttpServletRequest request, String cookieName) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null)
			return null;
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals(cookieName)) {
				return cookies[i];
			}
		}
		return null;
	}
	/**
	 * 清理
	 * @param request
	 * @param response
	 */
	public void removeSession(HttpServletRequest request, HttpServletResponse response) {
		String domain = getDomain();
		String path = getCookiePath();
		Cookie[] cookies = request.getCookies();
		if(cookies == null) return;
		for (int i = 0; i < cookies.length; i++) {
			cleanCookie(response, cookies[i].getName(), domain, path);
		}
	}
	private boolean cleanCookie(HttpServletResponse response, String cookieName, String domain, String path) {
		boolean result = false;
		try {
			Cookie cookie = new Cookie(cookieName, "");
			cookie.setMaxAge(0);
			cookie.setDomain(domain);
			cookie.setPath(path);
			response.addCookie(cookie);
			result = true;
		} catch (Exception e) {
			logger.error(null, e);
		}
		return result;
	}
}
