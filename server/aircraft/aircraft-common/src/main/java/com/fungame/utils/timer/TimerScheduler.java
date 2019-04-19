package com.fungame.utils.timer;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fungame.utils.thread.NamingThreadFactory;

public class TimerScheduler {
	private static Logger logger = LoggerFactory.getLogger(TimerScheduler.class);
	private static TimerScheduler instance = new TimerScheduler();
	private ScheduledExecutorService scheduler;
	private final CopyOnWriteArrayList<MyTimerTask> timerTasks = new CopyOnWriteArrayList<MyTimerTask>();
	private static class MyTimerTask {
		long delay;//单位毫秒
		long period;
		Runnable worker;
		long runCounter;
		long updatetime;
		boolean isOneTime = false; //是否是一次性的调度
		
		MyTimerTask(Runnable worker, long delay, long period) {
			this.worker = worker;
			this.delay = delay;
			this.period = period;
			this.runCounter = 0;
			this.updatetime = System.currentTimeMillis();
		}
		
		MyTimerTask(Runnable worker, long delay, long period, boolean isOneTime) {
			this(worker, delay, period);
			this.isOneTime = isOneTime;
		}
		@Override
		public String toString() {
			return "MyTimerTask [delay=" + delay + ", period=" + period
					+ ", worker=" + worker.getClass().getName() + ", runCounter=" + runCounter
					+ ", updatetime=" + updatetime + "]";
		}
	}
	private TimerScheduler(){
		scheduler = Executors.newScheduledThreadPool(2, new NamingThreadFactory("my-scheduler"));
		scheduler.scheduleWithFixedDelay(new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					long nowtime = System.currentTimeMillis();
					for(MyTimerTask task: timerTasks) {
						if(task.isOneTime && task.runCounter >=1){continue;}
						
						long t = nowtime - task.updatetime;
						long delay = 0L;
						if(task.runCounter == 0) {
							delay = t - task.delay;
						}
						else {
							delay = t - task.period; 
						}
						if(delay >= 0) {
							task.updatetime = nowtime;
							task.runCounter++;
							try {
								task.worker.run();
							}
							catch (Throwable e) {
								logger.error(null, e);
							}
							if(delay/1000 > 0) {
								logger.warn(task.toString() + " timer task delay seconds="+(delay/1000));
							}
							//一次性的  执行完一次就删除
							if(task.isOneTime){
								timerTasks.remove(task);
							}
						}
					}
				}
				catch (Throwable e) {
					logger.error(null, e);
				}
			}
		}), 1000, 1000, TimeUnit.MILLISECONDS);
	}
	
	public static TimerScheduler getInstance(){
		return instance;
	}
	/**
	 * 指定时分秒执行周期任务
	 * @param task
	 * @param period 0非周期任务
	 * @param hourOfDay
	 * @param minuteOfDay
	 * @param secondOfMinute
	 */
	public void addDailyTask(Runnable task, int hourOfDay, int minuteOfHour, int secondOfMinute){
		Calendar cal = Calendar.getInstance();
		long nowMillis = cal.getTimeInMillis();
		
		cal.set(Calendar.HOUR_OF_DAY, hourOfDay);
		cal.set(Calendar.MINUTE, minuteOfHour);
		cal.set(Calendar.SECOND, secondOfMinute);
		cal.set(Calendar.MILLISECOND, 0);
		long taskMillis = cal.getTimeInMillis();
		
		if(nowMillis > taskMillis) {//得等到第二天了
			cal.set(Calendar.DATE, cal.get(Calendar.DATE) + 1);
			taskMillis = cal.getTimeInMillis();
		}
		long delay = taskMillis - nowMillis;
		this.scheduler.scheduleWithFixedDelay(task, delay, 24*60*60*1000L, TimeUnit.MILLISECONDS);
//		MyTimerTask timer = new MyTimerTask(task, delay, 24*60*60*1000L);
//		this.timerTasks.add(timer);
	}
	
	public void addHourlyTask(Runnable task) {
		Date evenHour = TimerScheduler.getNextHourStartTime(new Date());
		Date date = new Date();
		this.addLoopTask(task, evenHour.getTime() - date.getTime() , 60*60*1000L);
	}
	/**
	 * 间隔多少时间后处理
	 * @param task
	 * @param delay
	 */
	public void doLater(Runnable task, long delay)
	{
		this.scheduler.schedule(task, delay, TimeUnit.MILLISECONDS);
	}
	
	public void addLoopTask(Runnable task, long delay, long period)
	{
		this.scheduler.scheduleWithFixedDelay(task, delay, period, TimeUnit.MILLISECONDS);
//		MyTimerTask timer = new MyTimerTask(task, delay, period);
//		this.timerTasks.add(timer);
	}
	
	public void addLoopTask(Runnable task, long delay, long period, boolean isOneTime)
	{
		this.scheduler.scheduleWithFixedDelay(task, delay, period, TimeUnit.MILLISECONDS);
//		MyTimerTask timer = new MyTimerTask(task, delay, period,isOneTime);
//		this.timerTasks.add(timer);
	}
	
	public static Date getNextHourStartTime(Date date) {
	    if (date == null) {
	      date = new Date();
	    }
	    
	    Calendar c = Calendar.getInstance();
	    c.setTime(date);
	    
	    c.set(Calendar.HOUR_OF_DAY, c.get(Calendar.HOUR_OF_DAY) + 1);
	    c.set(Calendar.MINUTE, 0);
	    c.set(Calendar.SECOND, 0);
	    c.set(Calendar.MILLISECOND, 0);
	    
	    return c.getTime();
	}
	
	public static void main(String[]args) {
		TimerScheduler.getInstance().addDailyTask(new Runnable() {
			@Override
			public void run() {
				System.out.println("hello, daily");
			}
		}, 21, 0, 0);
		TimerScheduler.getInstance().addLoopTask(new Runnable() {
			@Override
			public void run() {
				System.out.println("hello , test");
			}}, 3000, 3000);
		TimerScheduler.getInstance().addHourlyTask(new Runnable() {
			@Override
			public void run() {
				System.out.println("hello , hourly");
			}});
		while(true){
			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
			}
		}
	}
}
