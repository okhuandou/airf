package com.fungame.aircraft.event;

import org.springframework.stereotype.Component;

import com.fungame.aircraft.event.flushdb.ShareHelpEvent;
import com.fungame.aircraft.event.flushdb.ShareNewEvent;
import com.fungame.aircraft.event.flushdb.UserGameEvent;
import com.fungame.aircraft.event.flushdb.UserHeroEvent;
import com.fungame.aircraft.event.flushdb.UserItemEvent;
import com.fungame.aircraft.event.flushdb.UserMatchEvent;
import com.fungame.aircraft.event.flushdb.UserShareAwardEvent;
import com.fungame.aircraft.event.flushdb.UserTaskEvent;
import com.fungame.aircraft.event.flushdb.UserTouchShareEvent;
import com.fungame.utils.ServiceLocator;

@Component
public class EventServiceFactory {
	public enum EventDefind {
		UserGameEvent("userGame", UserGameEvent.class),
		UserHeroEvent("userHero", UserHeroEvent.class),
		userShareAward("userShareAward", UserShareAwardEvent.class),
		userShareNewEvent("userShareNew", ShareNewEvent.class),
		userShareHelpEvent("userShareHelp", ShareHelpEvent.class),
		userItem("userItem", UserItemEvent.class),
		touchShare("touchShare", UserTouchShareEvent.class),
		userTaskEvent("userTask", UserTaskEvent.class),
		userMatchEvent("userMatch", UserMatchEvent.class),
		;
		private String type;
		private Class<? extends IEventService> serviceClassType;
		private EventDefind(String type, Class<? extends IEventService> serviceClassType) {
			this.type = type;
			this.serviceClassType = serviceClassType;
		}
		public String getType() {
			return type;
		}
		public Class<? extends IEventService> getServiceClassType() {
			return serviceClassType;
		}
	}
	
	@SuppressWarnings("unchecked")
	public <T> IEventService<T> getService(String type) {
		EventDefind es[] = EventDefind.values();
		EventDefind event = null;
		for(EventDefind e : es) {
			if(e.type.equalsIgnoreCase(type)) {
				event = e;
				break;
			}
		}
		if(event == null) {
			throw new NullPointerException("event type("+type+") is null");
		}
		IEventService<T> service = (IEventService<T>) ServiceLocator.getSpringBean(event.serviceClassType);
		if(service == null) {
			throw new NullPointerException("event type("+type+") is null");
		}
		return service;
	}
}
