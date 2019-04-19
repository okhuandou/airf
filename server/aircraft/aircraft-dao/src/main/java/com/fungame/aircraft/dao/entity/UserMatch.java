package com.fungame.aircraft.dao.entity;

import java.util.Date;

public class UserMatch {
	private int userId;
	private int friendUserId;
	private String friendName;
	private String friendHeadimg;
	private Date createdAt;
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
	public int getFriendUserId() {
		return friendUserId;
	}
	public void setFriendUserId(int friendUserId) {
		this.friendUserId = friendUserId;
	}
	public String getFriendName() {
		return friendName;
	}
	public void setFriendName(String friendName) {
		this.friendName = friendName;
	}
	public String getFriendHeadimg() {
		return friendHeadimg;
	}
	public void setFriendHeadimg(String friendHeadimg) {
		this.friendHeadimg = friendHeadimg;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
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
		return "UserMatch [userId=" + userId + ", friendUserId=" + friendUserId + ", friendName=" + friendName
				+ ", friendHeadimg=" + friendHeadimg + ", createdAt=" + createdAt + ", score=" + score + ", success="
				+ success + ", award=" + award + ", awardGot=" + awardGot + ", heroKind=" + heroKind + ", heroSeq="
				+ heroSeq + "]";
	}
}
