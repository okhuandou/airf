package com.fungame.aircraft.ctrl;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.core.lock.Lock;
import com.fungame.aircraft.core.lock.LockMode;
import com.fungame.aircraft.ctrl.vo.HeroUpdateStatusVO;
import com.fungame.aircraft.ctrl.vo.HeroUpgradeReqVO;
import com.fungame.aircraft.ctrl.vo.HeroUpgradeRspVO;
import com.fungame.aircraft.ctrl.vo.UserHeroVO;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.service.UserHeroService;
import com.fungame.aircraft.service.dto.HeroUpgradeRspDTO;
import com.fungame.aircraft.service.dto.UserHeroDTO;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.mapper.BeanMapper;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/hero")
@Api(tags = "hero", description="hero")
public class HeroCtrl {
	private static Logger logger = LoggerFactory.getLogger(HeroCtrl.class);
	@Autowired
	UserHeroService userHeroService;
	@RequestMapping(value="/list", method=RequestMethod.GET)
    public ResponseResult list(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		List<UserHeroVO> rs = new ArrayList<>();
		List<UserHeroDTO> list = this.userHeroService.getUserHeroList(userId);
		for(UserHero elem: list) {
			UserHeroVO vo = BeanMapper.map(elem, UserHeroVO.class);
			vo.setId(elem.getHeroId());
			rs.add(vo);
		}
		logger.info(userId+": "+rs.toString());
//		String str="[{\"kind\":1,\"id\":1,\"status\":1,\"level\":1,\"power\":9,\"powerLevel\":1,\"attackSpeed\":3.0,\"attackSpeedLevel\":0,\"blood\":15,\"bloodLevel\":1,\"subSeq\":1},{\"kind\":2,\"id\":6,\"status\":1,\"level\":1,\"power\":9,\"powerLevel\":1,\"attackSpeed\":3.0,\"attackSpeedLevel\":0,\"blood\":15,\"bloodLevel\":1,\"subSeq\":1}]";
//		JSONArray json = JSONArray.parseArray(str);
		return new ResponseResult(rs);
	}
	
	@RequestMapping(value="/fight", method=RequestMethod.GET)
    public ResponseResult fight(
    		SessionVals sessionVals,
    		@RequestParam(name="kind",value="kind",required=true) int kind,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		this.userHeroService.updateHeroFightStatus(userId, kind, UserHero.STATUS_FIGHT);
		return new ResponseResult();
	}
	
	@RequestMapping(value="/update-status", method=RequestMethod.POST)
    public ResponseResult updateStatus(
    		SessionVals sessionVals,
    		@RequestBody HeroUpdateStatusVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		this.userHeroService.updateHeroStatus(userId, vo.getKind(), vo.getFromStatus(), vo.getToStatus());
		return new ResponseResult();
	}
	
	@Lock(global=false, mode=LockMode.GIVE_UP)
	@RequestMapping(value="/upgrade", method=RequestMethod.POST)
    public ResponseResult upgrade(
    		SessionVals sessionVals,
			@RequestBody HeroUpgradeReqVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		HeroUpgradeRspDTO dto = this.userHeroService.updateHeroUpgrade(userId, vo.getKind(), vo.getType());
//		logger.info(dto.toString());
		HeroUpgradeRspVO rspVO = BeanMapper.map(dto, HeroUpgradeRspVO.class);
		if(dto.getHero() != null) {
			rspVO.setHero(BeanMapper.map(dto.getHero(), UserHeroVO.class));
			rspVO.getHero().setSubSeq(dto.getHero().getSubSeq());
			rspVO.getHero().setId(dto.getHero().getHeroId());
		}
//		logger.info(rspVO.toString());
		return new ResponseResult(rspVO);
	}
	
	@RequestMapping(value="/get-use-coin", method=RequestMethod.GET)
    public ResponseResult getUseCoin(
    		SessionVals sessionVals,
    		@RequestParam(name="kind",value="kind",required=true) int kind,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		UserHeroDTO userHero = this.userHeroService.addNewHeroUseCoin(userId, kind);
		UserHeroVO vo = BeanMapper.map(userHero, UserHeroVO.class);
		vo.setId(userHero.getHeroId());
		return new ResponseResult(new JSONObject().fluentPut("hero", vo));
	}
	
	@RequestMapping(value="/award", method= {RequestMethod.POST, RequestMethod.GET})
    public ResponseResult award(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		UserHeroDTO userHero = this.userHeroService.addNewHeroAward(userId);
		UserHeroVO vo = BeanMapper.map(userHero, UserHeroVO.class);
		vo.setId(userHero.getHeroId());
		return new ResponseResult(new JSONObject().fluentPut("hero", vo));
	}
}
