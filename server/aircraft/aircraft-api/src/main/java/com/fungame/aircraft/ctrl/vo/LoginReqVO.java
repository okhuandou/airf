package com.fungame.aircraft.ctrl.vo;

public class LoginReqVO {
	private String code;
	private String name;
	private String img;
	private String pf;//设备平台
	private String model;//设备类型
	private String fromAppId;
	private int fromUserId;
	private String fromType;
	private String osType;
	
	
	public String getOsType() {
		if(osType==null){
			return "wx";
		}
		return osType;
	}

	public void setOsType(String osType) {
		this.osType = osType;
	}

	public LoginReqVO() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public String getPf() {
		return pf;
	}

	public void setPf(String pf) {
		this.pf = pf;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getFromAppId() {
		return fromAppId;
	}

	public void setFromAppId(String fromAppId) {
		this.fromAppId = fromAppId;
	}

	public int getFromUserId() {
		return fromUserId;
	}

	public void setFromUserId(int fromUserId) {
		this.fromUserId = fromUserId;
	}

	public String getFromType() {
		return fromType;
	}

	public void setFromType(String fromType) {
		this.fromType = fromType;
	}

	@Override
	public String toString() {
		return "LoginReqVO [code=" + code + ", name=" + name + ", img=" + img + ", pf=" + pf + ", model=" + model
				+ ", fromAppId=" + fromAppId + ", fromUserId=" + fromUserId + ", fromType=" + fromType + "]";
	}
}
