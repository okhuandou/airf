package com.fungame.utils.time;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.Minutes;
import org.joda.time.Seconds;

public class DateTimeUtils {
	public static final FastDateFormat ISO_DATETIME_FORMAT = DateFormatUtils.ISO_DATETIME_FORMAT;
	public static String dateTimeFormat(Date date) {
		if(date == null)return null;
		return ISO_DATETIME_FORMAT.format(date);
	}
	public static String dateTimeFormat(Calendar cal) {
		if(cal == null)return null;
		return ISO_DATETIME_FORMAT.format(cal);
	}
	/**
	 * "yyyy-MM-dd HH:mm:ss"格式字符串转为Date对象
	 * @param dateTime
	 * @return
	 */
	public static Date getDate(String dateTime) {
//		return org.joda.time.DateTime.parse(dateTime).toDate();
		try {
			
			return DateUtils.parseDate(dateTime, "yyyy-MM-dd HH:mm:ss");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	public static Date getDate(String dateTime, String format) {
//		return org.joda.time.DateTime.parse(dateTime).toDate();
		try {
			
			return DateUtils.parseDate(dateTime, format);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	public static Date addDays(Date date, int days) {
		if(days == 0) return date;
		return DateUtils.addDays(date, days);
	}
	public static Date addHours(Date date, int hours) {
		if(hours == 0) return date;
		return DateUtils.addHours(date, hours);
	}
	public static Date addMinutes(Date date, int minutes) {
		if(minutes == 0) return date;
		return DateUtils.addMinutes(date, minutes);
	}
	/**
	 * 日期时间之间的天数，不超24小时不算一天
	 * @param beforDate
	 * @param toDate
	 * @return
	 */
	public static int getDaysWith24Hours(Date beforDate, Date toDate) {
		DateTime beforDateTime = new DateTime(beforDate);
		DateTime toDateTime = new DateTime(toDate);
		return Days.daysBetween(beforDateTime, toDateTime).getDays();
	}
	/**
	 * 日期时间之间的分钟时间
	 * @param beforDate
	 * @param toDate
	 * @return
	 */
	public static int getMinutes(Date beforDate, Date toDate) {
		DateTime beforDateTime = new DateTime(beforDate);
		DateTime toDateTime = new DateTime(toDate);
		return Minutes.minutesBetween(beforDateTime, toDateTime).getMinutes();
	} 
	/**
	 * 日期时间之间的秒钟时间
	 * @param beforDate
	 * @param toDate
	 * @return
	 */
	public static int getSeconds(Date beforDate, Date toDate) {
		DateTime beforDateTime = new DateTime(beforDate);
		DateTime toDateTime = new DateTime(toDate);
		return Seconds.secondsBetween(beforDateTime, toDateTime).getSeconds();
	}
	/**
	 * 根据指定的unix_time得到当天最后一秒的时间戳
	 * @return
	 */
	public static long getDayEndTime(long systime) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(systime);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		return cal.getTimeInMillis();
	}
	/**
	 * 根据指定的unix_time得到当天第一秒的时间戳
	 * @return
	 */
	public static long getDayStartTime(long systime) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(systime);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTimeInMillis();
	}
	public static Date getDayStartTime(Date date) {
		return new Date(getDayStartTime(date.getTime()));
	}
	public static Date getDayEndTime(Date date) {
		return new Date(getDayEndTime(date.getTime()));
	}
	public static long getMonthStartTime(long systime) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(systime);
		cal.set(Calendar.DAY_OF_MONTH, 1);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTimeInMillis();
	}
	public static long getMonthEndTime(long systime) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(systime);
		cal.set(Calendar.MONTH, cal.get(Calendar.MONTH) + 1);
		cal.set(Calendar.DAY_OF_MONTH, 1);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		return cal.getTimeInMillis() - 24*60*60*1000;
	}
	public static Date getMonthStartTime(Date date) {
		return new Date(getMonthStartTime(date.getTime()));
	}
	public static Date getMonthEndTime(Date date) {
		return new Date(getMonthEndTime(date.getTime()));
	}
	/**
	 * 根据指定的unix_time得到这小时最后一秒的时间戳
	 * @return
	 */
	public static long getHourEndTime(long systime) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(systime);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		return cal.getTimeInMillis();
	}

	public static String dateToString(Date date, String format){
		if(format == null) {
			format = "yyyy-MM-dd HH:mm:ss";
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}
	public static String dateToString(Date date){
		return dateToString(date, "yyyy-MM-dd HH:mm:ss");
	}
	public static boolean isSameDay(Date date, Date other) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH);
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		calendar.setTime(other);
		int otherYear = calendar.get(Calendar.YEAR);
		int otherMonth = calendar.get(Calendar.MONTH);
		int otherDay = calendar.get(Calendar.DAY_OF_MONTH);
		return year == otherYear && month == otherMonth && day == otherDay;
	}
	public static void main(String[]args) {
		Date fromDate = new Date();
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.HOUR, 6);
		Date toDate = cal.getTime();//addDays(new Date(), 1);
		System.out.println(getDaysWith24Hours(fromDate, toDate));
		
		String dateTime = "2016-09-12 09:09:09";
		Date d = DateTimeUtils.getDate(dateTime);
		System.out.println(dateTimeFormat(d));
		
		Date startDate = DateTimeUtils.getDate("2018-04-29 00:00:00","yyyy-MM-dd HH:mm:ss");
		Date endDate = DateTimeUtils.getDate("2018-05-04 00:00:00","yyyy-MM-dd HH:mm:ss");
		int days = DateTimeUtils.getDaysWith24Hours(startDate, endDate);
		System.err.println(days);
	}
}
