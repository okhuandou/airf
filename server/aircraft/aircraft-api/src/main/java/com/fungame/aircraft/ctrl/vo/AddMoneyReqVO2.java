package com.fungame.aircraft.ctrl.vo;

public class AddMoneyReqVO2 {
	private double money;
	private int reason;
	public int getReason() {
		return reason;
	}

	public void setReason(int reason) {
		this.reason = reason;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	@Override
	public String toString() {
		return "AddMoneyReqVO [money=" + money + ", reason=" + reason + "]";
	}
	
}
