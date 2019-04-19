package com.fungame.aircraft.service;

public enum AppError {

	e401(401, "权限不足！"),
	Coin_Lack(2010, "金币不足"),
	Qzb_Lack(2011, "求助币不足"),
	Sign_Lack(2012, "不能签到"),
	Share_Award_Err(2020, "助力分享没达到指标"),
	Get_Ext_award_Err(2021,"助力分享额外礼包奖励已领取过,不能重复领取"),
	Hero_NotExit(2030,"英雄不存在"),
	Match_Err(2031,"挑战不能重复提交分数"),
	;
	private int code;
	private String msg;
	private AppError(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
    @Override
    public String toString() {
        return code+"_"+msg;
    }
}
