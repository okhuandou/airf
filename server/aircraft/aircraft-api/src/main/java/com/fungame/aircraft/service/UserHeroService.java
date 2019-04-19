package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.dao.UserHeroDao;
import com.fungame.aircraft.dao.cfg.HeroDao;
import com.fungame.aircraft.dao.entity.Hero;
import com.fungame.aircraft.dao.entity.UserGame;
import com.fungame.aircraft.dao.entity.UserHero;
import com.fungame.aircraft.service.dto.HeroUpgradeRspDTO;
import com.fungame.aircraft.service.dto.UserHeroDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.mapper.BeanMapper;

@Service
public class UserHeroService {
	private Logger logger = LoggerFactory.getLogger(UserHeroService.class);
	@Autowired
	UserHeroDao userHeroDao;
	@Autowired
	HeroDao heroDao;
	@Autowired
	UserService userService;
	
	public UserHero addUserHero(int userId, int kind, int status) {
		Hero hero = this.heroDao.getFirstHeroByKind(kind);
		UserHero userHero = new UserHero();
		userHero.setAttackSpeed(hero.getInitAttackSpeed());
		userHero.setAttackSpeedLevel(1);
		userHero.setBlood(hero.getInitBlood());
		userHero.setBloodLevel(1);
		userHero.setCreatedAt(new Date());
		userHero.setHeroId(hero.getId());
		userHero.setKind(hero.getKind());
		userHero.setLevel(hero.getLevel());
		userHero.setPower(hero.getInitPower());
		userHero.setPowerLevel(1);
		userHero.setStatus(status);
		userHero.setUserId(userId);
		this.userHeroDao.insert(userHero);
		return userHero;
	}
	public UserHeroDTO userHero2DTO(UserHero userHero) {
		UserHeroDTO dto = BeanMapper.map(userHero, UserHeroDTO.class);
		Hero hero = this.heroDao.getHeroCfgByHeroId(dto.getHeroId(), dto.getKind());
		if(hero == null) {
			logger.info(userHero.toString());
			return null;
		}
		dto.setSubSeq(hero.getSubSeq());
		return dto;
	}
	public List<UserHeroDTO> getUserHeroList(int userId) {	
		List<UserHero> list = this.userHeroDao.selectAll(userId, this.heroDao.getKinds());
		if(list == null) {
			list = new ArrayList<>();
		}
		if(list.size() == 0) {
			Hero hero = this.heroDao.getFirstHeroByKind(1);
			UserHero userHero = this.addUserHero(userId, hero.getKind(), UserHero.STATUS_FIGHT);
			list.add(userHero);
		}
		List<UserHeroDTO> res = new ArrayList<>();
		for(UserHero userHero: list) {
			if(userHero.isNull()) continue;
			if(userHero.getAttackSpeedLevel() == 0) {//兼容bug
				userHero.setAttackSpeedLevel(1);
			}
			UserHeroDTO dto = this.userHero2DTO(userHero);
			if(dto == null) continue;
			res.add(dto);
		}
		return res;
	}

	public void updateHeroFightStatus(int userId, int kind, int status) {
		this.userHeroDao.updateStatusAll(userId, this.heroDao.getKinds(), UserHero.STATUS_GOT, UserHero.STATUS_FIGHT);
		this.userHeroDao.updateStatusJustOne(userId, kind, UserHero.STATUS_GOT, UserHero.STATUS_FIGHT);
	}
	
	public void updateHeroStatus(int userId, int kind, int fromStatus, int toStatus) {
		UserHero userHero = this.userHeroDao.select(userId, kind);
		if(userHero == null || userHero.isNull() || userHero.getStatus() != fromStatus) {
			return;
		}
		this.userHeroDao.updateStatusJustOne(userId, kind, fromStatus, toStatus);
	}
	
	public HeroUpgradeRspDTO updateHeroUpgrade(int userId, int kind, int type) throws AppException, CacheException {
		HeroUpgradeRspDTO rsp = new HeroUpgradeRspDTO();
		UserGame userGame = this.userService.getUserGame(userId);
		UserHero userHero = this.userHeroDao.select(userId, kind);
		if(userHero == null || userHero.isNull()) {
			throw new AppException(AppError.Hero_NotExit);
		}
		if(userHero.getAttackSpeedLevel() == 0) {//兼容bug
			userHero.setAttackSpeedLevel(1);
		}
		Hero heroCfg = this.heroDao.getHeroCfgByHeroId(userHero.getHeroId(), kind);
		int need = 0;
		switch(type) {
		case 1:
			need = heroCfg.getPowerNeed() + heroCfg.getPowerNeedIncr() * (userHero.getPowerLevel() - 1);
			break;
		case 2:
			need = heroCfg.getBloodNeed() + heroCfg.getBloodNeedIncr() * (userHero.getBloodLevel() - 1);
			break;
		case 3:
			need = heroCfg.getAttackSpeedNeed() + heroCfg.getAttackSpeedNeedIncr() * (userHero.getAttackSpeedLevel() - 1);
			break;
		}
		if(userGame.getCoin() >= need) {
			this.userService.addUserCoin(userId, need*-1, BillLogger.reason_coin_upgrade, kind);
			Hero nextHero = this.heroDao.getNextHeroCfg(heroCfg);
			int level = userHero.getLevel();
			int heroId = userHero.getHeroId();
			switch(type) {
			case 1:
				int powerLevel = userHero.getPowerLevel() + 1;
				if(nextHero != null && nextHero.getLevel() > heroCfg.getLevel()) {
					if(powerLevel >= nextHero.getLevel()
							&& userHero.getAttackSpeedLevel() >= nextHero.getLevel()
							&& userHero.getBloodLevel() >= nextHero.getLevel()) {
						level = nextHero.getLevel();
						heroId = nextHero.getId();
					}
				}
				BillLogger.upgrade(userId, 0, userGame.getCoin(), need, kind, heroId, level, type, powerLevel);
				this.userHeroDao.updatePower(userId, kind, 0, powerLevel, heroId, level);
				userHero.setPowerLevel(powerLevel);
				break;
			case 2:
				int bloodLevel = userHero.getBloodLevel() + 1;
				if(nextHero != null && nextHero.getLevel() > heroCfg.getLevel()) {
					if(userHero.getPowerLevel() >= nextHero.getLevel()
							&& userHero.getAttackSpeedLevel() >= nextHero.getLevel()
							&& bloodLevel >= nextHero.getLevel()) {
						level = nextHero.getLevel();
						heroId = nextHero.getId();
					}
				}
				BillLogger.upgrade(userId, 0, userGame.getCoin(), need, kind, heroId, level, type, bloodLevel);
				this.userHeroDao.updateBlood(userId, kind, 0, bloodLevel, heroId, level);
				userHero.setBloodLevel(bloodLevel);
				break;
			case 3:
				int attackSpeedLevel = userHero.getAttackSpeedLevel() + 1;
				if(nextHero != null && nextHero.getLevel() > heroCfg.getLevel()) {
					if(userHero.getPowerLevel() >= nextHero.getLevel()
							&& attackSpeedLevel >= nextHero.getLevel()
							&& userHero.getBloodLevel() >= nextHero.getLevel()) {
						level = nextHero.getLevel();
						heroId = nextHero.getId();
					}
				}
				BillLogger.upgrade(userId, 0, userGame.getCoin(), need, kind, heroId, level, type, attackSpeedLevel);
				this.userHeroDao.updateAttackSpeed(userId, kind, 0, attackSpeedLevel, heroId, level);
				userHero.setAttackSpeedLevel(attackSpeedLevel);
				break;
			}
			userHero.setLevel(level);
			userHero.setHeroId(heroId);
			rsp.setMyCoin(userGame.getCoin() - need);
		}
		else {
			throw new AppException(AppError.Coin_Lack);
		}
		rsp.setType(type);
		rsp.setHero(this.userHero2DTO(userHero));
		return rsp;
	}
	
	public UserHeroDTO addNewHeroUseCoin(int userId, int kind) throws AppException {
		UserHero userHero = this.userHeroDao.select(userId, kind);
		if(userHero == null || userHero.isNull() || userHero.getStatus() == UserHero.STATUS_NOT_GOT) {
			UserGame userGame = this.userService.getUserGame(userId);
			Hero hero = this.heroDao.getFirstHeroByKind(kind);
			if(hero.getAccess() != 1 || hero.getAccessParam() > userGame.getCoin()) {
				throw new AppException(AppError.Coin_Lack);
			}
			this.userService.addUserCoin(userId, hero.getAccessParam()*-1, BillLogger.reason_coin_hero, kind);
			BillLogger.hero(userId, 0, userGame.getCoin(), kind, hero.getId(), BillLogger.reason_addhero_mode_coin);
			if(userHero == null || userHero.isNull()) {
				userHero = this.addUserHero(userId, kind, UserHero.STATUS_GOT);
				this.userHeroDao.insert(userHero);
			}
			else {
				userHero.setStatus(UserHero.STATUS_GOT);
				this.userHeroDao.updateStatus(userId, hero.getKind(), UserHero.STATUS_GOT);
			}
		}
		return this.userHero2DTO(userHero);
	}
	public UserHeroDTO addNewHeroAward(int userId) throws AppException {
		Hero hero = this.heroDao.getFirstHeroByAccess(3);
		UserHero userHero = this.userHeroDao.select(userId, hero.getKind());
		if(userHero == null || userHero.isNull() || userHero.getStatus() == UserHero.STATUS_NOT_GOT) {
			UserGame userGame = this.userService.getUserGame(userId);
			BillLogger.hero(userId, 0, userGame.getCoin(), hero.getKind(), hero.getId(), BillLogger.reason_addhero_mode_award);
			if(userHero == null || userHero.isNull()) {
				userHero = this.addUserHero(userId, hero.getKind(), UserHero.STATUS_GET_READY);
				this.userHeroDao.insert(userHero);
			}
			else {
				userHero.setStatus(UserHero.STATUS_GET_READY);
				this.userHeroDao.updateStatus(userId, hero.getKind(), UserHero.STATUS_GET_READY);
			}
		}
		return this.userHero2DTO(userHero);
	}
}
