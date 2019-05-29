package com.fungame.aircraft.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fungame.AppErrorException;
import com.fungame.aircraft.core.lock.Lock;
import com.fungame.aircraft.core.lock.LockMode;
import com.fungame.aircraft.ctrl.vo.LoginReqVO;
import com.fungame.aircraft.dao.UserBaseDao;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.mapper.UserGameMapper;
import com.fungame.aircraft.service.UserService;
import com.fungame.aircraft.service.dto.LoginDTO;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.HttpSessionAuthHelper;
import com.fungame.core.web.session.SessionAuthHelper;
import com.fungame.core.web.session.SessionVals;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/test")
@Api(tags = "test", description="test")
public class TestCtrl {
	private static Logger logger = LoggerFactory.getLogger(TestCtrl.class);
	@Autowired
	UserService userService;
	@Autowired
	public UserBaseDao userBaseDao;
	@Autowired
	UserGameMapper mapper;

	@RequestMapping(value="/login", method= RequestMethod.POST)
    public ResponseResult login(
    		@RequestBody LoginReqVO reqBody,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		logger.info("Ctrl current thread id {}", Thread.currentThread().getId());
		
		String openid = reqBody.getCode();
		LoginDTO dto = this.userService.updateAndLogin(reqBody.getOsType(),openid, "", "", "", "test", "test", "", reqBody.getFromUserId(),"");

		logger.info("current user {}", dto.toString());

        return new ResponseResult(new JSONObject().fluentPut("skey", dto.getToken())
        		.fluentPut("openid", dto.getOpenid()).fluentPut("uid", dto.getUid()));
	}

	@RequestMapping(value="/test-login/{openid}", method= RequestMethod.POST)
    public ResponseResult testlogin(
    		@PathVariable(value="openid") String openid,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		UserBase userBase = this.userBaseDao.select(openid);
		if(userBase == null) {
			throw new AppErrorException("输入有效的openid");
		}
		int userID = userBase.getId();
		SessionVals vals = new SessionVals();
    	vals.setOpenid(openid);
    	vals.setUid(userID);
    	String token = SessionAuthHelper.encode(vals);
    	LoginDTO dto = new LoginDTO();
    	dto.setOpenid(openid);
    	dto.setToken(token);
    	dto.setUid(userID);
    	
        HttpSessionAuthHelper.encode(token, request, response);
        return new ResponseResult(dto);
	}

	@Lock(global=false, mode=LockMode.GIVE_UP)
	@RequestMapping(value="/lock", method= RequestMethod.POST)
    public ResponseResult lock(
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		return new ResponseResult();
	}
}
