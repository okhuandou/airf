package com.fungame.aircraft.core.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.fungame.aircraft.core.lock.RedisLock;
import com.fungame.aircraft.core.web.interceptor.UserAuthSignInterceptor;
import com.fungame.aircraft.core.web.resolver.UserArgumentResolver;
import com.fungame.core.cache.JedisCacheManager;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter{
	@Autowired
	JedisCacheManager jedisCacheManager;
	@Autowired
	UserAuthSignInterceptor userAuthSignInterceptor;
	
	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		argumentResolvers.add(new UserArgumentResolver());
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(userAuthSignInterceptor).addPathPatterns("/**");
	}
	
	@Bean
	@DependsOn(value="jedisCacheManager")
	public RedisLock createRequestLock() {
		return new RedisLock(jedisCacheManager.getCache("default"));
	}
	
//    @Bean
//    public EmbeddedServletContainerCustomizer containerCustomizer() {
//    	
//        return new EmbeddedServletContainerCustomizer() {
//            @Override
//            public void customize(ConfigurableEmbeddedServletContainer container) {
//                ErrorPage error401Page = new ErrorPage(HttpStatus.UNAUTHORIZED, "/401.html");
//                ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/404.html");
//                ErrorPage error500Page = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/500.html");
//                container.addErrorPages(error401Page, error404Page, error500Page);
//            }
//        };
//    }
}
