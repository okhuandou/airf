package com.fungame.aircraft.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO;
import com.fungame.aircraft.ctrl.vo.SignInReqVO;
import com.fungame.aircraft.service.SignService;
import com.fungame.aircraft.service.dto.UserSignRspDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;

@RestController
@RequestMapping(value = "/sign")
public class SignCtrl {

	@Autowired
	SignService signService;
	
	@RequestMapping(value = "/list", method=RequestMethod.POST)
	public ResponseResult list(
			SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) {
		
		int userId = (int) sessionVals.getUid();
		UserSignRspDTO list = this.signService.list(userId);
		return new ResponseResult(list);
	}
	
	@RequestMapping(value = "/sign-in",method=RequestMethod.POST)
	public ResponseResult signIn(
			SessionVals sessionVals,
			@RequestBody SignInReqVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws CacheException, AppException {
		
		int userId = (int) sessionVals.getUid();
		int signNum = reqVO.getSignNum();
		int coin = this.signService.signIn(userId, signNum);
		return new ResponseResult(coin);
	}
	
	@RequestMapping(value = "/sign-in/v2",method=RequestMethod.POST)
	@ApiOperation( value = "", response = AwardItemsVO.class, notes = "" )
	@ApiResponse(response=AwardItemsVO.class,code=200,message="success")
	public ResponseResult signInV2(
			SessionVals sessionVals,
			@RequestBody SignInReqVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws CacheException, AppException {
		
		int userId = (int) sessionVals.getUid();
		int signNum = reqVO.getSignNum();
		AwardItemsVO vo = this.signService.signInV2(userId, signNum);
		return new ResponseResult(vo);
	}
}
