package com.fungame.core.web.session;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.fungame.utils.ServiceLocator;

public class HttpSessionAuthHelper {
	private static final ThreadLocal<SessionVals> sessions = new ThreadLocal<>();
	
	public static void setCurrent(HttpServletRequest request, SessionVals val) {
//		HttpSession httpSession = request.getSession();
//		httpSession.setAttribute("session", val);
		sessions.set(val);
	}
	public static SessionVals getCurrent(HttpServletRequest request) {
//		HttpSession httpSession = request.getSession();
//		SessionVals session = (SessionVals) httpSession.getAttribute("session");
//		return session;
		return sessions.get();
	}
	
	public static void removeCurrent(HttpServletRequest request) {
		sessions.remove();
	}
	
	public static String encode(String auth, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Map<String, Object> pairs = new HashMap<>();
		pairs.put("Authorization", auth);
		ISessionHelper helper = ServiceLocator.getSpringBean(ISessionHelper.class);
		helper.setSession(request, response, pairs, true);
		response.setHeader("Authorization", auth);
		return auth;
	}
	
	public static SessionVals decode(HttpServletRequest request) {
		String auth = request.getHeader("Authorization");
		if(StringUtils.isBlank(auth)) {
			ISessionHelper helper = ServiceLocator.getSpringBean(ISessionHelper.class);
			auth = (String) helper.getPairs(request).get("Authorization");
			if(StringUtils.isBlank(auth)) {
				auth = request.getParameter("Authorization");
			}
		}
		if(StringUtils.isNotBlank(auth)) {
			return SessionAuthHelper.decode(auth);
		}
		return null;
	}
}
