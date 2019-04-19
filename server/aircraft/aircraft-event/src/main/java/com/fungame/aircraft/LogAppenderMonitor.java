package com.fungame.aircraft;

import com.alibaba.druid.util.StringUtils;
//import com.fungame.AppException;
import com.fungame.core.monitor.errdog.LogErrorMonitor;
import com.fungame.core.monitor.errdog.MessageSenderFacade;
import com.fungame.utils.ServiceLocator;

public class LogAppenderMonitor extends LogErrorMonitor {
	
	@Override
	public boolean isWritableException(Throwable exception) {
//		return ! (exception instanceof AppException) 
//				&& ! (exception instanceof com.aliyuncs.exceptions.ClientException)
//				&& ! (exception instanceof com.aliyuncs.exceptions.ServerException)
				;
		return true;
	}
	@Override
	public void send(String message) {
		MessageSenderFacade sender = ServiceLocator.getSpringBean(MessageSenderFacade.class);
		if( ! StringUtils.isEmpty(message)) {
			sender.send(message);
		}
	}
}
