package com.fungame.aircraft.ctrl;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.core.lock.Lock;
import com.fungame.aircraft.core.lock.LockMode;
import com.fungame.aircraft.ctrl.vo.AddCoinReqVO;
import com.fungame.aircraft.ctrl.vo.AddMoneyReqVO2;
import com.fungame.aircraft.ctrl.vo.AddMoneyRspVO;
import com.fungame.aircraft.ctrl.vo.AddQzbFriendReqVO;
import com.fungame.aircraft.ctrl.vo.AddQzbReqVO;
import com.fungame.aircraft.ctrl.vo.BestScoreVO;
import com.fungame.aircraft.ctrl.vo.LoginReqVO;
import com.fungame.aircraft.ctrl.vo.UserBaseVO;
import com.fungame.aircraft.ctrl.vo.UserGameVO;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.service.BillLogger;
import com.fungame.aircraft.service.ShareService;
import com.fungame.aircraft.service.UserService;
import com.fungame.aircraft.service.dto.LoginDTO;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionAuthHelper;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.mapper.BeanMapper;
import com.fungame.utils.time.DateTimeUtils;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/user")
@Api(tags = "user", description="user")
public class UserCtrl {
	@Autowired
	UserService userService;
	@Autowired
	ShareService shareService;
	
	@RequestMapping(value="/login", method= RequestMethod.POST)
    public ResponseResult login(
    		@RequestBody LoginReqVO reqBody,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		String code = reqBody.getCode();
		LoginDTO dto = this.userService.updateAndLoginWX(code,reqBody.getName(),
				reqBody.getImg(), reqBody.getPf(), reqBody.getModel(), 
				reqBody.getFromAppId(), reqBody.getFromUserId(), reqBody.getFromType());
		
        return new ResponseResult(new JSONObject().fluentPut("skey", dto.getToken())
        		.fluentPut("openid", dto.getOpenid()).fluentPut("uid", dto.getUid()));
	}
	
	@RequestMapping(value="/game-info", method=RequestMethod.GET)
    public ResponseResult gameInfo(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		UserGame userGame = this.userService.getUserGame(userId);
		UserGameVO vo = BeanMapper.map(userGame, UserGameVO.class);
		Date nowDate = new Date();
		vo.setCreatedDays(DateTimeUtils.getDaysWith24Hours(userGame.getCreatedAt(), nowDate));
        return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/update-best-score", method=RequestMethod.POST)
    public ResponseResult updateBestScore(
    		SessionVals sessionVals,
    		@RequestBody BestScoreVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		this.userService.updateBestScore(userId, reqVO.getHigthScore());
        return new ResponseResult();
	}

	@Lock()
	@RequestMapping(value="/add-coin", method=RequestMethod.POST)
    public ResponseResult addCoin(
    		SessionVals sessionVals,
    		@RequestBody AddCoinReqVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		int coin = reqVO.getCoin();
		int currCoin = this.userService.addUserCoin(userId, coin, reqVO.getReason(), 0);
        return new ResponseResult(new JSONObject().fluentPut("currCoin", currCoin));
	}
	
	@Lock()
	@RequestMapping(value="/add-qzb", method=RequestMethod.POST)
    public ResponseResult addQzb(
    		SessionVals sessionVals,
    		@RequestBody AddQzbReqVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		int qzb = reqVO.getQzb();
		int currQzb = this.userService.addUserQzb(userId, qzb, 0, 0);
        return new ResponseResult(new JSONObject().fluentPut("currQzb", currQzb));
	}

	@RequestMapping(value="/add-qzb-friend", method=RequestMethod.POST)
    public ResponseResult addQzbFriend(
    		SessionVals sessionVals,
    		@RequestBody AddQzbFriendReqVO reqVO,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		int fromUserId = (int) SessionAuthHelper.decode(reqVO.getFromKey()).getUid();
		if(userId != fromUserId) {			
			this.userService.addUserQzb(fromUserId, 1,0,0);
		}
        return new ResponseResult();
	}

	@RequestMapping(value="/base-info", method=RequestMethod.GET)
    public ResponseResult baseInfo(
    		SessionVals sessionVals,
    		@RequestParam(name="fuserId",value="fuserId",required=true) int fuserId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		UserBase base = this.userService.selectById(fuserId);
		UserBaseVO vo = base != null ? BeanMapper.map(base, UserBaseVO.class) : new UserBaseVO();
        return new ResponseResult(vo);
	}

	@Lock(global=false, mode=LockMode.GIVE_UP)
	@RequestMapping(value="/add-money", method=RequestMethod.POST)
    public ResponseResult addMoney(
    		SessionVals sessionVals,
    		@RequestBody AddMoneyReqVO2 reqVO,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		AddMoneyRspVO vo = this.userService.addUserMoney(userId, reqVO.getMoney(), reqVO.getReason(), 0);
        return new ResponseResult(vo);
	}

	@RequestMapping(value="/ready-money/{reason}", method=RequestMethod.GET)
    public ResponseResult readyMoney(
    		SessionVals sessionVals,
    		@PathVariable(value="reason") int reason,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		if(reason == 0) reason = BillLogger.reason_money_redpack;
		AddMoneyRspVO vo = this.userService.readyUserMoney(userId, reason);
        return new ResponseResult(vo);
	}

}
