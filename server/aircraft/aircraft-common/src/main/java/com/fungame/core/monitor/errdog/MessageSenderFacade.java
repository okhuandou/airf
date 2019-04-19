package com.fungame.core.monitor.errdog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
@EnableConfigurationProperties(ErrDogSenderProperties.class)
public class MessageSenderFacade implements IMessageSender {
	private Logger logger = LoggerFactory.getLogger(MessageSenderFacade.class);
//	@Value("${errdog.sender}")
//	private String sender;
//	@Value("${errdog.open}")
//	private boolean isOpen;
	private IMessageSender isender;
	
	@Override
	public void send(String message) {
		if(isender != null) {			
			this.isender.send(message);
		}
		else {
			logger.info("mail is closed");
		}
	}
	
	@Bean
	@ConditionalOnClass(QywxMessageSender.class)
	@ConditionalOnMissingBean(QywxMessageSender.class)
    @ConditionalOnProperty(prefix = "errdog", value="sender", havingValue="com.fungame.core.monitor.errdog.QywxMessageSender")
    public QywxMessageSender qywxMsgSender(ErrDogSenderProperties cfg) {
		QywxMessageSender sender = new QywxMessageSender();
		sender.agentid = cfg.getQywx().getAgentid();
		sender.corpid = cfg.getQywx().corpid;
		sender.corpsecret = cfg.getQywx().corpsecret;
		sender.sendto = cfg.getQywx().sendto;
		sender.tag = cfg.getQywx().tag;
		this.isender = sender;
		return sender;
	}
	
}
