package com.fungame.aircraft.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.ctrl.vo.UserItemVO;
import com.fungame.aircraft.dao.entity.UserItem;
import com.fungame.aircraft.service.UserItemService;
import com.fungame.core.cache.CacheException;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.mapper.BeanMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;

@RestController
@RequestMapping(value="/item")
@Api(tags = "item", description="item")
public class UserItemCtrl {

	@Autowired
	UserItemService userItemService;
	
	@RequestMapping(value = "/list", method= {RequestMethod.POST,RequestMethod.GET})
	@ApiOperation( value = "", response = UserItemVO.class, responseContainer="List", notes = "" )
	@ApiResponse(response=UserItemVO.class,code=200,message="success")
	public ResponseResult list(
			SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws CacheException {
		
		int userId = (int) sessionVals.getUid();
		List<UserItem> list = this.userItemService.getItems(userId);
		return new ResponseResult(list!=null?BeanMapper.mapList(list, UserItemVO.class):null);
	}
}
