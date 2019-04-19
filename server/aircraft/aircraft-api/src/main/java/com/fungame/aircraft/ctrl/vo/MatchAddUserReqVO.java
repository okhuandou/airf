package com.fungame.aircraft.ctrl.vo;

public class MatchAddUserReqVO {
	private int heroKind;
	private int heroSeq;
	private int score;
	private int fromUserId;
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
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public int getFromUserId() {
		return fromUserId;
	}
	public void setFromUserId(int fromUserId) {
		this.fromUserId = fromUserId;
	}
	@Override
	public String toString() {
		return "MatchAddUserReqVO [heroKind=" + heroKind + ", heroSeq=" + heroSeq + ", score=" + score + "]";
	}
}
