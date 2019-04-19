package com.fungame.aircraft.service;

import java.math.BigDecimal;
import java.util.Date;

import org.apache.commons.lang3.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.AddMoneyRspVO;
import com.fungame.aircraft.dao.UserBaseDao;
import com.fungame.aircraft.dao.UserGameDao;
import com.fungame.aircraft.dao.UserShareAwardDao;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.cfg.RedpackCfgDao;
import com.fungame.aircraft.dao.entity.RedpackCfg;
import com.fungame.aircraft.dao.entity.UserBase;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.service.dto.LoginDTO;
import com.fungame.aircraft.service.dto.WechatAuthCodeDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.core.web.session.SessionAuthHelper;
import com.fungame.core.web.session.SessionVals;

@Service
public class UserService {
	private static Logger logger = LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	public WechatApi wechatApi;
	@Autowired
	public UserBaseDao userBaseDao;
	@Autowired
	public UserGameDao userGameDao;
	@Autowired
	public UserShareAwardDao userShareAwardDao;
	@Autowired
	public DictCfgDao dictCfgDao;
	@Autowired
	RedpackCfgDao redpackCfgDao;
	
    public LoginDTO updateAndLoginWX(String code,String name, String img, String pf, 
    		String model, String fromAppId, int fromUserId, String fromType) throws Exception {
    	WechatAuthCodeDTO rsp = this.wechatApi.getWxSession(code);
    	return this.updateAndLogin(rsp.getOpenid(), name, img, rsp.getSessionKey(), pf, model, fromAppId, fromUserId, fromType);
    }
    
    public LoginDTO updateAndLogin(String openid,String name, String img, String sessionKey,
    		String pf, String model, String fromAppId, int fromUserId, String fromType) throws Exception {
    	UserBase userBase = this.userBaseDao.select(openid);
    	int userID = userBase != null ? userBase.getId(): 0;
		
    	boolean isNew = false;
    	if(userID == 0) {
    		userBase = new UserBase();
    		userBase.setCreatedAt(new Date());
    		userBase.setOpenid(openid);
    		userBase.setSessionKey(sessionKey);
    		userBase.setUnionid("");
    		userBase.setName(name);
    		userBase.setImg(img);
    		
    		this.userBaseDao.insert(userBase);
    		userID = userBase.getId();
    		BillLogger.user(userID, openid, pf, model, fromAppId);
    		isNew = true;
    	}
    	else {
    		BillLogger.login(userID, openid, pf, model, fromAppId);
    	}
    	
    	this.dealLoginFromOtherUser(userBase, isNew, fromUserId, fromType);
    	
    	SessionVals vals = new SessionVals();
    	vals.setOpenid(openid);
    	vals.setUid(userID);
    	String token = SessionAuthHelper.encode(vals);
    	LoginDTO dto = new LoginDTO();
    	dto.setOpenid(openid);
    	dto.setToken(token);
    	dto.setUid(userID);
    	return dto;
    }
    
    private void dealLoginFromOtherUser(UserBase userBase, boolean isNewUser, int fromUserId, String fromType) {
    	if(fromUserId > 0 && fromUserId != userBase.getId()) {
    		logger.info("user {} login from {} {}", userBase.getName(), fromUserId, fromType);
    		this.userShareAwardDao.touchShareEvent(userBase, isNewUser, fromUserId, fromType);
    	}
    }
    
    public UserGame getUserGame(int userId) {
    	UserGame userGame = this.userGameDao.select(userId);
    	if(userGame == null) {
    		userGame = new UserGame();
    		userGame.setCoin(300);
    		userGame.setQzb(0);
    		userGame.setId(userId);
    		userGame.setCreatedAt(new Date());
    		this.userGameDao.insert(userGame);
    	}
    	return userGame;
    }
    
    public void updateBestScore(int userId, int higthScore) {
    	if(higthScore > 0) {
    		this.userGameDao.updateBestScore(userId, higthScore);
    	}
    }
    
    public int addUserCoin(int userId, int incrCoin, int reason, int subreason) throws AppException {
    	UserGame userGame = this.userGameDao.select(userId);
    	int coin = userGame.getCoin();
    	if(incrCoin == 0) return coin;
    	if(incrCoin < 0 && Math.abs(incrCoin) > coin) {
    		throw new AppException(AppError.Coin_Lack);
    	}
    	BillLogger.coin(userId, 0, coin, incrCoin, reason, subreason);
    	this.userGameDao.updateCoin(userId, incrCoin, reason);
    	return coin + incrCoin;
    }
    
    public int addUserQzb(int userId, int incrQzb, int reason, int subreason) throws AppException {
    	UserGame userGame = this.userGameDao.select(userId);
    	int qzb = userGame.getQzb();
    	if(incrQzb < 0 && Math.abs(incrQzb) > qzb) {
    		throw new AppException(AppError.Qzb_Lack);
    	}
    	BillLogger.qzb(userId, 0, qzb, incrQzb, reason, subreason);
    	this.userGameDao.updateQzb(userId, incrQzb);
    	return qzb + incrQzb;
    }
    public UserBase selectById(int id) {
		return this.userBaseDao.selectById(id);
	}
    
    public AddMoneyRspVO addUserMoney(int userId, double incrMoney, int reason, int subreason) throws AppException, CacheException {
    	UserGame userGame = this.userGameDao.select(userId);
    	AddMoneyRspVO res = new AddMoneyRspVO();
    	double mymoney = userGame.getMoney();
    	switch (reason) {
		case BillLogger.reason_money_newuser:
			double moneyLimit = this.dictCfgDao.doubleValue("RedNewUserLimit", 7.5);
			if(moneyLimit <= userGame.getMoneyNewUser() + incrMoney) {
	    		incrMoney = moneyLimit - mymoney;
	    		incrMoney = incrMoney <= 0 ? 0: incrMoney;
	    	}
			break;
		case BillLogger.reason_money_plane:
		case BillLogger.reason_money_redpack:
		default:
	    	break;
		}
    	BillLogger.money(userId, 0, mymoney, incrMoney, reason, subreason);
    	switch (reason) {
		case BillLogger.reason_money_newuser:
	    	this.userGameDao.updateMoneyNewUser(userId, mymoney + incrMoney, userGame.getMoneyNewUser()+incrMoney);
			break;
		case BillLogger.reason_money_plane:
		case BillLogger.reason_money_redpack:
		default:
	    	this.userGameDao.updateMoney(userId, mymoney + incrMoney);
			break;
		}
//    	logger.info("incrMoney {} mymoney {} total {} round {}", incrMoney, mymoney, incrMoney+mymoney,
//    			new BigDecimal(mymoney + incrMoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
    	res.setMoney(new BigDecimal(incrMoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
    	res.setMymoney(new BigDecimal(mymoney + incrMoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
    	
    	AddMoneyRspVO checkVO = this.readyUserMoney(userId, reason);
    	res.setCanGetMoney(checkVO.getCanGetMoney());
    	res.setCanGetRedNewUser(checkVO.getCanGetRedNewUser());
    	return res;
    }
    
    public AddMoneyRspVO readyUserMoney(int userId, int reason) throws AppException, CacheException {
    	UserGame userGame = this.userGameDao.select(userId);
    	AddMoneyRspVO res = new AddMoneyRspVO();
    	double mymoney = userGame.getMoney();
    	double moneyLimit = 0;
    	int canGetRedpack = 0;
    	int canGetRedNewUser = 0;
    	double incrMoney = 0;
    	double incrMoneyNewUser = 0;
    	double incrMoneyPlane = 0;
    	double incrMoneyRedpack = 0;
    	
    	RedpackCfg cfg = this.redpackCfgDao.get(1, 1);
    	int incr = RandomUtils.nextInt((int)(cfg.getMin()*100), (int)(cfg.getMax()*100 + 1));
    	incrMoneyPlane = incr/100.0D;
    	
		moneyLimit = this.dictCfgDao.doubleValue("RedNewUserLimit", 7.5);
    	cfg = this.redpackCfgDao.get(2, 1);
    	incr = RandomUtils.nextInt((int)(cfg.getMin()*100), (int)(cfg.getMax()*100 + 1));
    	incrMoneyNewUser = incr/100.0D;
    	if(userGame.getMoneyNewUser() + incrMoneyNewUser <= moneyLimit) canGetRedNewUser = 1;
    	
    	cfg = this.redpackCfgDao.get(3, 1);
    	incr = RandomUtils.nextInt((int)(cfg.getMin()*100), (int)(cfg.getMax()*100 + 1));
    	incrMoneyRedpack = incr/100.0D;
    	
    	switch (reason) {
		case BillLogger.reason_money_plane:
			incrMoney = incrMoneyPlane;
			break;
		case BillLogger.reason_money_newuser:
			incrMoney = incrMoneyNewUser;
			break;
		default:
		case BillLogger.reason_money_redpack:
			incrMoney = incrMoneyRedpack;
			break;
		}
    	double moneyTotalLimit = this.dictCfgDao.doubleValue("RedpackTotalLimit", 18);
    	if(moneyTotalLimit <= mymoney + incrMoney) {
    		incrMoney = moneyTotalLimit - mymoney;
    		incrMoney = incrMoney <= 0 ? 0: incrMoney;
    		canGetRedpack = 0;
    		canGetRedNewUser = 0;
    	}
    	else canGetRedpack = 1;
    	
    	BillLogger.readyMoney(userId, 0, mymoney, incrMoney, 0, 0);
    	res.setMoney(new BigDecimal(incrMoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
    	res.setMymoney(new BigDecimal(mymoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
    	res.setCanGetMoney(canGetRedpack);
    	res.setCanGetRedNewUser(canGetRedNewUser);
    	return res;
    }
//    public static void main(String []args) {
////   	incrMoney 0.53 mymoney 16.28 total 16.810000000000002 round 16.82
//    	double incrMoney = 0.53;
//    	double mymoney = 16.28;
//    	double total = new BigDecimal(incrMoney).add(new BigDecimal(mymoney)).doubleValue();
//    	double round = new BigDecimal(incrMoney+mymoney).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
//    	logger.info("incrMoney {} mymoney {} total {} round {}", incrMoney, mymoney, total, round);
//    }
}
