package com.fungame.aircraft.core.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.alibaba.fastjson.JSONObject;
import com.fungame.AppException;
import com.fungame.aircraft.core.lock.Lock;
import com.fungame.aircraft.core.lock.LockMode;
import com.fungame.aircraft.core.lock.RedisLock;
import com.fungame.aircraft.core.web.TestModelManager;
import com.fungame.core.web.CommonError;
import com.fungame.core.web.session.HttpSessionAuthHelper;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.ServiceLocator;

@Component
public class UserAuthSignInterceptor extends HandlerInterceptorAdapter{
	private static Logger logger = LoggerFactory.getLogger(UserAuthSignInterceptor.class);
	@Autowired
	private RedisLock redisLock;
	private ThreadLocal<String> reqLocks = new ThreadLocal<>();
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		boolean auth = true;
		SessionVals sv = null;
		try {
			if( ! (handler instanceof HandlerMethod) || "OPTIONS".equals(request.getMethod()) || "options".equals(request.getMethod())) {
				return true;
			}
			TestModelManager testModelManager = ServiceLocator.getSpringBean(TestModelManager.class);
			if(testModelManager.isTestModel()) {
				//测试模式之下都可以访问
				sv = buildSessionVals(request);
				if(sv == null) {
					sv = new SessionVals();
					sv.setOpenid("1008");
					sv.setUid(1008);
					sv.setAppid(100);
					sv.setKvs(new JSONObject().fluentPut("unionid", "1008")
							.fluentPut("mobile", "1234567890").toJSONString());
					HttpSessionAuthHelper.setCurrent(request, sv);
				}
				HttpSessionAuthHelper.setCurrent(request, sv);
				auth = true;
			}
			else {
				if(testModelManager.isTestModelUri(request.getServletPath())) {
					//非测试模式下，测试uri不允许访问
					auth = false;
					return auth;
				}
				sv = this.buildSessionVals(request);
				if(sv != null) {
					HttpSessionAuthHelper.setCurrent(request, sv);
					auth = true;
				}
				else {
					auth = false;
				}
				if(checkIsFreeUri(request)) {
					auth = true;
				}
			}
		}
		finally {
			if( ! auth) {
				if(logger.isInfoEnabled()) {
					logger.info("uri="+request.getServletPath()+" auth failure!");
				}
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
			}
			else {
				if(handler instanceof HandlerMethod) {					
					HandlerMethod hm = (HandlerMethod) handler;
					Lock lock = hm.getMethodAnnotation(Lock.class);
					if(lock != null) {
						this.doLock(request, sv, lock);
					}
				}
			}
		}
		return auth;
	}
	public void doLock(HttpServletRequest request, SessionVals sv, Lock lock) throws AppException {
		boolean isLockOk = false;
		String key = "reqlk:"+request.getServletPath();
		if( ! lock.global()) {
			//不是全局，加uid区分
			key += ":"+sv.getUid();
		}
		if(lock.mode() == LockMode.GIVE_UP) {
			//如果上锁失败就直接放弃
			isLockOk = redisLock.lock(key, lock.expireMillis());
		}
		else {
			//在指定时间内尝试上锁，如果失败就放弃
			isLockOk = redisLock.tryLock(key, lock.expireMillis(), lock.tryTimeout());
		}
		if( ! isLockOk) {
			throw new AppException(CommonError.Request_Busy);
		}
		else {
			reqLocks.set(key);
		}
	}
	private SessionVals buildSessionVals(HttpServletRequest request) {
		return HttpSessionAuthHelper.decode(request);
	}
	
	/**
	 * 是否需要进行验证的URL
	 * @param request
	 * @return
	 */
	private boolean checkIsFreeUri(HttpServletRequest request) {
		String uri = request.getServletPath();
		return isFreeUrl(uri);
	}
	public static boolean isFreeUrl(String uri) {
		if(StringUtils.isEmpty(uri)) return true;
		
		if(uri.startsWith("/favicon.ico")) return true;
		if(uri.startsWith("/error")) return true;
		if(uri.startsWith("/common/")) return true;
		if(uri.startsWith("/backdoor/")) return true;
		
		if(uri.startsWith("/user/login")) return true;
		if(uri.startsWith("/cfgs")) return true;
		if(uri.startsWith("/share/cfgs")) return true;
		if(uri.startsWith("/share/help")) return true;
		if(uri.startsWith("/bill")) return true;
		if(uri.startsWith("/monitoring")) return true;
		if(uri.startsWith("/dbmonitor")) return true;
		
		return false;
	}

	@Override
	public void postHandle(
			HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
			throws Exception {
//		logger.info("current thread id {}", Thread.currentThread().getId());
	}

	@Override
	public void afterCompletion(
			HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
//		logger.info("current thread id {}", Thread.currentThread().getId());
		reqLocks.remove();
		HttpSessionAuthHelper.removeCurrent(request);
	}

	@Override
	public void afterConcurrentHandlingStarted(
			HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
//		logger.info("current thread id {}", Thread.currentThread().getId());
	}
}
