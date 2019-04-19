package com.fungame.aircraft.dao.cfg;

import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.mapper.DictCfgMapper;

@Repository
public class DictCfgDao extends BaseLocalCacheDao<String, DictCfg> {
	@Autowired
	private DictCfgMapper mapper;

	@PostConstruct
	public void init() {
		this.load("");
	}
	
	@Override
	public DictCfg load(String key) {
		List<DictCfg> list = this.mapper.selectAll();
		list.forEach(elem->{
			super.getCache().put(elem.getDictKey(), elem);
		});
		return super.getCache().getIfPresent(key);
	}
	
	public String value(String key) {
		DictCfg dict = this.get(key);
		if(dict != null) {
			return dict.getValue();
		}
		return null;
	}
	
	public <VT> VT value(String key, Class<VT> valueType) {
		DictCfg dict = this.get(key);
		if(dict != null) {
			return JSONObject.parseObject(dict.getValue(), valueType);
		}
		return null;
	}
	
	public int intValue(String key, int defaultVal) {
		String val = this.value(key);
		return NumberUtils.toInt(val, defaultVal);
	}
	
	public double doubleValue(String key, double defaultVal) {
		String val = this.value(key);
		return NumberUtils.toDouble(val, defaultVal);
	}
	
	public JSONArray jsonArrayValue(String key, String defaultVal) {
		String val = this.value(key);
		JSONArray arr = null;
		if(StringUtils.isNotBlank(val)) {
			arr = JSONArray.parseArray(val);
		}
		if(arr == null) {
			arr = JSONArray.parseArray(defaultVal);
		}
		return arr;
	}
	
	public <VT> List<VT>  listValue(String key, String defaultVal, Class<VT> valueType) {
		String val = this.value(key);
		List<VT> list = null;
		if(StringUtils.isNotBlank(val)) {
			list = JSONArray.parseArray(val, valueType);
		}
		if(list == null) {
			list = JSONArray.parseArray(defaultVal, valueType);
		}
		return list;
	}
	
	public JSONObject jsonValue(String key, String defaultVal) {
		String val = this.value(key);
		JSONObject json = JSONObject.parseObject(val);
		if(json == null) {
			json = JSONObject.parseObject(defaultVal);
		}
		return json;
	}
	
	public void update(String key, String value) {
		this.mapper.update("sys", key, value);
		
		DictCfg dict = this.get(key);
		if(dict != null) {
			dict.setValue(value);
		}
	}
}
