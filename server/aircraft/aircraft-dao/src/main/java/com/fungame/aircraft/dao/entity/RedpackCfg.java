package com.fungame.aircraft.dao.entity;

public class RedpackCfg {
	private int id;
	private double min;
	private double max;
	private int type;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public double getMin() {
		return min;
	}
	public void setMin(double min) {
		this.min = min;
	}
	public double getMax() {
		return max;
	}
	public void setMax(double max) {
		this.max = max;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "RedpackCfg [id=" + id + ", min=" + min + ", max=" + max + ", type=" + type + "]";
	}
	
}
