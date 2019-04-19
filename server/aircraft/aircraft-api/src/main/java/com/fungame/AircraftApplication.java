package com.fungame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.fungame.aircraft.DAOImport;
import com.fungame.utils.ServiceLocator;

@SpringBootApplication
@Import(value={ServiceLocator.class})//RedisConfig.class, 
@ServletComponentScan
@ImportAutoConfiguration(value={ DAOImport.class})
public class AircraftApplication extends WebMvcConfigurerAdapter {

    public static void main(String[] args) {
        SpringApplication.run(AircraftApplication.class, args);
    }

}