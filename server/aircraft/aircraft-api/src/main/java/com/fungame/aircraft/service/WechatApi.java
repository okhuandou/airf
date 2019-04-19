package com.fungame.aircraft.service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fungame.AppException;
import com.fungame.aircraft.service.dto.WechatAuthCodeDTO;

@Component
public class WechatApi {
	private static final Logger logger = LoggerFactory.getLogger(WechatApi.class);
	
	@Value("${wechat.auth.jscode2session.host}")
    private String jscode2sessionHost;
    @Value("${wechat.auth.appId}")
    private String appId;
    @Value("${wechat.auth.secret}")
    private String secret;
    @Value("${wechat.auth.grantType}")
    private String grantType;
    /**
     * 服务器第三方session有效时间，单位秒, 默认1天
     */
    private static final Long EXPIRES = 86400L;

    private RestTemplate wxAuthRestTemplate = new RestTemplate();
    
    public WechatAuthCodeDTO getWxSession(String code) throws AppException {
        String urlString = "?appid={appid}&secret={secret}&js_code={code}&grant_type={grantType}";
        String response = wxAuthRestTemplate.getForObject(
                this.jscode2sessionHost + urlString, String.class,
                this.appId,
                this.secret,
                code,
                this.grantType);
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectReader reader = objectMapper.readerFor(WechatAuthCodeDTO.class);
        WechatAuthCodeDTO res;
        try {
            res = reader.readValue(response);
        } catch (IOException e) {
            res = null;
        }
        logger.info(response);
        if (null == res) {
            throw new AppException(2000, "调用微信接口失败");
        }
        if (res.getErrcode() != null) {
            throw new AppException(2001, res.getErrmsg());
        }
        res.setExpiresIn(res.getExpiresIn() != null ? res.getExpiresIn() : EXPIRES);
        return res;
    }

}
