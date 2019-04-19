package com.fungame.aircraft.ctrl.vo;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class AwardItemsVO {
	@ApiModelProperty(value="获得的金币")
	private int coin;
	@ApiModelProperty(value="我的金币")
	private int mycoin;
	@ApiModelProperty(value="获得的求助币")
	private int qzb;
	@ApiModelProperty(value="我的求助币")
	private int myqzb;
	@ApiModelProperty(value="获得道具")
	private List<Item> items;
	@ApiModelProperty(value="hero")
	UserHeroVO hero;
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

	public int getQzb() {
		return qzb;
	}

	public void setQzb(int qzb) {
		this.qzb = qzb;
	}

	public int getMyqzb() {
		return myqzb;
	}

	public void setMyqzb(int myqzb) {
		this.myqzb = myqzb;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public UserHeroVO getHero() {
		return hero;
	}

	public void setHero(UserHeroVO hero) {
		this.hero = hero;
	}

	@Override
	public String toString() {
		return "AwardItemsVO [coin=" + coin + ", mycoin=" + mycoin + ", qzb=" + qzb + ", myqzb=" + myqzb + ", items="
				+ items + ", hero=" + hero + "]";
	}

	public static class Item {
		private int id;
		private int num;
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public int getNum() {
			return num;
		}
		public void setNum(int num) {
			this.num = num;
		}
		@Override
		public String toString() {
			return "Item [id=" + id + ", num=" + num + "]";
		}
	}
}
