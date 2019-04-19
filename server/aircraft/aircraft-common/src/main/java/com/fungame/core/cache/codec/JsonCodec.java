package com.fungame.core.cache.codec;

import com.fungame.utils.mapper.JSONMapper;

/**
 * java<->json,序列化/反序列化
 * @author peter.lim林炳忠
 *
 */
public class JsonCodec extends AbstractCodec {
	JSONMapper jsonMapper = new JSONMapper();
	@Override
	protected <T> T decodeImpl(byte[] bytes, Class<T> valueType) {
		T rs = jsonMapper.toJavaBean(toString(bytes), valueType);
		return rs;
	}

	@Override
	protected byte[] encodeImpl(Object obj) {
		String json = jsonMapper.toJSONString(obj);
		return json.getBytes();
	}
	
}
