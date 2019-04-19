package com.fungame.aircraft.ctrl.vo;

public class MatchAddUserVO {
	private int coin;
	private int mycoin;
	private int success;
	public int getCoin() {
		return coin;
	}
	public void setCoin(int coin) {
		this.coin = coin;
	}
	public int getMycoin() {
		return mycoin;
	}
	public void setMycoin(int mycoin) {
		this.mycoin = mycoin;
	}
	public int getSuccess() {
		return success;
	}
	public void setSuccess(int success) {
		this.success = success;
	}
	@Override
	public String toString() {
		return "MatchAddUserVO [coin=" + coin + ", mycoin=" + mycoin + ", success=" + success + "]";
	}
}
