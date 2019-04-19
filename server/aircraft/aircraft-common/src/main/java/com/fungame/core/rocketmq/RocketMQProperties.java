package com.fungame.core.rocketmq;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * RocketMQProperties Created by aqlu on 2017/9/27.
 */
@ConfigurationProperties(prefix = "spring.rocketmq")
public class RocketMQProperties {

    /**
     * name server for rocketMQ, formats: `host:port;host:port`
     */
    private String nameServer;

    private Producer producer;

    public String getNameServer() {
		return nameServer;
	}

	public void setNameServer(String nameServer) {
		this.nameServer = nameServer;
	}

	public Producer getProducer() {
		return producer;
	}

	public void setProducer(Producer producer) {
		this.producer = producer;
	}

	public static class Producer {

        /**
         * name of producer
         */
        private String group;

        /**
         * millis of send message timeout
         */
        private int sendMsgTimeout = 3000;

        /**
         * Compress message body threshold, namely, message body larger than 4k will be compressed on default.
         */
        private int compressMsgBodyOverHowmuch = 1024 * 4;

        /**
         * <p> Maximum number of retry to perform internally before claiming sending failure in synchronous mode. </p>
         * This may potentially cause message duplication which is up to application developers to resolve.
         */
        private int retryTimesWhenSendFailed = 2;

        /**
         * <p> Maximum number of retry to perform internally before claiming sending failure in asynchronous mode. </p>
         * This may potentially cause message duplication which is up to application developers to resolve.
         */
        private int retryTimesWhenSendAsyncFailed = 2;

        /**
         * Indicate whether to retry another broker on sending failure internally.
         */
        private boolean retryAnotherBrokerWhenNotStoreOk = false;

        /**
         * Maximum allowed message size in bytes.
         */
        private int maxMessageSize = 1024 * 1024 * 4; // 4M

		public String getGroup() {
			return group;
		}

		public void setGroup(String group) {
			this.group = group;
		}

		public int getSendMsgTimeout() {
			return sendMsgTimeout;
		}

		public void setSendMsgTimeout(int sendMsgTimeout) {
			this.sendMsgTimeout = sendMsgTimeout;
		}

		public int getCompressMsgBodyOverHowmuch() {
			return compressMsgBodyOverHowmuch;
		}

		public void setCompressMsgBodyOverHowmuch(int compressMsgBodyOverHowmuch) {
			this.compressMsgBodyOverHowmuch = compressMsgBodyOverHowmuch;
		}

		public int getRetryTimesWhenSendFailed() {
			return retryTimesWhenSendFailed;
		}

		public void setRetryTimesWhenSendFailed(int retryTimesWhenSendFailed) {
			this.retryTimesWhenSendFailed = retryTimesWhenSendFailed;
		}

		public int getRetryTimesWhenSendAsyncFailed() {
			return retryTimesWhenSendAsyncFailed;
		}

		public void setRetryTimesWhenSendAsyncFailed(int retryTimesWhenSendAsyncFailed) {
			this.retryTimesWhenSendAsyncFailed = retryTimesWhenSendAsyncFailed;
		}

		public boolean isRetryAnotherBrokerWhenNotStoreOk() {
			return retryAnotherBrokerWhenNotStoreOk;
		}

		public void setRetryAnotherBrokerWhenNotStoreOk(boolean retryAnotherBrokerWhenNotStoreOk) {
			this.retryAnotherBrokerWhenNotStoreOk = retryAnotherBrokerWhenNotStoreOk;
		}

		public int getMaxMessageSize() {
			return maxMessageSize;
		}

		public void setMaxMessageSize(int maxMessageSize) {
			this.maxMessageSize = maxMessageSize;
		}

    }
}
