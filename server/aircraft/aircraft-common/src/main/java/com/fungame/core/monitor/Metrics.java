package com.fungame.core.monitor;

import java.util.concurrent.TimeUnit;

import org.slf4j.LoggerFactory;

import com.codahale.metrics.Counter;
import com.codahale.metrics.Histogram;
import com.codahale.metrics.Meter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Slf4jReporter;
import com.codahale.metrics.Timer;

/**
 * 
 * @Description Metrics度量
 * @author peter.lin
 */
public class Metrics {
	private static MetricRegistry registry = new MetricRegistry();
	static {
		Metrics.init();
	}
	public static void init() {
		final Slf4jReporter reporter = Slf4jReporter.forRegistry(registry)
                .outputTo(LoggerFactory.getLogger("metricsLogger"))
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build();
		reporter.start(60, TimeUnit.SECONDS);
	}
	
	/**
	 * QPS计算器，每秒查询数（QPS）等等。这个指标能反应系统当前的吞吐能力
	 * @param name
	 * @param names
	 * @return
	 */
	public static Meter meter(String name, String ...names) {
		Meter meter = registry.meter(MetricRegistry.name(name, names));
		meter.mark();
		return meter;
	}
	/**
	 * 累计记数
	 * @param name
	 * @return
	 */
	public static Counter counter(String name) {
		Counter counter = registry.counter(name);
		counter.inc();
		return counter;
	}
	/**
	 * Histogram可以为数据流提供统计数据。 除了最大值，最小值，平均值外，它还可以测量 中值(median)
	 * @param name
	 * @return
	 */
	public static Histogram histogram(String name) {
	    return registry.histogram(name);
	}
	/**
	 * Timer用来测量一段代码被调用的速率和用时。 等于Meter+Hitogram，既算TPS，也算执行时间
	 * @param metrics
	 * @return
	 */
	public static Timer timer(String name) {
	    return registry.timer(name);
	}
}
