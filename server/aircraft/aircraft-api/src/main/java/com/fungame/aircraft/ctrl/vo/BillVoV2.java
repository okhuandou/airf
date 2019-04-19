package com.fungame.aircraft.ctrl.vo;

public class BillVoV2 {
	private int card;
	private int slot;
	private int act;
	private String ext1;
	private String ext2;
	private String ext3;
	private String ext4;
	private String ext5;
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
	public String getExt1() {
		return ext1;
	}
	public void setExt1(String ext1) {
		this.ext1 = ext1;
	}
	public String getExt2() {
		return ext2;
	}
	public void setExt2(String ext2) {
		this.ext2 = ext2;
	}
	public String getExt3() {
		return ext3;
	}
	public void setExt3(String ext3) {
		this.ext3 = ext3;
	}
	public String getExt4() {
		return ext4;
	}
	public void setExt4(String ext4) {
		this.ext4 = ext4;
	}
	public String getExt5() {
		return ext5;
	}
	public void setExt5(String ext5) {
		this.ext5 = ext5;
	}
	@Override
	public String toString() {
		return "BillVO [card=" + card + ", slot=" + slot + ", act=" + act + ", ext1=" + ext1 + ", ext2=" + ext2
				+ ", ext3=" + ext3 + ", ext4=" + ext4 + ", ext5=" + ext5 + "]";
	}
}
