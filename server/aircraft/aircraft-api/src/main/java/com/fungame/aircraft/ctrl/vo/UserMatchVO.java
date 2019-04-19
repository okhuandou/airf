package com.fungame.aircraft.ctrl.vo;

import java.util.List;

public class UserMatchVO {
	private int userId;
	private int remainSec;
	private int master;
	private List<Item> items;
	
	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getRemainSec() {
		return remainSec;
	}

	public void setRemainSec(int remainSec) {
		this.remainSec = remainSec;
	}

	public int getMaster() {
		return master;
	}

	public void setMaster(int master) {
		this.master = master;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public static class Item {
		private int userId;
		private String name;
		private String headimg;
		private int score;
		private int success;
		private int award;
		private int awardGot;
		private int heroKind;
		private int heroSeq;
		public int getUserId() {
			return userId;
		}
		public void setUserId(int userId) {
			this.userId = userId;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getHeadimg() {
			return headimg;
		}
		public void setHeadimg(String headimg) {
			this.headimg = headimg;
		}
		public int getScore() {
			return score;
		}
		public void setScore(int score) {
			this.score = score;
		}
		public int getSuccess() {
			return success;
		}
		public void setSuccess(int success) {
			this.success = success;
		}
		public int getAward() {
			return award;
		}
		public void setAward(int award) {
			this.award = award;
		}
		public int getAwardGot() {
			return awardGot;
		}
		public void setAwardGot(int awardGot) {
			this.awardGot = awardGot;
		}
		public int getHeroKind() {
			return heroKind;
		}
		public void setHeroKind(int heroKind) {
			this.heroKind = heroKind;
		}
		public int getHeroSeq() {
			return heroSeq;
		}
		public void setHeroSeq(int heroSeq) {
			this.heroSeq = heroSeq;
		}
		@Override
		public String toString() {
			return "UserMatchVO [userId=" + userId + ", name=" + name + ", headimg=" + headimg + ", score=" + score
					+ ", success=" + success + "]";
		}
	}

}
