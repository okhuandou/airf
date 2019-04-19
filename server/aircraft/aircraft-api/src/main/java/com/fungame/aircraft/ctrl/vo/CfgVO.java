package com.fungame.aircraft.ctrl.vo;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class CfgVO {
	@ApiModelProperty(value="分享/视频功能开关配置")
	List<ShareLockFuncVO> shares;
	@ApiModelProperty(value="更多游戏url")
	List<String> urls;
	@ApiModelProperty(value="精选游戏跳转")
	List<String> nav;
	@ApiModelProperty(value="精选游戏跳转2")
	List<String> nav2;
	@ApiModelProperty(value="精选游戏名称")
	List<String> navName;
	@ApiModelProperty(value="精选游戏轮播")
	List<String> cgnav;
	public List<ShareLockFuncVO> getShares() {
		return shares;
	}
	public void setShares(List<ShareLockFuncVO> shares) {
		this.shares = shares;
	}
	public List<String> getUrls() {
		return urls;
	}
	public void setUrls(List<String> urls) {
		this.urls = urls;
	}
	public List<String> getNav() {
		return nav;
	}
	public void setNav(List<String> nav) {
		this.nav = nav;
	}
	public List<String> getNav2() {
		return nav2;
	}
	public void setNav2(List<String> nav2) {
		this.nav2 = nav2;
	}
	public List<String> getNavName() {
		return navName;
	}
	public void setNavName(List<String> navName) {
		this.navName = navName;
	}
	public List<String> getCgnav() {
		return cgnav;
	}
	public void setCgnav(List<String> cgnav) {
		this.cgnav = cgnav;
	}
}
