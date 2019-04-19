package com.fungame.aircraft.core.web;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@PropertySource(value={"classpath:config-sys.properties"})
@Component
public class TestModelManager {
	@Value("${sys.testModel}")
	private String isTestModel;
	public boolean isTestModel() {
		return ! StringUtils.isEmpty(isTestModel) && ("true".equalsIgnoreCase(isTestModel) || "1".equals(isTestModel));
	}
	public boolean isTestModelUri(String uri) {
		return isTestModel() && (uri.startsWith("/test/") 
				|| uri.startsWith("/api-docs") 
				|| uri.startsWith("/swagger/")
				|| uri.startsWith("/swagger-resources/")
				|| uri.startsWith("/v2/api-docs"));
	}
}
