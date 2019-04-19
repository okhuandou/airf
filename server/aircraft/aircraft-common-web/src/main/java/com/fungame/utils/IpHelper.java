package com.fungame.utils;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

/**
 * 获取IP地址类
 * @author peter.lim
 *
 */
public class IpHelper {
	public static String getIpAddr(HttpServletRequest request) {
		String headers[] = new String[]{"x-forwarded-for","X-Real-IP","Proxy-Client-IP","WL-Proxy-Client-IP"};
		String ip = null;
		for(String header : headers) {
			ip = request.getHeader(header);
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader(header.toLowerCase());
				if ( ! StringUtils.isEmpty(ip) && ! "unknown".equalsIgnoreCase(ip)) {
					break;
				}
			}
			else {
				break;
			}
		}
		if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		if(ip!=null && ip.indexOf(",")>0){
			ip = ip.split(",")[0];
		}
		return ip;
	}
}
