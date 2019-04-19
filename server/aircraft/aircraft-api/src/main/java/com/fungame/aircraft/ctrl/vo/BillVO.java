package com.fungame.aircraft.ctrl.vo;

public class BillVO {
	private int card;
	private int slot;
	private int act;
	private int ext1;
	private int ext2;
	private int ext3;
	private int ext4;
	private int ext5;
	public int getCard() {
		return card;
	}
	public void setCard(int card) {
		this.card = card;
	}
	public int getSlot() {
		return slot;
	}
	public void setSlot(int slot) {
		this.slot = slot;
	}
	public int getAct() {
		return act;
	}
	public void setAct(int act) {
		this.act = act;
	}
	public int getExt1() {
		return ext1;
	}
	public void setExt1(int ext1) {
		this.ext1 = ext1;
	}
	public int getExt2() {
		return ext2;
	}
	public void setExt2(int ext2) {
		this.ext2 = ext2;
	}
	public int getExt3() {
		return ext3;
	}
	public void setExt3(int ext3) {
		this.ext3 = ext3;
	}
	public int getExt4() {
		return ext4;
	}
	public void setExt4(int ext4) {
		this.ext4 = ext4;
	}
	public int getExt5() {
		return ext5;
	}
	public void setExt5(int ext5) {
		this.ext5 = ext5;
	}
	@Override
	public String toString() {
		return "BillVO [card=" + card + ", slot=" + slot + ", act=" + act + ", ext1=" + ext1 + ", ext2=" + ext2
				+ ", ext3=" + ext3 + ", ext4=" + ext4 + ", ext5=" + ext5 + "]";
	}
}
