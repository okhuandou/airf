package com.fungame.aircraft.event.flushdb;

import org.apache.rocketmq.common.message.MessageExt;
import org.springframework.stereotype.Component;

import com.fungame.aircraft.event.IEventListener;
import com.fungame.core.rocketmq.annotation.RocketMQMessageListener;
import com.fungame.core.rocketmq.core.RocketMQListener;

@Component
@RocketMQMessageListener(topic = "flushdb", consumerGroup = "flushdb-consumer-1")
public class FlushDBEvent extends IEventListener implements RocketMQListener<MessageExt> {
	
}
