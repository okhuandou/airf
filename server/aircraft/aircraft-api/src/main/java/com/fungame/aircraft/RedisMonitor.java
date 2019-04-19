package com.fungame.aircraft;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import com.codahale.metrics.Timer;
import com.fungame.core.monitor.Metrics;

//@Component
//@Aspect
//public class RedisMonitor {
//	@Pointcut("execution(* com.fungame.core.cache.JedisCache.*(..))")
//	private void anyMethod() {
//	}
//
//	@Around("anyMethod()") // 声明环绕通知
//	public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
////		JedisCache shardedJedis = (JedisCache)pjp.getTarget();
//        Method method = ((MethodSignature) pjp.getSignature()).getMethod();
//        String logKey = method.getName();//shardedJedis.getName()+":"+method.getName();
//        Object args[] = pjp.getArgs();
//        boolean isCat = true;
//        if(args == null || args.length == 0 || ! (args[0] instanceof String)) {
//        	isCat = false;
//        }
//		Timer.Context context = null;
//		// 显示调用，确保被代理的方法被调用
//        try{
//    		if(isCat) {
//    			context = Metrics.timer(logKey+":"+args[0]).time();
//    		}
//		    Object o = pjp.proceed();
//		    return o;
//        }catch (Throwable e) {
//        	throw e;
//		}
//		finally {
//			if(context != null) context.stop();
//		}
//	}
//	
//}
