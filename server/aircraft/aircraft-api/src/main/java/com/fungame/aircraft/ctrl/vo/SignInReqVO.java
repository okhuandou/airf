package com.fungame.aircraft.ctrl.vo;

public class SignInReqVO {
	
	private int signNum;
	private int coin;
	
	public int getCoin() {
		return coin;
	}

	public void setCoin(int coin) {
		this.coin = coin;
	}

	public int getSignNum() {
		return signNum;
	}

	public void setSignNum(int signNum) {
		this.signNum = signNum;
	}

	@Override
	public String toString() {
		return "SignInReqVO [signNum=" + signNum + ", coin=" + coin + "]";
	}
}
