package com.fungame.aircraft.core.lock;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Lock {
	//是否全局
	boolean global() default false;
	LockMode mode() default LockMode.GIVE_UP;
	int expireMillis() default 300;
	int tryTimeout() default 1000;
}
