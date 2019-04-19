package com.fungame.aircraft.dao.entity;

public class Task {
	private int id;
	private int kind;
	private int need;
	private int trigger1;
	private int param1;
	private int param2;
	private int param3;
	private int coin;
	private int qzb;

	public static final int TaskKind_GetCoin = 1;
	public static final int TaskKind_InviteFriend = 5;
	public static final int TaskKind_Upgrade_CostCoin = 6;
	public static final int TaskKind_Figth = 7;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getKind() {
		return kind;
	}
	public void setKind(int kind) {
		this.kind = kind;
	}
	public int getNeed() {
		return need;
	}
	public void setNeed(int need) {
		this.need = need;
	}
	public int getTrigger1() {
		return trigger1;
	}
	public void setTrigger1(int trigger1) {
		this.trigger1 = trigger1;
	}
	public int getParam1() {
		return param1;
	}
	public void setParam1(int param1) {
		this.param1 = param1;
	}
	public int getParam2() {
		return param2;
	}
	public void setParam2(int param2) {
		this.param2 = param2;
	}
	public int getParam3() {
		return param3;
	}
	public void setParam3(int param3) {
		this.param3 = param3;
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
	@Override
	public String toString() {
		return "Task [id=" + id + ", kind=" + kind + ", need=" + need + ", trigger1=" + trigger1 + ", param1=" + param1
				+ ", param2=" + param2 + ", param3=" + param3 + ", coin=" + coin + ", qzb=" + qzb + "]";
	}
}
