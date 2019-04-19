package com.fungame.aircraft.service.dto;

import java.util.Date;
import java.util.List;

import com.fungame.aircraft.dao.entity.SignCfg;

public class UserSignRspDTO {
	
	private List<SignDTO> sign;
	private boolean isTodayCanSign;//今日是否已签到
	private int signNum;//已签到几天
	private Date signTime;
	
	public Date getSignTime() {
		return signTime;
	}

	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}

	public int getSignNum() {
		return signNum;
	}

	public void setSignNum(int signNum) {
		this.signNum = signNum;
	}

	public boolean isTodayCanSign() {
		return isTodayCanSign;
	}

	public void setTodayCanSign(boolean isTodayCanSign) {
		this.isTodayCanSign = isTodayCanSign;
	}

	public List<SignDTO> getSign() {
		return sign;
	}

	public void setSign(List<SignDTO> sign) {
		this.sign = sign;
	}

	@Override
	public String toString() {
		return "UserSignRspDTO [sign=" + sign + ", isTodayCanSign=" + isTodayCanSign + ", signNum=" + signNum
				+ ", signTime=" + signTime + "]";
	}

	public static class SignDTO{
		public SignCfg signCfg;
		boolean isSign = false;//true 已经签到过、图标灰暗。false 没签到过、图标亮起
		
		public SignCfg getSignCfg() {
			return signCfg;
		}
		public void setSignCfg(SignCfg signCfg) {
			this.signCfg = signCfg;
		}
		public boolean isSign() {
			return isSign;
		}
		public void setSign(boolean isSign) {
			this.isSign = isSign;
		}
		@Override
		public String toString() {
			return "UserSignRspDTO [signCfg=" + signCfg + ", isSign=" + isSign + "]";
		}
	}
	
}
