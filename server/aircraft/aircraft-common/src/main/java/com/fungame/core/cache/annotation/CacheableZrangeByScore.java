package com.fungame.core.cache.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CacheableZrangeByScore {
	/**
	 * cache的分类名称，例如default或者session等等
	 * @return
	 */
	String cacheName() default "default";
	/**
	 * key的前缀
	 * @return
	 */
	String prefix();
	/**
	 * key后缀的组成，支持spel表达式。例如:prefix="ut",suffix={“#userId”,“#type”}
	 * 最终合成为：ut_123_1
	 * @return
	 */
	String[] suffix();
	/**
	 * 只支持double,int,long,String
	 * @return
	 */
	String min();
	/**
	 * 只支持double,int,long,String
	 * @return
	 */
	String max() default "+inf";
	
	/**
	 * 只支持int
	 * @return
	 */
	String offset() default "0";
	/**
	 * 只支持int
	 * @return
	 */
	String limit();
	/**
	 * 值类型，是指List的元素类型
	 * @return
	 */
	Class<?> valueType() default String.class;
}
