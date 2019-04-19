package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO.Item;
import com.fungame.aircraft.dao.UserGameDao;
import com.fungame.aircraft.dao.UserHeroDao;
import com.fungame.aircraft.dao.cfg.SignCfgDAO;
import com.fungame.aircraft.dao.entity.SignCfg;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.service.dto.UserSignRspDTO;
import com.fungame.aircraft.service.dto.UserSignRspDTO.SignDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.time.DateTimeUtils;
import com.google.common.collect.Lists;

@Service
public class SignService {

	@Autowired
	SignCfgDAO signCfgDAO;
	@Autowired 
	UserGameDao userGameDAO;
	@Autowired 
	UserItemService userItemService;
	@Autowired
	UserHeroDao userHeroDao;
	
	public UserSignRspDTO list(int userId) {
		UserSignRspDTO rspDto = new UserSignRspDTO();
		UserGame userGame = this.userGameDAO.select(userId);
		List<SignCfg> selectAll = this.signCfgDAO.selectAll();
		if(userGame.getSignTime() == null || userGame.getSignNum() == 0) {	//首次
			rspDto = this.getUserSignRsp(userGame, 0);
		}else if(isContinueSign(userGame,selectAll.size())){	//是否可以续签
			rspDto = this.getUserSignRsp(userGame, userGame.getSignNum());
		}else{	//重置
			rspDto = this.getUserSignRsp(userGame, 0);
		}
		return rspDto;
	}
	
	/**
	 * 
	 * @param signTime
	 * @param num 已签到多少天
	 * @return
	 */
	public UserSignRspDTO getUserSignRsp(UserGame userGame, int num) {
		Date signTime = userGame.getSignTime();
		UserSignRspDTO rspDto = new UserSignRspDTO();
		List<SignDTO> signList = new ArrayList<>();
		List<SignCfg> selectAll = this.signCfgDAO.selectAll();
		int idx = 0;
		for (SignCfg signCfg : selectAll) {
			SignDTO dto = new SignDTO();
			dto.setSignCfg(signCfg);
			dto.setSign(idx < num? true:false);
			signList.add(dto);
			idx++;
		}
		rspDto.setSign(signList);
		
		if(signTime != null) {
			rspDto.setSignTime(signTime);
			rspDto.setTodayCanSign(DateTimeUtils.isSameDay(signTime, new Date())?false:true);
		}else {
			rspDto.setTodayCanSign(true);
		}
		
		rspDto.setSignNum(num);
		
//		rspDto.setSignNum(3);
//		rspDto.setTodayCanSign(true);
		return rspDto;
	}
	/**
	 * 连续签到
	 * @param signTime 最后一次签到时间
	 * @param signNum	已签到天数
	 * @param signCfgNum 配置天数
	 * @return
	 */
	public boolean isContinueSign(UserGame userGame,int signCfgNum) {
		Date signTime = userGame.getSignTime();
		int signNum = userGame.getSignNum();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(signTime);
		calendar.add(Calendar.DAY_OF_MONTH, 1);
		if(signNum == signCfgNum && DateTimeUtils.isSameDay(calendar.getTime(), new Date()))
			return false;
		boolean flag = DateTimeUtils.isSameDay(signTime, new Date());
		if( ! flag) {
			calendar = Calendar.getInstance();
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			flag = DateTimeUtils.isSameDay(signTime, calendar.getTime());
		}
		return flag;
	}

	public int signIn(int userId, int signNum) throws CacheException, AppException {
		UserGame userGame = this.userGameDAO.select(userId);
		List<SignCfg> selectAll = this.signCfgDAO.selectAll();
		int coin = signNum != selectAll.size() 
				? selectAll.get(signNum - 1).getItemNum() : selectAll.get(0).getItemNum();
		
		if((userGame.getSignTime() == null || userGame.getSignNum() == 0)
				|| ! DateTimeUtils.isSameDay(new Date(), userGame.getSignTime()) ) {
			this.userGameDAO.updateSignIn(userId, signNum, coin, new Date());
		}else {
			throw new AppException(AppError.Sign_Lack);
		}
		return coin;
	}

	public AwardItemsVO signInV2(int userId, int signNum) throws CacheException, AppException {
		AwardItemsVO ret = new AwardItemsVO();
		
		UserGame userGame = this.userGameDAO.select(userId);
		List<SignCfg> selectAll = this.signCfgDAO.selectAll();
		
		signNum = signNum < 1 ? 1: signNum;
		SignCfg signCfg = signNum < selectAll.size()? selectAll.get(signNum - 1):selectAll.get(0);
		int coin = signCfg.getItemNum();
		if((userGame.getSignTime() == null || userGame.getSignNum() == 0)
				||  ! DateTimeUtils.isSameDay(new Date(), userGame.getSignTime())) {
			this.userGameDAO.updateSignIn(userId, signNum, coin, new Date());
		}
		else {
			throw new AppException(AppError.Sign_Lack);
		}
		
		ret.setCoin(coin);
		ret.setMycoin(userGame.getCoin() + coin);
		if(signCfg.getItemId2() > 0 && signCfg.getItemNum2() > 0) {
			if(signCfg.getItemId2() == 2000) {
				UserHero hero = this.userHeroDao.select(userId, 4);
				if(hero != null && ! hero.isNull()) {
					Item item = new AwardItemsVO.Item();
					item.setId(signCfg.getItemId2());
					item.setNum(signCfg.getItemNum2());
					ret.setItems(Lists.newArrayList(item));
					this.userItemService.addItem(userId, signCfg.getItemId2(), signCfg.getItemNum2());
				}
			}
		}
		return ret;
	}
	
	
}
