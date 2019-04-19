package com.fungame.aircraft;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

@Configuration
@ImportResource(locations={"classpath:application-cache.xml"})
public class RedisConfig {
	
	public RedisConfig() {
	}
	
	public static final String defaultCached = "cache";
}
