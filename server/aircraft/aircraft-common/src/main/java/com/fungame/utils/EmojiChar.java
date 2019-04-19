package com.fungame.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmojiChar {
	private static Logger logger = LoggerFactory.getLogger(EmojiChar.class);
	public static void main(String[] args) throws Exception {
		String content = "颲爱~傷痕";//"Chen陈\uD83D\uDC2E\uD83D\uDC2E\uD83D\uDC2E";//"颲爱~傷痕";//"CAO🎈3d🎈9a🎈";//
		System.out.println(content);

		int strLength = content.length();
		System.out.println(strLength);
		
		String filterContent = emojiURLEncoder(content);
		System.out.println("encoder "+filterContent);

		String emojiStr = emojiRecovery("[[EMOJI:%F0%9F%87%B8]][[EMOJI:%F0%9F%87%BA]][[EMOJI:%F0%9F%87%B3]][[EMOJI:%F0%9F%87%B3]][[EMOJI:%F0%9F%87%BE]]");
		System.out.println("decoder "+emojiStr);
		
		String replace = emojiReplace(content, "");
		System.out.println("replace "+replace);
	}
	public static String emojiReplace(String emoji, String replace) {
		if(emoji == null) return emoji;
		String patternString = "([\\x{10000}-\\x{10ffff}\ud800-\udfff])";
		Pattern pattern = Pattern.compile(patternString);
		Matcher matcher = pattern.matcher(emoji);
		StringBuffer sb = new StringBuffer();
		boolean found = false;
		while (matcher.find()) {
			found = true;
			matcher.appendReplacement(sb, replace);
		}
		if(found) {
			matcher.appendTail(sb);
			return sb.toString();
		}
		return emoji;
	}
	/**
	 * emoji表情转为url编码
	 * @param str
	 * @return
	 */
	public static String emojiURLEncoder(String emoji) {
		boolean found = false;
		StringBuffer sb = new StringBuffer();
		try {
			if(StringUtils.isBlank(emoji)) {
				return emoji;
			}
			String patternString = "([\\x{10000}-\\x{10ffff}\ud800-\udfff])";
			Pattern pattern = Pattern.compile(patternString);
			Matcher matcher = pattern.matcher(emoji);
			while (matcher.find()) {
				found = true;
				try {
					matcher.appendReplacement(sb, "[[EMOJI:" + URLEncoder.encode(matcher.group(1), "UTF-8") + "]]");
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
			if(found) {
				matcher.appendTail(sb);
				return sb.toString();
			}
		}
		finally {
//			logger.info(emoji+",found="+found+",rs="+(sb.toString()));
		}
		return emoji;
	}
	/**
	 * 把emoji表情转码后，还原
	 * @param str
	 * @return
	 */
	public static String emojiRecovery(String emoji) {
		if(StringUtils.isBlank(emoji)) {
			return emoji;
		}
		StringBuffer sb = new StringBuffer();
		boolean found = false;
		try {
			String patternString = "\\[\\[EMOJI:(.*?)\\]\\]";
			Pattern pattern = Pattern.compile(patternString);
			Matcher matcher = pattern.matcher(emoji);
			while (matcher.find()) {
				found = true;
				try {
					matcher.appendReplacement(sb, URLDecoder.decode(matcher.group(1), "UTF-8"));
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}
			if(found) {
				matcher.appendTail(sb);
				return sb.toString();
			}
		}
		finally {
//			logger.info(emoji+",found="+found+",rs="+(sb.toString()));
		}
		return emoji;
	}
}
