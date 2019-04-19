package com.fungame.core.cache.codec;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
/**
 * java对象/java对象流，序列化/反序列化
 * @author peter.lim林炳忠
 *
 */
public class JAVACodec extends AbstractCodec {	
	@SuppressWarnings("unchecked")
	@Override
	protected <T> T decodeImpl(byte[] bytes, Class<T> valueType) {
		Serializable t = null;
	    try {
	    	ObjectInputStream oin = new ObjectInputStream(new ByteArrayInputStream(bytes));
	    	t = (Serializable) oin.readObject();
	    	return (T) t;
	    }
	    catch (IOException e) {
	      throw new RuntimeException("Error decoding byte[] data to instantiate java object - data at key may not have been of this type or even an object", e);
	    }
	    catch (ClassNotFoundException e) {
	    	throw new RuntimeException("Error decoding byte[] data to instantiate java object - data at key may not have been of this type or even an object", e);
	    }
	    catch (ClassCastException e) {
	    	throw new RuntimeException("Error decoding byte[] data to instantiate java object - data at key may not have been of this type or even an object", e);
	    }
	}
	@Override
	protected byte[] encodeImpl(Object obj) {
		byte[] bytes = null;
    	ByteArrayOutputStream bout = null;
		ObjectOutputStream out = null;
	    try {
	    	bout = new ByteArrayOutputStream();
    		out = new ObjectOutputStream(bout);
    		out.writeObject(obj);
    		bytes = bout.toByteArray();
	    }
	    catch (IOException e) {
	    	e.printStackTrace();
	    	throw new RuntimeException("Error serializing object" + obj + " => " + e);
	    }
		finally {
    		try {
				out.close();
			} catch (IOException e) {
			}
    		try {
				bout.close();
			} catch (IOException e) {
			}
		}
	    return bytes;
	}
}
