package com.fungame.aircraft.event;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Param;
import org.apache.rocketmq.common.message.MessageExt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSONObject;

public abstract class IEventListener {
	private Logger logger = LoggerFactory.getLogger(IEventListener.class);
	@Autowired
	private EventServiceFactory factory;

    public void onMessage(MessageExt messageExt) throws Exception {
    	String tag = messageExt.getTags();
    	String body = new String(messageExt.getBody());
    	JSONObject json = JSONObject.parseObject(body);
    	this.event(tag, json);
    }
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void event(String tag, JSONObject body) throws Exception {
    	logger.info("tag={},body={}", tag, body);
    	String type = tag;
    	String subtype = null;
    	int tagDelimiterIdx = tag.indexOf('.');
    	if(tagDelimiterIdx >= 0) {
    		type = tag.substring(0, tagDelimiterIdx);
    		subtype = tag.substring(tagDelimiterIdx+1);
    	}
		IEventService service = this.factory.getService(type);
		if(StringUtils.isEmpty(subtype)) {
			Class<?> dataType = this.getDataType(service);
			Object data = this.converData(dataType, body);
			service.execute(data);
		}
		else {
			Method[] methods = service.getClass().getMethods();
			boolean flag = false;
			for(Method method: methods) {
				if(method.getName().equalsIgnoreCase(subtype)) {
					Parameter params[] = method.getParameters();
					if(params.length == 1 && ! isBasicType(params[0].getType())) {											
						Class<?> dataType = method.getParameterTypes()[0];
						Object data = this.converData(dataType, body);
						method.invoke(service, data);
					}
					else {
						Object paramVals[] = new Object[params.length];
						for(int i=0; i<params.length; i++) {
							Parameter param = params[i];
							Param paramAnnot = param.getAnnotation(Param.class);
							if(paramAnnot != null && StringUtils.isNotBlank(paramAnnot.value())) {						
								Object val = body.getObject(paramAnnot.value(), param.getType());
								paramVals[i] = val;
							}
							else {
								throw new NullPointerException("must be add a annotation for the parameters of the method " + method.getName());
							}
						}
						method.invoke(service, paramVals);
					}
					flag = true;
					break;
				}
			}
			if(flag == false) {
				throw new NullPointerException("can not find the "+tag);
			}
		}
	}
    private boolean isBasicType(Class<?> clazz) {
    	return clazz == byte.class || clazz == char.class || clazz == short.class || clazz == int.class 
    			|| clazz == long.class || clazz == float.class || clazz == double.class
    			|| clazz == Byte.class || clazz == Character.class || clazz == Short.class || clazz == Integer.class 
    	    	|| clazz == Long.class || clazz == Float.class || clazz == Double.class;
    }
    public Object converData(Class<?> dataType, JSONObject body) {
    	Object data = null;
    	if(dataType == Object.class || dataType == JSONObject.class) {
			data = body;
		}
		else {
			data = JSONObject.toJavaObject(body, dataType);
		}
    	return data;
    }
	@SuppressWarnings("rawtypes")
	public Class getDataType(IEventService service) {
        Class clazz = null;
        clazz = (Class)((ParameterizedType)service.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        return clazz;
	}
}
