package com.fungame.core.cache.codec;

import java.io.IOException;

import org.msgpack.jackson.dataformat.MessagePackFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
/**
 * messagepack/java对象编解码器
 * @author peter.lim林炳忠
 */
public class MsgpackCodec extends AbstractCodec{
	ObjectMapper objectMapper = new ObjectMapper(new MessagePackFactory());

	@Override
	protected <T> T decodeImpl(byte[] bytes, Class<T> valueType) {
		try {
			T obj = objectMapper.readValue(bytes, valueType);
			return obj;
		} catch (IOException e) {
			throw new RuntimeException("Error msgpack object " + valueType, e);
		}
	}

	@Override
	protected byte[] encodeImpl(Object obj) {
		try {
			byte[] bytes = objectMapper.writeValueAsBytes(obj);
			return bytes;
		} catch (IOException e) {
			throw new RuntimeException("Error msgpack object " + obj.getClass(), e);
		}
	}
//	public static void main(String []args) {
//		MsgpackCodec codec = new MsgpackCodec();
//		byte[]bs=codec.encodeImpl(new Test(1,"abc"));
//		Test test = codec.decode(bs, Test.class);
//		System.out.println(test.getName());
//	}
//	public static class Test {
//		private int id;
//		private String name;
//		public Test() {
//			super();
//		}
//		public Test(int id, String name) {
//			super();
//			this.id = id;
//			this.name = name;
//		}
//		public int getId() {
//			return id;
//		}
//		public void setId(int id) {
//			this.id = id;
//		}
//		public String getName() {
//			return name;
//		}
//		public void setName(String name) {
//			this.name = name;
//		}
//	}
}
