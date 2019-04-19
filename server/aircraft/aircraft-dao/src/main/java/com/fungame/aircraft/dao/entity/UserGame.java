package com.fungame.aircraft.dao.entity;

import java.math.BigDecimal;
import java.util.Date;

public class UserGame {
	private int id;
	private int coin;
	private int qzb;
	private Date createdAt;
	private int bestScore;
	private int signNum;
	private Date signTime;
	private Date bestScoreModifiedAt;
	private Date inviteNewRecvAt;
	private int inviteNewRecv;
	private double money;
	private double moneyNewUser;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getCoin() {
		return coin;
	}
	public void setCoin(int coin) {
		this.coin = coin;
	}
	public int getQzb() {
		return qzb;
	}
	public void setQzb(int qzb) {
		this.qzb = qzb;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public int getBestScore() {
		return bestScore;
	}
	public void setBestScore(int bestScore) {
		this.bestScore = bestScore;
	}
	public int getSignNum() {
		return signNum;
	}
	public void setSignNum(int signNum) {
		this.signNum = signNum;
	}
	public Date getSignTime() {
		return signTime;
	}
	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}
	public Date getBestScoreModifiedAt() {
		return bestScoreModifiedAt;
	}
	public void setBestScoreModifiedAt(Date bestScoreModifiedAt) {
		this.bestScoreModifiedAt = bestScoreModifiedAt;
	}
	public Date getInviteNewRecvAt() {
		return inviteNewRecvAt;
	}
	public void setInviteNewRecvAt(Date inviteNewRecvAt) {
		this.inviteNewRecvAt = inviteNewRecvAt;
	}
	public int getInviteNewRecv() {
		return inviteNewRecv;
	}
	public void setInviteNewRecv(int inviteNewRecv) {
		this.inviteNewRecv = inviteNewRecv;
	}
	public double getMoney() {
		return new BigDecimal(this.money).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public double getMoneyNewUser() {
		return new BigDecimal(this.moneyNewUser).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
	}
	public void setMoneyNewUser(double moneyNewUser) {
		this.moneyNewUser = moneyNewUser;
	}
	@Override
	public String toString() {
		return "UserGame [id=" + id + ", coin=" + coin + ", qzb=" + qzb + ", createdAt=" + createdAt + ", bestScore="
				+ bestScore + ", signNum=" + signNum + ", signTime=" + signTime + ", bestScoreModifiedAt="
				+ bestScoreModifiedAt + ", inviteNewRecvAt=" + inviteNewRecvAt + ", inviteNewRecv=" + inviteNewRecv
				+ "]";
	}
	
}
