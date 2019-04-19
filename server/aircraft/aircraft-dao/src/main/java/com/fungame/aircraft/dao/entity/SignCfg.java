package com.fungame.aircraft.dao.entity;

public class SignCfg {
	private int id;
	private int itemId;
	private String descr;
	private int itemNum;
	private int itemId2;
	private int itemNum2;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getItemId() {
		return itemId;
	}
	public void setItemId(int itemId) {
		this.itemId = itemId;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	public int getItemNum() {
		return itemNum;
	}
	public void setItemNum(int itemNum) {
		this.itemNum = itemNum;
	}
	public int getItemId2() {
		return itemId2;
	}
	public void setItemId2(int itemId2) {
		this.itemId2 = itemId2;
	}
	public int getItemNum2() {
		return itemNum2;
	}
	public void setItemNum2(int itemNum2) {
		this.itemNum2 = itemNum2;
	}
	@Override
	public String toString() {
		return "SignCfg [id=" + id + ", itemId=" + itemId + ", descr=" + descr + ", itemNum=" + itemNum + ", itemId2="
				+ itemId2 + ", itemNum2=" + itemNum2 + "]";
	}
}
