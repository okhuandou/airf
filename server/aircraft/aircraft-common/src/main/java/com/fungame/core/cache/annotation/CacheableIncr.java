package com.fungame.core.cache.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * incr set操作，使用该注解；
 * incr get操作使用CacheableKV；
 * incr del操作使用CacheableKVDel
 * 如果返回值是boolean类型，那么方法体返回false的时候不执行redis的操作
 * @author peter.lim林炳忠
 *
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CacheableIncr {
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
	 * incr之前是否检测是否存在
	 * @return
	 */
	boolean checkExist() default false;
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
    /**
     * spel表达式或者数字字符串，例如"#val"或者"1"
     * @return
     */
    String incr() default "1";
    /**
     * 是否返回incr的值
     */
    boolean incrResult() default false;
}
