package com.fungame.core.cache.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CacheableLPush {
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
	 * 指定参数作为value
	 * @return
	 */
	String value();

	/**
	 * 过期时间，单位为秒，0表示不过期；ExpireMode不为non时，表示对应模式计数值
	 * @return
	 */
    int expire();
    /**
     * 过期时间模式
     * @return
     */
    ExpireMode expireMode() default ExpireMode.Non;
}
