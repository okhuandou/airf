package com.fungame.aircraft.ctrl.vo;

import java.util.Date;

public class UserGameVO {
	private int coin;
	private int qzb;
	private int higthScore;
	private int signNum;
	private Date signTime;
	private int helpAdd;
	private int helpExpire;
	private double money;
	private int createdDays;
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
	public int getHigthScore() {
		return higthScore;
	}
	public void setHigthScore(int higthScore) {
		this.higthScore = higthScore;
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
	public int getHelpAdd() {
		return helpAdd;
	}
	public void setHelpAdd(int helpAdd) {
		this.helpAdd = helpAdd;
	}
	public int getHelpExpire() {
		return helpExpire;
	}
	public void setHelpExpire(int helpExpire) {
		this.helpExpire = helpExpire;
	}
	public double getMoney() {
		return money;
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public int getCreatedDays() {
		return createdDays;
	}
	public void setCreatedDays(int createdDays) {
		this.createdDays = createdDays;
	}
	@Override
	public String toString() {
		return "UserGameVO [coin=" + coin + ", qzb=" + qzb + ", higthScore=" + higthScore + ", signNum=" + signNum
				+ ", signTime=" + signTime + ", helpAdd=" + helpAdd + ", helpExpire=" + helpExpire + ", createdDays="
				+ createdDays + "]";
	}
}
