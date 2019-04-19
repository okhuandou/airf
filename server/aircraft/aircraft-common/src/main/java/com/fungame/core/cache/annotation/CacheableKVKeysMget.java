package com.fungame.core.cache.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * 先keys然后mget
 * @author peter.lim林炳忠
 *
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CacheableKVKeysMget {
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
	 * key后缀的组成，支持spel表达式。例如:prefix="ut",suffix={"#userId","#type"}
	 * 最终合成为：ut_123_1
	 * @return
	 */
	String[] suffix();
	/**
	 * 值类型：一般都为String.class，只支持Integer.class,Long.class,String.class
	 * @return
	 */
	Class<?> valueType() default String.class;
	/**
	 * 返回值类型：只支持Integer.class,Long.class,String.class
	 * @return
	 */
	Class<?> returnType();
//	/**
//	 * 过期时间，单位为秒，0表示不过期；ExpireMode不为non时，表示对应模式计数值
//	 * @return
//	 */
//    int expire();
//    /**
//     * 过期时间模式
//     * @return
//     */
//    ExpireMode expireMode() default ExpireMode.Non;
}
