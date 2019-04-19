package com.fungame.aircraft.ctrl.vo;

public class AddMoneyRspVO {
	private double money;
	private double mymoney;
	private int canGetMoney;
	private int canGetRedNewUser;
	public double getMoney() {
		return money;
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public double getMymoney() {
		return mymoney;
	}
	public void setMymoney(double mymoney) {
		this.mymoney = mymoney;
	}
	public int getCanGetMoney() {
		return canGetMoney;
	}
	public void setCanGetMoney(int canGetMoney) {
		this.canGetMoney = canGetMoney;
	}
	public int getCanGetRedNewUser() {
		return canGetRedNewUser;
	}
	public void setCanGetRedNewUser(int canGetRedNewUser) {
		this.canGetRedNewUser = canGetRedNewUser;
	}
	@Override
	public String toString() {
		return "AddMoneyRspVO [money=" + money + ", mymoney=" + mymoney + ", canGetMoney=" + canGetMoney
				+ ", canGetRedNewUser=" + canGetRedNewUser + "]";
	}
	
}
