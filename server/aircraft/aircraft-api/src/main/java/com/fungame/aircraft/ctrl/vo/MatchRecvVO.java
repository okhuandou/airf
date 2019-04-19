package com.fungame.aircraft.ctrl.vo;

public class MatchRecvVO {
	private int coin;
	private int mycoin;
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
	@Override
	public String toString() {
		return "MatchRecvVO [coin=" + coin + ", mycoin=" + mycoin + "]";
	}
}
