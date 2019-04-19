package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO.Item;
import com.fungame.aircraft.ctrl.vo.UserHeroVO;
import com.fungame.aircraft.dao.UserGameDao;
import com.fungame.aircraft.dao.UserHeroDao;
import com.fungame.aircraft.dao.UserShareAwardDao;
import com.fungame.aircraft.dao.UserShareNewDao;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.dao.entity.UserShareAward;
import com.fungame.aircraft.dao.entity.UserShareNew;
import com.fungame.aircraft.service.dto.UserShareAwardDTO;
import com.fungame.aircraft.service.dto.UserShareNewDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.mapper.BeanMapper;
import com.google.common.collect.Lists;

@Service
public class ShareService {
	@Autowired
	UserShareAwardDao userShareAwardDao;
	@Autowired
	UserShareNewDao userShareNewDao;
	@Autowired
	UserService userService;
	@Autowired
	UserGameDao userGameDao;
	@Autowired
	DictCfgDao dictCfgDao;
	@Autowired
	UserItemService userItemService;
	@Autowired
	UserHeroDao userHeroDao;
	@Autowired
	UserHeroService userHeroService;
	
	public void addAwardFriend(int userId, int friendUserId, String friendName, String friendHeadimg) throws CacheException {
		if(userId == friendUserId) {
			return;
		}
		int cnt = this.userShareAwardDao.selectCount(userId);
		JSONArray arr = this.dictCfgDao.jsonArrayValue(DictCfg.ShareAwardCoin, "[200,200,300,300,500,500]");
		if(cnt >= arr.size()) {
			return;
		}
		UserShareAward award = new UserShareAward();
		award.setCreatedAt(new Date());
		award.setFriendHeadimg(friendHeadimg);
		award.setFriendName(friendName);
		award.setIsRecv(0);
		award.setUserId(userId);
		award.setFriendUserId(friendUserId);
		this.userShareAwardDao.insert(award);
	}
	
	public List<UserShareAwardDTO> list(int userId) throws CacheException {
		List<UserShareAward> list = this.userShareAwardDao.select(userId);
		JSONArray arr = this.dictCfgDao.jsonArrayValue(DictCfg.ShareAwardCoin, "[200,200,300,300,500,500]");
		List<Integer> coinList = arr.parseArray(arr.toJSONString(), Integer.class);
		List<UserShareAwardDTO> result = new ArrayList<>();
		for (int idx=0; idx<=coinList.size()-1; idx++) {
			UserShareAwardDTO userShareDTO = null;
			if(list.size() >= idx+1) {
				UserShareAward userShare = list.get(idx);
				userShareDTO = BeanMapper.map(userShare, UserShareAwardDTO.class);
				userShareDTO.setAward(coinList.get(idx));
				if(userShare.getIsRecv() == 1 && userShare.getRecvAt() != null) {
					long nowDate = new Date().getTime();
					long endTime = userShare.getRecvAt().getTime() + 10*60*1000L;
					userShareDTO.setRemainSec((int)((endTime - nowDate)/1000));
				}
			}else {
				userShareDTO = new UserShareAwardDTO();
			}
			if(userShareDTO.getRemainSec() < 0) userShareDTO.setRemainSec(0);
			userShareDTO.setAward(coinList.get(idx));
			result.add(userShareDTO);
		}
		return result;
	}
	public int updateAward(int userId, int awardId) throws AppException, CacheException {
		boolean updated = false;
		int addCoin = 0;
		JSONArray arr = this.dictCfgDao.jsonArrayValue(DictCfg.ShareAwardCoin, "[200,200,300,300,500,500]");
		List<UserShareAward> list = this.userShareAwardDao.select(userId);
		if(awardId == 0) {
			if(list.size() < arr.size()) {
				throw new AppException(AppError.Share_Award_Err);
			}
			if(list.size() > arr.size()) {
				throw new AppException(AppError.Get_Ext_award_Err);
			}
			
			addCoin = this.dictCfgDao.intValue(DictCfg.ShareAwardCoinExt, 2000);
			UserShareAward award = new UserShareAward();
			award.setCreatedAt(new Date());
			award.setFriendHeadimg("");
			award.setFriendName("");
			award.setFriendUserId(1);
			award.setIsRecv(1);
			award.setUserId(userId);
			this.userShareAwardDao.insert(award);
			updated = true;
		}
		else {
			if(list != null) {				
				int cnt = 0;
				for(UserShareAward award: list) {
					if(award.getId() == awardId) {
						if(award.getIsRecv() == 0) {
							addCoin = arr.getIntValue(cnt);
						}
						break;
					}
					cnt++;
				}
				if(addCoin <= 0) {
					throw new AppException(AppError.Coin_Lack);
				}
				updated = this.userShareAwardDao.updateIsReceive(userId, awardId);
			}
		}
		if(updated) {
			this.userService.addUserCoin(userId, addCoin, BillLogger.reason_coin_award, awardId);
		}
		return addCoin;
	}
	

	public List<UserShareNewDTO> listInviteNew(int userId) throws CacheException {
		List<UserShareNew> list = this.userShareNewDao.select(userId);
		int cfgSize = this.dictCfgDao.intValue("InviteNewSize", 3);
		if(list != null && list.size() >= cfgSize) {
			UserShareNew shareNew = list.get(0);
			UserGame userGame = this.userService.getUserGame(userId);
			if(userGame.getInviteNewRecvAt() != null 
					&& userGame.getInviteNewRecvAt().after(shareNew.getCreatedAt())
					&& userGame.getInviteNewRecv() == 1) {
				this.userShareNewDao.removeAll(userId);
				this.userGameDao.updateInviteNew(userId, 0);
				list.clear();
			}
		}
		List<UserShareNewDTO> result = new ArrayList<>();
		int cnt = 0;
		for(UserShareNew shareNew: list) {
			UserShareNewDTO dto = new UserShareNewDTO();
			dto.setHeadimg(shareNew.getFriendHeadimg());
			dto.setName(shareNew.getFriendName());
			result.add(dto);
			cnt ++;
			if(cnt >= cfgSize) {
				break;
			}
		}
		return result;
	}
	
	public int getRecvInviteNewAwardState(int userId) throws CacheException {
		UserGame userGame = this.userService.getUserGame(userId);
		int cfgSize = this.dictCfgDao.intValue("InviteNewSize", 3);
		int ret = 0;
		if(this.userShareNewDao.selectCount(userId) >= cfgSize) {
			if(userGame.getInviteNewRecvAt() == null) {
				ret = 1;
			}
			else {
				List<UserShareNew> list = this.userShareNewDao.select(userId);
				if(list != null && ! list.isEmpty()) {
					UserShareNew shareNew = list.get(0);
					if(shareNew.getCreatedAt().after(userGame.getInviteNewRecvAt())) {
						ret = 1;
					}
					else {
						ret = userGame.getInviteNewRecv() == 1 ? 1: 2;
					}
				}
			}
		}
		return ret;
	}
	public AwardItemsVO inviteNewwardToAwardItemsVO(int userId) {
		JSONObject inviteNewAward = this.dictCfgDao.jsonValue("InviteNewAward", "{\"coin\":1000,\"items\":[{\"id\":10000,\"num\":5}]}");
		int incrCoin = inviteNewAward.getIntValue("coin");
		int incrQzb = inviteNewAward.getIntValue("qzb");
		JSONArray arr = inviteNewAward.getJSONArray("items");
		int itemId = arr.getJSONObject(0).getIntValue("id");
		int itemNum = arr.getJSONObject(0).getIntValue("num");
		
		AwardItemsVO res = new AwardItemsVO();
		res.setCoin(incrCoin);
		res.setQzb(incrQzb);
		
		if(itemId == 2000) {
			UserHero hero = this.userHeroDao.select(userId, 4);
			if(hero != null && ! hero.isNull()) {
				return res;
			}
		}
		
		Item item = new AwardItemsVO.Item();
		item.setId(itemId);
		item.setNum(itemNum);
		res.setItems(Lists.newArrayList(item));
		
		return res;
	}
	public AwardItemsVO updateAwardInviteNew(int userId) throws CacheException {
		AwardItemsVO res = this.inviteNewwardToAwardItemsVO(userId);
		int incrCoin = res.getCoin();
		int incrQzb = res.getQzb();
		int itemId = res.getItems().get(0).getId();
		int itemNum = res.getItems().get(0).getNum();
		
		this.userGameDao.updateInviteNew(userId, 1);
		if(incrCoin > 0) {
			this.userGameDao.updateCoin(userId, incrCoin, BillLogger.reason_coin_AwardInviteNew);
		}
		if(incrQzb > 0) {
			this.userGameDao.updateQzb(userId, incrQzb);
		}
		if(itemId == 1000) {
			this.userItemService.addItem(userId, itemId, itemNum);
		}
		else if(itemId == 2000) {
			UserHero userHero = this.userHeroService.addUserHero(userId, 4, UserHero.STATUS_GOT);
			res.setHero(BeanMapper.map(this.userHeroService.userHero2DTO(userHero), UserHeroVO.class));
		}
		
		UserGame userGame = this.userGameDao.select(userId);
		
		res.setMycoin(userGame.getCoin());
		res.setMyqzb(userGame.getQzb());
		return res;
	}
}
