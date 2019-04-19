package com.fungame.utils;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class ServiceLocator implements ApplicationContextAware {
	private static ServiceLocator instance = null;
	private static ApplicationContext applicationContext;
	
	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}
	@Override
	public void setApplicationContext(ApplicationContext context) {
		if(applicationContext == null) {			
			applicationContext = context;
		}
	}
	@PostConstruct
	public static ServiceLocator createInstance() {
		return getInstance();
	}

	public static ServiceLocator getInstance() {
		if (instance == null) {
			instance = new ServiceLocator();
		}
		return instance;
	}

	public static ApplicationContext getContext() {
		return getInstance().getApplicationContext();
	}

	public static <T>T getSpringBean(String beanId, Class<T> clz) {
		try {
			ApplicationContext context = getContext();
			T ret = null;
			if(context != null) {
				ret = getContext().getBean(beanId, clz);
			}
			return ret;
		} catch (Exception e) {
		}
		return null;
	}

	public static <T>T getSpringBean(Class<T> clz) {
		try {
			ApplicationContext context = getContext();
			T ret = null;
			if(context != null) {
				ret = context.getBean(clz);
			}
			else {
				
			}
			return ret;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static <T>Map<String, T> getSpringBeansOfType(Class<T> clz) {
		try {
			ApplicationContext context = getContext();
			Map<String, T> ret = null;
			if(context != null) {
				ret = getContext().getBeansOfType(clz);
			}
			return ret;
		} catch (Exception e) {
		}
		return null;
	}
}
