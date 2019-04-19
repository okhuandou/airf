package com.fungame.aircraft.event;

public abstract class IEventService<T> {
	public abstract void execute(T data) throws Exception;
}
