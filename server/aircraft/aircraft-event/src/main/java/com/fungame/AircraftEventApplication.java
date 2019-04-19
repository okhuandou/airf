package com.fungame;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import com.fungame.aircraft.DAOImport;
import com.fungame.utils.ServiceLocator;
import com.fungame.utils.time.DateTimeUtils;

@SpringBootApplication
@ConfigurationProperties(locations="classpath:*.properties")
@Import(value={ServiceLocator.class})//RedisConfig.class, 
@ImportAutoConfiguration(value={ DAOImport.class})
@ComponentScan(basePackages="com.fungame.*")
public class AircraftEventApplication {
	private static Logger logger = LoggerFactory.getLogger(AircraftEventApplication.class);
	
    public static void main(String[] args) {
        SpringApplication.run(AircraftEventApplication.class, args);
        
        long startTime = System.currentTimeMillis();
		
		while(true){
			try{
				Thread.sleep(1000*60L);
			}catch(Exception e){
				if(e instanceof InterruptedException) {
					Thread.currentThread().interrupt();
					break;
				}
			}
		}
		logger.error("server stoped.it started at "+ DateTimeUtils.dateTimeFormat(new Date(startTime)));
    }

}