package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.MatchAddUserVO;
import com.fungame.aircraft.ctrl.vo.MatchRecvVO;
import com.fungame.aircraft.ctrl.vo.UserMatchVO;
import com.fungame.aircraft.dao.UserBaseDao;
import com.fungame.aircraft.dao.UserMatchDao;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserMatch;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.time.DateTimeUtils;

@Service
public class UserMatchService {
	private static Logger logger = LoggerFactory.getLogger(UserMatchService.class);
	@Autowired
	UserMatchDao userMatchDao;
	@Autowired
	UserBaseDao userBaseDao;
	@Autowired
	UserService userService;
	@Autowired
	DictCfgDao dictCfgDao;
	
	public UserMatchVO select(int fromUserId) throws CacheException {
		List<UserMatch> list = this.userMatchDao.select(fromUserId);
		UserMatchVO vo = new UserMatchVO();
		if(list != null) {
			Date nowDate = new Date();
			UserMatch master = null;
			int remainSec = 0;
			List<UserMatchVO.Item> items = new ArrayList<>();
			int limitMinutes = this.dictCfgDao.intValue(DictCfg.MatchLimitMinu, 120);
			for(UserMatch match: list) {
				if(match.getUserId() == fromUserId && match.getFriendUserId() == fromUserId) {
					master = match;
					Date expirtAt = DateTimeUtils.addMinutes(master.getCreatedAt(), limitMinutes);
					if(expirtAt.after(nowDate)) {
						remainSec = (int)((expirtAt.getTime() - nowDate.getTime())/1000);						
					}
				}
				
				UserMatchVO.Item item = new UserMatchVO.Item();
				item.setHeadimg(match.getFriendHeadimg());
				item.setName(match.getFriendName());
				item.setScore(match.getScore());
				item.setSuccess(match.getSuccess());
				item.setUserId(match.getFriendUserId());
				item.setAward(match.getAward());
				item.setAwardGot(match.getAwardGot());
				item.setHeroKind(match.getHeroKind());
				item.setHeroSeq(match.getHeroSeq());
				items.add(item);
			}
			if(master != null) {
				if(this.isMatchOver(master)) {
					this.userMatchDao.delete(fromUserId);
				}
				else {
					vo.setUserId(fromUserId);
					vo.setRemainSec(remainSec);
					vo.setItems(items);
					vo.setMaster(master.getFriendUserId());
				}
			}
		}
		return vo;
	}
	
	public void add(int userId, int score, int heroKind, int heroSeq) throws CacheException {
		UserMatch match = this.userMatchDao.selectUser(userId, userId);
		Date nowDate = new Date();
		if(match == null) {
			match = new UserMatch();
			match.setCreatedAt(nowDate);
			
			UserBase userBase = this.userBaseDao.selectById(userId);
			match.setFriendHeadimg(userBase.getImg());
			match.setFriendName(userBase.getName());
			match.setFriendUserId(userId);
			match.setUserId(userId);
			match.setSuccess(1);
			match.setScore(score);
			match.setHeroKind(heroKind);
			match.setHeroSeq(heroSeq);
			this.userMatchDao.insert(match);
		}
		else {
			if(this.isMatchTimeout(match)) {
				match.setScore(score);
				match.setCreatedAt(nowDate);
				match.setHeroKind(heroKind);
				match.setHeroSeq(heroSeq);
				this.userMatchDao.insertNewMatch(match);
			}
		}
	}
	
	private boolean isMatchTimeout(UserMatch masterMatch) {
		int limitMinutes = this.dictCfgDao.intValue(DictCfg.MatchLimitMinu, 120);
		Date nowDate = new Date();
		return masterMatch.getCreatedAt().getTime() + limitMinutes*60*1000L < nowDate.getTime();
	}
	
	private boolean isMatchOver(UserMatch masterMatch) {
		return this.isMatchTimeout(masterMatch) && masterMatch.getAwardGot() == 1;
	}
	
	public MatchAddUserVO addUser(int userId, int score, int fromUserId, int heroKind, int heroSeq) throws CacheException, AppException {
		logger.info("userId {} fromUserId {} score{}", userId, fromUserId, score);
		List<UserMatch> list = this.userMatchDao.select(fromUserId);
		UserMatch master = null;
		UserMatch best = null;
		for(UserMatch match: list) {
			if(best == null) best = match;
			else if(best.getScore() < best.getScore()) best = match;
			if(match.getUserId() == match.getFriendUserId()) {
				master = match;
			}
		}
		MatchAddUserVO vo = new MatchAddUserVO();
		if(master == null || this.isMatchTimeout(master)) {
			throw new AppException(AppError.Match_Err);
		}
		UserMatch match = this.userMatchDao.selectUser(fromUserId, userId);
		int addCoin = 0;
		int addCoinForMaster = 0;
		boolean isNew = false;
		if(match == null) {
			match = new UserMatch();
			match.setCreatedAt(new Date());
			UserBase userBase = this.userBaseDao.selectById(userId);
			match.setFriendHeadimg(userBase.getImg());
			match.setFriendName(userBase.getName());
			match.setFriendUserId(userId);
			match.setUserId(fromUserId);
			isNew = true;
		}
//		else if( ! this.isMatchTimeout(master)){
//			throw new AppException(AppError.Match_Err);
//		}
		match.setScore(score);
		match.setHeroKind(heroKind);
		match.setHeroSeq(heroSeq);
		match.setSuccess(0);
		int success = 0;
		if(score > best.getScore()) {
			success = 1;
			addCoin = this.dictCfgDao.intValue(DictCfg.MatchWinAward, 400);
			addCoinForMaster = this.dictCfgDao.intValue(DictCfg.MatchMasterAward, 200);
		}
		else {
			addCoin = this.dictCfgDao.intValue(DictCfg.MatchLossAward, 50);
		}
		match.setSuccess(success);
		match.setAward(addCoin);
		match.setAwardGot(1);
		
		if(isNew) {
			this.userMatchDao.insert(match);
		}
		else this.userMatchDao.update(match);
		int mycoin = this.userService.addUserCoin(userId, addCoin, BillLogger.reason_coin_match, fromUserId);
		
		if(addCoinForMaster > 0) {
			master.setAward(master.getAward() + addCoinForMaster);
			this.userMatchDao.update(master);
		}
		
		vo.setCoin(addCoin);
		vo.setMycoin(mycoin);
		vo.setSuccess(success);
		return vo;
	}
	
	public MatchRecvVO updateRecv(int userId) throws CacheException, AppException {
		UserMatch master = this.userMatchDao.selectUser(userId, userId);
		MatchRecvVO vo = new MatchRecvVO();
		if(master != null && ! this.isMatchOver(master)) {
			int addCoin = master.getAward();
			int mycoin = this.userService.addUserCoin(userId, addCoin, BillLogger.reason_coin_match, userId);
			master.setAwardGot(1);
			this.userMatchDao.update(master);
			vo.setCoin(addCoin);
			vo.setMycoin(mycoin);
		}
		return vo;
	}
}
