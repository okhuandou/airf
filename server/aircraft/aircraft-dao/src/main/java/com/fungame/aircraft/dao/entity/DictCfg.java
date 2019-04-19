package com.fungame.aircraft.dao.entity;

public class DictCfg {
	private String type;
	private String dictKey;
	private String value;
	private String descr;

	public final static String ShareAwardCoinExt = "ShareAwardCoinExt";
	public final static String ShareAwardCoin = "ShareAwardCoin";
	public final static String ShareLockKind = "ShareLockKind";
	public final static String ShenheVer = "ShenheVer";
	public final static String ShenheShareLockKind = "ShenheShareLockKind";
	public final static String ShareHelpCount = "ShareHelpCount";
	public final static String MatchWinAward = "MatchWinAward";
	public final static String MatchLossAward = "MatchLossAward";
	public final static String MatchMasterAward = "MatchMasterAward";
	public final static String MatchLimitMinu = "MatchLimitMinu";
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDictKey() {
		return dictKey;
	}
	public void setDictKey(String dictKey) {
		this.dictKey = dictKey;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	@Override
	public String toString() {
		return "DictCfg [type=" + type + ", dictKey=" + dictKey + ", value=" + value + ", descr=" + descr + "]";
	}
}
