package com.fungame.core.cache.codec;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import redis.clients.util.SafeEncoder;
/**
 * java对象序列化抽象封装
 * @author peter.lim林炳忠
 *
 */
public abstract class AbstractCodec {
	public static final String SUPPORTED_CHARSET_NAME = "UTF-8";
	public <KT, VT> Map<KT, VT> decode(Map<byte[], byte[]> byteMap, Class<KT> keyType, Class<VT> valueType) {
		Map<KT, VT> map = new HashMap<KT, VT>();
		
		for(byte kBytes[]: byteMap.keySet()) {
			byte vBytes[] = byteMap.get(kBytes);
			KT kObj = decode(kBytes, keyType);
			VT vObj = decode(vBytes, valueType);
			map.put(kObj, vObj);
		}
		
		return map;
	}
		
	public <T> List<T> decode(Collection<byte[]> byteList, Class<T> valueType) {
		List<T> retList = new ArrayList<T>();
		for(byte[] bytes: byteList) {
			T obj = decode(bytes, valueType);
			retList.add(obj);
		}
		return retList;
	}
	
	public static final String toString(byte[] bytes) {
		if(bytes == null) {
			return null;
		}
		String str = SafeEncoder.encode(bytes);
	    return str;
	}
	
	@SuppressWarnings("unchecked")
	public <T> T decode(byte[] bytes, Class<T> valueType) {
		if(bytes == null) return null;
		String str = toString(bytes);
		if(valueType == String.class) {
			return (T) str;
		}
		else if(valueType == Byte.class || valueType == byte.class) {
			return (T) Byte.valueOf(str);
		}
		else if(valueType == Character.class || valueType == char.class) {
			return (T) Boolean.valueOf(str);
		}
		else if(valueType == Boolean.class || valueType == boolean.class) {
			return (T) Boolean.valueOf(str);
		}
		else if(valueType == Short.class || valueType == short.class) {
			return (T) Short.valueOf(str);
		}
		else if(valueType == Integer.class || valueType == int.class) {
			return (T) Integer.valueOf(str);
		}
		else if(valueType == Float.class || valueType == float.class) {
			return (T) Float.valueOf(str);
		}
		else if(valueType == Long.class || valueType == long.class) {
			return (T) Long.valueOf(str);
		}
		else if(valueType == Double.class || valueType == double.class) {
			return (T) Double.valueOf(str);
		}
		else if(valueType == Date.class) {
			return (T) new Date(Long.valueOf(str));
		}
		T obj = decodeImpl(bytes, valueType);
		return obj;
	}
	
	public byte[] encode(Object obj) {
		if(obj == null) {
			return null;
		}
		if(obj instanceof String) {
			try {
				return SafeEncoder.encode((String)obj);
			} catch (Exception e) {
				return ((String) obj).getBytes();
			}
		}
		if(obj instanceof Byte
				|| obj instanceof Character
				|| obj instanceof Boolean
				|| obj instanceof Short
				|| obj instanceof Integer
				|| obj instanceof Float
				|| obj instanceof Long
				|| obj instanceof Double) {
			String str = obj+"";
			try {
				return SafeEncoder.encode(str);
			} catch (Exception e) {
				return ((String) obj).getBytes();
			}
		}
		if(obj instanceof Date) {
			return SafeEncoder.encode(String.valueOf(((Date) obj).getTime()));
		}
		byte bytes[] = encodeImpl(obj);
		return bytes;
	}
	protected abstract <T> T decodeImpl(byte[] bytes, Class<T> valueType);
	protected abstract byte[] encodeImpl(Object obj);
}
