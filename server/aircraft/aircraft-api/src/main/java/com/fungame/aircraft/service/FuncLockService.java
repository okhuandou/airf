package com.fungame.aircraft.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.cfg.ShareLockDao;
import com.fungame.aircraft.dao.cfg.ShareLockFuncDao;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.entity.ShareLock;
import com.fungame.aircraft.dao.entity.ShareLockFunc;
import com.fungame.utils.ip_local_store.IPZone;
import com.fungame.utils.ip_local_store.QQWry;
@Service
public class FuncLockService {
	@Autowired
	ShareLockDao shareLockDao;
	@Autowired
	ShareLockFuncDao shareLockFuncDao;
	@Autowired
	DictCfgDao dictCfgDao;
	QQWry qqwry;
	
	@PostConstruct
	public void init() throws IOException {
		qqwry = new QQWry();
	}

	private int convert2MyWeekDay(int weekDay) {
		if(weekDay == 1) return 7;
		return weekDay - 1;
	}
	public boolean isBlackRegion(String ip) {
		IPZone zone = this.qqwry.findIP(ip);
		if(zone != null) {
			JSONArray regions = this.dictCfgDao.jsonArrayValue("BlackRegions", "[]");
			for(int i=0; i<regions.size(); i++) {
				String rg = regions.getString(i);
				if(zone.getMainInfo().contains(rg) || rg.contains(zone.getMainInfo())) {
					return true;
				}
			}
		}
		return false;
	}
	public List<ShareLockFunc> getShareCfgs(String ip, String ver) {
		String shenheVer = this.dictCfgDao.value(DictCfg.ShenheVer);
		int shareLock = 0;
		if(StringUtils.isNotBlank(shenheVer) && shenheVer.equals(ver)) {
			shareLock = this.dictCfgDao.intValue(DictCfg.ShenheShareLockKind, 4);
		}
		else shareLock = this.dictCfgDao.intValue(DictCfg.ShareLockKind, 3);
		Calendar cal = Calendar.getInstance();
		int nowWeekDay = convert2MyWeekDay(cal.get(Calendar.DAY_OF_WEEK));
		int nowHour = cal.get(Calendar.HOUR_OF_DAY);
		boolean isBlackRegion = this.isBlackRegion(ip);
		List<ShareLockFunc> funcs = new ArrayList<>();
		List<ShareLock> locks = this.shareLockDao.selectAll();
		for(ShareLock elem: locks) {
			if(elem.getLockKind() == shareLock) {
				int weekDayStart = elem.getWeekStart();
				int weekDayEnd = elem.getWeekEnd();
				if(nowWeekDay >= weekDayStart && nowWeekDay <= weekDayEnd
						&& nowHour >= elem.getTimeStart() && nowHour <= elem.getTimeEnd()) {
					
					if(isBlackRegion && "black".equalsIgnoreCase(elem.getRegionType())) {
						funcs = shareLockFuncDao.selectAll(elem.getId());
					}
					else if( ! isBlackRegion && "white".equalsIgnoreCase(elem.getRegionType())) {
						funcs = shareLockFuncDao.selectAll(elem.getId());
					}
				}
			}
		}
		return funcs;
	}
}
