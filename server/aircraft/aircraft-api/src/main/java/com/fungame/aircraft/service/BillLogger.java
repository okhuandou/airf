package com.fungame.aircraft.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BillLogger {
	private static final Logger logger = LoggerFactory.getLogger("billStatLogger");
	public static final String SPLIT_MARK = "|";

	public static final String User = "user";
	public static final String Login = "login";
	public static final String Upgrade = "upgrade";
	public static final String Coin = "coin";
	public static final String Hero = "hero";
	public static final String Comm = "comm";
	public static final String Qzb = "qzb";
	public static final String Money = "money";
	public static final String ReadyMoney = "readymoney";
	
	public static final int reason_coin_award = 1000;
	public static final int reason_coin_upgrade = 1001;
	public static final int reason_coin_video = 1002;
	public static final int reason_coin_fight = 1003;
	public static final int reason_coin_hero = 1004;
	public static final int reason_coin_share = 1005;
	public static final int reason_coin_chuzhan = 1006;
	public static final int reason_coin_task = 2000;
	public static final int reason_coin_AwardInviteNew = 2001;
	public static final int reason_coin_match = 2002;

	public static final int reason_money_plane = 3000;//飞机id(3,8)
	public static final int reason_money_newuser = 3001;//新用户保护
	public static final int reason_money_redpack = 3002;//其他
	
	public static final int reason_addhero_mode_coin = 1;
	public static final int reason_addhero_mode_award = 2;

	public static void user(int userId, String openid, String pf, String model, String fromAppId) {
		log(User, userId, openid, pf, model, fromAppId);
	}
	public static void login(int userId, String openid, String pf, String model, String fromAppId) {
		log(Login, userId, openid, pf, model, fromAppId);
	}
	public static void common(int userId, int card, int slot, int act, int ext1, int ext2, int ext3, int ext4, int ext5) {
		log(Comm, userId, card,slot,act,ext1,ext2,ext3,ext4,ext5);
	}
	public static void commonV2(int userId, int card, int slot, int act, String ext1, String ext2, String ext3, String ext4, String ext5) {
		log(Comm, userId, card,slot,act,ext1,ext2,ext3,ext4,ext5);
	}
	//英雄升级
	public static void upgrade(int userId, int userLevel, int userCoin, int useCoin, int heroKind, int heroId, int heroLevel, int type, int typeLevel) {
		log(Upgrade, userId, userLevel, userCoin, useCoin, heroKind, heroId, heroLevel, type, typeLevel);
	}
	//英雄获得
	public static void hero(int userId, int userLevel, int userCoin, int heroKind, int heroId, int mode) {
		log(Hero, userId, userLevel, userCoin, heroKind, heroId, mode);
	}
	//金币获得、消耗
	public static void coin(int userId, int userLevel, int userCoin, int coin, int reason, int subReason) {
		log(Coin, userId, userLevel, userCoin, coin, reason, subReason);
	}
	//求助币获得、消耗
	public static void qzb(int userId, int userLevel, int userQzb, int qzb, int reason, int subReason) {
		log(Qzb, userId, userLevel, userQzb, qzb, reason, subReason);
	}
	public static void money(int userId, int userLevel, double userMoney, double money, int reason, int subReason) {
		log(Money, userId, userLevel, userMoney, money, reason, subReason);
	}
	public static void readyMoney(int userId, int userLevel, double userMoney, double money, int reason, int subReason) {
		log(ReadyMoney, userId, userLevel, userMoney, money, reason, subReason);
	}
	/**
	 * 拼接Object，记录日志
	 * @param params
	 */
	private static void log(Object ...params){
		StringBuilder sb = new StringBuilder();
		boolean isFirst = true;
		for(Object obj: params){
			if(isFirst)
				isFirst=false;
			else
				sb.append(SPLIT_MARK);
			
			sb.append(obj);
		}
		logger.info(sb.toString());
	}
	
	private static String combin(Object ...params){
		StringBuilder sb = new StringBuilder();
		boolean isFirst = true;
		for(Object obj: params){
			if(isFirst)
				isFirst=false;
			else
				sb.append(SPLIT_MARK);
			sb.append(obj);
		}
		return sb.toString();
	}
}
