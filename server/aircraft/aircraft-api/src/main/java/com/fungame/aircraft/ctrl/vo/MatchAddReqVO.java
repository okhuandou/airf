package com.fungame.aircraft.ctrl.vo;

public class MatchAddReqVO {
	private int heroKind;
	private int heroSeq;
	private int score;
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
	@Override
	public String toString() {
		return "MatchAddReqVO [heroKind=" + heroKind + ", heroSeq=" + heroSeq + ", score=" + score + "]";
	}
}
