package com.fungame.aircraft.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fungame.AppException;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.service.AppError;
import com.fungame.core.web.ResponseResult;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/backdoor")
@Api(tags = "backdoor", description="backdoor")
public class BackDoorCtrl {
	@Autowired
	DictCfgDao dictCfgDao;
	
	private void checkBackDoorKey(String backDoorKey) throws AppException {
		if( ! "budding-tech-com".equals(backDoorKey)) {
			throw new AppException(AppError.e401);
		}
	}
	
	@RequestMapping(value="/dict/update", method= RequestMethod.GET)
    public ResponseResult dictUpdate(
    		@RequestParam(value="backDoorKey", required=true) String backDoorKey,
    		@RequestParam(value="key", required=true) String key,
    		@RequestParam(value="val", required=true) String val,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		this.checkBackDoorKey(backDoorKey);
		this.dictCfgDao.update(key, val);
        return new ResponseResult();
	}
	
	@RequestMapping(value="/dict/get", method= RequestMethod.GET)
    public ResponseResult dictGet(
    		@RequestParam(value="backDoorKey", required=true) String backDoorKey,
    		@RequestParam(value="key", required=true) String key,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		this.checkBackDoorKey(backDoorKey);
        return new ResponseResult(new JSONObject().fluentPut("val", this.dictCfgDao.value(key)));
	}
}
