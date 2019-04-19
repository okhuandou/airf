package com.fungame.utils.mapper;

import java.util.Date;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alibaba.fastjson.serializer.SimpleDateFormatSerializer;

/**
 * 实现JSON String<->Java Object的Mapper.
 * 封装不同的输出风格, 使用不同的builder函数创建实例.
 * @author peter.lim林炳忠
 *
 */
public class JSONMapper {
	private static SerializeConfig mapping = new SerializeConfig();
	private static ParserConfig parserConfig = new ParserConfig();
	static {
	    String dateFormat = "yyyy-MM-dd HH:mm:ss";
	    mapping.put(Date.class, new SimpleDateFormatSerializer(dateFormat));
//		parserConfig.putDeserializer(Date.class, MyDateCodec.instance);
	}
	public static <T> T toJavaBean(String json, Class<T> valueType) {
		return JSONObject.parseObject(json, valueType, parserConfig, JSON.DEFAULT_PARSER_FEATURE);
	}
	public static <T> T toJavaBean(JSONObject json, Class<T> valueType) {
		return toJavaBean(json.toJSONString(), valueType);
	}
	
	public static String toJSONString(Object object) {
		return JSON.toJSONString(object, mapping);
	}
	
	public static JSONObject toJSONObject(Object object) {
		return (JSONObject) JSONObject.toJSON(object);
	}
	
	public static JSONObject toJSONObject(String json) {
		return JSON.parseObject(json);
	}
	
	public static JSONArray toJSONArray(String json) {
		return JSON.parseArray(json);
	}
	public static JSONArray toJSONArray(Object object) {
		return (JSONArray) JSON.toJSON(object);
	}
//	public static class Test {
//		Date date;
//
//		public Date getDate() {
//			return date;
//		}
//
//		public void setDate(Date date) {
//			this.date = date;
//		}
//
//		@Override
//		public String toString() {
//			return "Test [date=" + date + "]";
//		}
//		
//	}
//	public static void main(String args[]) {
//		JSONObject json = new JSONObject();
//		json.put("date", "2018-08-09-05:06:09");
//		json.put("message", "abc");
//		System.out.println(JSONMapper.toJavaBean(json.toJSONString(), Test.class));
//	}
}
