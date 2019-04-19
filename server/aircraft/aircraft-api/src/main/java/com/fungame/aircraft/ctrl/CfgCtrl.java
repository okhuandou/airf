package com.fungame.aircraft.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.ctrl.vo.CfgVO;
import com.fungame.aircraft.ctrl.vo.ShareLockFuncVO;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.entity.ShareLockFunc;
import com.fungame.aircraft.service.FuncLockService;
import com.fungame.core.web.ResponseResult;
import com.fungame.utils.IpHelper;
import com.fungame.utils.mapper.BeanMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;

@RestController
@RequestMapping(value="/cfgs")
@Api(tags = "cfgs", description="cfgs")
public class CfgCtrl {
	@Autowired
	FuncLockService funcLockService;
	@Autowired
	DictCfgDao dictCfgDao;

	@RequestMapping(value="", method=RequestMethod.GET)
	@ApiResponse(response=CfgVO.class, code = 0, message = "")
    public ResponseResult cfgs(
    		@RequestParam(value="ver", name="ver", required=false)String ver,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		String ip = IpHelper.getIpAddr(request);
		List<ShareLockFunc> funcs = this.funcLockService.getShareCfgs(ip, ver);
		List<ShareLockFuncVO> shares = BeanMapper.mapList(funcs, ShareLockFuncVO.class);
		CfgVO vo = new CfgVO();
		vo.setShares(shares);
		vo.setNav(dictCfgDao.listValue("navOther", "[]", String.class));
		vo.setUrls(dictCfgDao.listValue("moreGamesUrls", "[]", String.class));
		vo.setNav2(dictCfgDao.listValue("navOther2", "[]", String.class));
		vo.setNavName(dictCfgDao.listValue("navName", "[]", String.class));
		vo.setCgnav(dictCfgDao.listValue("cgnav", "[]", String.class));
		return new ResponseResult(vo);
	}
}
