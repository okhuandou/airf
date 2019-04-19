package com.fungame.aircraft.ctrl.vo;

import java.util.List;

import com.fungame.aircraft.service.dto.UserShareNewDTO;

public class UserShareNewVO {
	private List<UserShareNewDTO> list;
	private int isRecv;
	private AwardItemsVO award;
	public List<UserShareNewDTO> getList() {
		return list;
	}
	public void setList(List<UserShareNewDTO> list) {
		this.list = list;
	}
	public int getIsRecv() {
		return isRecv;
	}
	public void setIsRecv(int isRecv) {
		this.isRecv = isRecv;
	}
	public AwardItemsVO getAward() {
		return award;
	}
	public void setAward(AwardItemsVO award) {
		this.award = award;
	}
	@Override
	public String toString() {
		return "UserShareNewVO [list=" + list + ", isRecv=" + isRecv + ", award=" + award + "]";
	}
	
}
