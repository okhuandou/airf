package com.fungame.aircraft.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import com.fungame.core.cache.JedisCacheManager;
import com.fungame.core.rocketmq.core.RocketMQTemplate;

public class BaseDao {
	@Autowired
	JedisCacheManager cacheMgr;
	@Autowired
    private RocketMQTemplate rocketMQTemplate;
	
	public final static String CacheName = "default";
	
	public void event(String type, String subtype, Object body) {
		Message message = MessageBuilder.withPayload(body).build();//setHeader(MessageConst.PROPERTY_KEYS, key).
		this.rocketMQTemplate.syncSend(type+":"+subtype, message);
	}
	
	public void flushDbEvent(String subtype, Object body) {
		Message message = MessageBuilder.withPayload(body).build();//setHeader(MessageConst.PROPERTY_KEYS, key).
		this.rocketMQTemplate.syncSend("flushdb:"+subtype, message);
	}
}
