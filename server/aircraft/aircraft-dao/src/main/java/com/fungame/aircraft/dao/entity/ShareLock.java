package com.fungame.aircraft.dao.entity;

public class ShareLock {
	private int id;
	private int lockKind;
	private String regionType;
	private String name;
	private String descr;
	private int weekStart;
	private int weekEnd;
	private int timeStart;
	private int timeEnd;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getLockKind() {
		return lockKind;
	}
	public void setLockKind(int lockKind) {
		this.lockKind = lockKind;
	}
	public String getRegionType() {
		return regionType;
	}
	public void setRegionType(String regionType) {
		this.regionType = regionType;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	public int getWeekStart() {
		return weekStart;
	}
	public void setWeekStart(int weekStart) {
		this.weekStart = weekStart;
	}
	public int getWeekEnd() {
		return weekEnd;
	}
	public void setWeekEnd(int weekEnd) {
		this.weekEnd = weekEnd;
	}
	public int getTimeStart() {
		return timeStart;
	}
	public void setTimeStart(int timeStart) {
		this.timeStart = timeStart;
	}
	public int getTimeEnd() {
		return timeEnd;
	}
	public void setTimeEnd(int timeEnd) {
		this.timeEnd = timeEnd;
	}
}
