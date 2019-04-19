package com.fungame.aircraft;

import java.lang.reflect.InvocationTargetException;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Properties;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.codahale.metrics.Timer;
import com.fungame.core.monitor.Metrics;

/**
 * mybatis插件进行sql拦截监控
 * PS:Executor.method=update包括了insert,delete,update等数据变更语句
 * @author peter.lim.sz
 *
 */
@Intercepts({
		@Signature(type = Executor.class, method = "query", args = { MappedStatement.class, Object.class,
				RowBounds.class, ResultHandler.class }),
		@Signature(type = Executor.class, method = "update", args = { MappedStatement.class, Object.class }) })
public class DBMonitor implements Interceptor {
	private Logger logger = LoggerFactory.getLogger(DBMonitor.class);

	@Override
	public Object intercept(Invocation invocation) {
		Object result = null;
		Timer.Context context = null;
		try {
			MappedStatement mappedStatement = (MappedStatement) invocation.getArgs()[0];
//			String classAndMethod = mappedStatement.getId();
			Object objects = (Object) invocation.getArgs()[1];
			BoundSql boundSql = mappedStatement.getBoundSql(objects);
			String statement = mappedStatement.getSqlCommandType().name();
//			String sql = getSql(mappedStatement.getConfiguration(), boundSql);
			context = Metrics.timer(statement).time();
			result = invocation.proceed();
		} catch (InvocationTargetException | IllegalAccessException e) {
			logger.error(((InvocationTargetException) e).getTargetException().toString());
		}
		finally {
			if(context != null) context.stop();
		}
		return result;
	}

	public String getSql(Configuration configuration, BoundSql boundSql) {
		String sql = boundSql.getSql();
//		Object parameterObject = boundSql.getParameterObject();
//		List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
//		if (parameterMappings.size() > 0 && parameterObject != null) {
//			TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
//			if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
//				sql = sql.replaceFirst("\\?", getParameterValue(parameterObject));
//			} else {
//				MetaObject metaObject = configuration.newMetaObject(parameterObject);
//				for (ParameterMapping parameterMapping : parameterMappings) {
//					String propertyName = parameterMapping.getProperty();
//					if (metaObject.hasGetter(propertyName)) {
//						Object obj = metaObject.getValue(propertyName);
//						sql = sql.replaceFirst("\\?", getParameterValue(obj));
//					} else if (boundSql.hasAdditionalParameter(propertyName)) {
//						Object obj = boundSql.getAdditionalParameter(propertyName);
//						sql = sql.replaceFirst("\\?", getParameterValue(obj));
//					}
//				}
//			}
//		}
		return sql;
	}

	private String getParameterValue(Object obj) {
		String value = "";
		if (obj instanceof String) {
			StringBuilder sb = new StringBuilder("'");
			String val = obj.toString();
			if(val.length()>30) {
				sb.append(val.substring(0, 30)).append("...");
			}
			else {
				sb.append(val);
			}
			sb.append("'").toString();
			value = new StringBuilder("'").append(val).append("'").toString();
		} else if (obj instanceof Date) {
			DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.DEFAULT, DateFormat.DEFAULT, Locale.CHINA);
			value = new StringBuilder("'").append(formatter.format(new Date())).append("'").toString();
		} else {
			if (obj != null) {
				value = obj.toString();
			}
		}
		return value;
	}

	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {

	}
}