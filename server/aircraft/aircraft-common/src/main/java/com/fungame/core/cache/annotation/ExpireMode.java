package com.fungame.core.cache.annotation;

import java.util.Date;

import com.fungame.utils.time.Clock;
import com.fungame.utils.time.DateTimeUtils;

/**
 * 过期时间模式
 * @author 林炳忠
 *
 */
public enum ExpireMode {
	/**空,按expire字段指定的秒数算*/
	Non,
	/**按天，也就是到最后一天的23:59:59，字段expire表示天数，再加上随机数时间*/
	Daily,
	/**按时，也就是到最后小时的59:59，字段expire表示小时数，再加上随机数时间*/
	Hourly,
	/**按天，也就是到最后一天的23:59:59，字段expire表示天数*/
	DailyStrict,
	/**按时，也就是到最后小时的59:59，字段expire表示小时数*/
	HourlyStrict,
	;
	
	public int getExpire(int expire) {
		if(expire <= 0) return 0;
		long nowtime = Clock.DEFAULT.getCurrentTimeInMillis();
		switch(this) {
		case Daily:
			Date date = DateTimeUtils.addDays(new Date(nowtime), expire - 1);
			return (int)((DateTimeUtils.getDayEndTime(date.getTime()) - nowtime)/1000 + Math.random()*7200);
		case Hourly:
			date = DateTimeUtils.addHours(new Date(nowtime), expire - 1);
			return (int)((DateTimeUtils.getHourEndTime(date.getTime()) - nowtime)/1000 + Math.random()*1800);
		case DailyStrict:
			date = DateTimeUtils.addDays(new Date(nowtime), expire - 1);
			return (int)((DateTimeUtils.getDayEndTime(date.getTime()) - nowtime)/1000);
		case HourlyStrict:
			date = DateTimeUtils.addHours(new Date(nowtime), expire - 1);
			return (int)((DateTimeUtils.getHourEndTime(date.getTime()) - nowtime)/1000);
		default:
		case Non:
			break;
		}
		return expire;
	}
}
