package com.fungame.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 
 * @Description 是否在指定ip范围之内
 * @author peter.lin
 */
public class IPRanges {
	private static Logger logger = LoggerFactory.getLogger(IPRanges.class);
	private static IPRanges ipRanges = null;
	private static Set<Range> ranges = new HashSet<>();
	private boolean isInit = false;
	public static IPRanges getInstance() {
		if(ipRanges == null) {
			ipRanges = new IPRanges();
		}
		return ipRanges;
	}
	public void init() {
		if(isInit) return;
		BufferedReader reader = null;
		InputStreamReader inputStream = null;
		FileInputStream fileInputStream = null;
		try {
			String path = getFileAbsolutePathSafely("ip-zh.txt");
			fileInputStream = new FileInputStream(new File(path));
			inputStream = new InputStreamReader(fileInputStream);
			reader = new BufferedReader(inputStream);
			String str = null;
			while((str = reader.readLine()) != null){
				try {
					if(StringUtils.isBlank(str)) continue;
					String infos [] = str.split("\\s");
					long start = ipToLong(infos[0]);
					long end = ipToLong(infos[1]);
					Range rg = new Range();
					rg.start = start;
					rg.end = end;
					ranges.add(rg);
				}
				catch (Exception e) {
					logger.error(str + Arrays.toString(str.split("\\s")), e);
					throw e;
				}
			}
			isInit = true;
			logger.info(path+" init success, and got size " + ranges.size());
		} catch (FileNotFoundException e) {
			logger.error(null, e);
		} catch (IOException e) {
			logger.error(null, e);
		}
		finally{
			try {
				if(fileInputStream != null) fileInputStream.close();
				if(inputStream != null) inputStream.close();
				if(reader != null)reader.close();
			} catch (IOException e) {logger.error(null, e);}
		}
	}
	public static String getFileAbsolutePathSafely(String filename) throws FileNotFoundException {
		String dirPath = Thread.currentThread().getContextClassLoader().getResource("./").getPath();
		String filepath = dirPath + filename;
		File file = new File(filepath);
		if( ! file.exists()) {			
			dirPath = System.getProperty("user.dir")+"/";
			filepath = dirPath + filename;
			file = new File(filepath);
			if( ! file.exists()) throw new FileNotFoundException(filepath);
		}
		return filepath;
	}
    public static String longToIp(long ip) {  
        StringBuilder sb = new StringBuilder(15);  
        for (int i = 0; i < 4; i++) {  
            // 1. 2  
            // 2. 1  
            // 3. 168  
            // 4. 192  
            sb.insert(0, Long.toString(ip & 0xff));  
            if (i < 3) {  
                sb.insert(0, '.');  
            }  
            // 1. 192.168.1.2  
            // 2. 192.168.1  
            // 3. 192.168  
            // 4. 192  
            ip = ip >> 8;  
        }  
        return sb.toString();  
    }
    
    public static long ipToLong(String ipAddress) {  
        long result = 0;  
        try {
        	String[] ipAddressInArray = ipAddress.split("\\.");  
            for (int i = 3; i >= 0; i--) {  
                long ip = NumberUtils.toLong(ipAddressInArray[3 - i], 0);
                // left shifting 24,16,8,0 and bitwise OR  
                // 1. 192 << 24  
                // 1. 168 << 16  
                // 1. 1 << 8  
                // 1. 2 << 0  
                result |= ip << (i * 8);  
            }  
        }
        catch (Exception e) {
        	logger.error("ipAddress============"+ipAddress);
        	logger.error("ipAddress============"+Arrays.toString(ipAddress.split("\\.")));
        }
        return result;  
    }
	public static class Range {
		long start;
		long end;
		@Override
		public String toString() {
			return "Range [start=" + start + ", end=" + end + "]";
		}
		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + (int) (end ^ (end >>> 32));
			result = prime * result + (int) (start ^ (start >>> 32));
			return result;
		}
		@Override
		public boolean equals(Object obj) {
			if (this == obj) {
				return true;
			}
			if (obj == null) {
				return false;
			}
			if (!(obj instanceof Range)) {
				return false;
			}
			Range other = (Range) obj;
			if (end != other.end) {
				return false;
			}
			if (start != other.start) {
				return false;
			}
			return true;
		}
	}
	
	public boolean isInRange(String ip) {
		if( ! isInit) {
			this.init();
		}
		long ipLong = ipToLong(ip);
		for(Range rg: ranges) {
			if(rg.start <= ipLong && rg.end >= ipLong) {
				return true;
			}
		}
		return false;
	}
	
//	public static void main(String[]args) {
//		IPRanges ipRanges = new IPRanges();
//		ipRanges.init();
//		System.out.println(ipRanges.isInRange("223.25.192.1"));
//		System.out.println(ipRanges.isInRange("223.25.223.250"));
//		System.out.println("182.232.206.16="+ipRanges.isInRange("182.232.206.16"));
//		System.out.println("203.107.128.155="+ipRanges.isInRange("203.107.128.155"));
//		//深圳
//		System.out.println(ipRanges.isInRange("113.116.49.32"));
//		System.out.println(ipRanges.isInRange("39.108.148.181"));
//		System.out.println(ipRanges.isInRange("47.75.15.221"));
//		System.out.println(ipRanges.isInRange("127.0.0.1"));
//		System.out.println(ipRanges.isInRange("192.168.1.87"));
//		System.out.println(ipRanges.isInRange("128.1.39.34"));
//		System.out.println("===========");
//		System.out.println(IPRanges.getInstance().isInRange("128.1.39.34"));
//	}
}
