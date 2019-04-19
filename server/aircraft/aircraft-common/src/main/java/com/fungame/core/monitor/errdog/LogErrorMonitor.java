package com.fungame.core.monitor.errdog;

import java.io.PrintWriter;
import java.io.StringWriter;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxy;
import ch.qos.logback.core.UnsynchronizedAppenderBase;

public abstract class LogErrorMonitor extends UnsynchronizedAppenderBase<ILoggingEvent> {
	protected void append(ILoggingEvent event) {
		try {
			Level level = event.getLevel();
			if (level.isGreaterOrEqual(Level.ERROR)) {
				logError(event);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	private void logError(ILoggingEvent event) {
		ThrowableProxy info = (ThrowableProxy) event.getThrowableProxy();
		if (info != null) {
			Throwable exception = info.getThrowable();
			if (isWritableException(exception)) {
				Object message = event.getFormattedMessage();
				StringBuilder sb = new StringBuilder();
				sb.append(message).append(". exception:").append(buildExceptionStack(exception));
				send(sb.toString());
			}
		}
	}
	
	private String buildExceptionStack(Throwable exception) {
		if (exception != null) {
			StringWriter writer = new StringWriter(2048);
			exception.printStackTrace(new PrintWriter(writer));
			return writer.toString();
		}
		return "";
	}

	public abstract void send(String message);
	public abstract boolean isWritableException(Throwable exception);
}
