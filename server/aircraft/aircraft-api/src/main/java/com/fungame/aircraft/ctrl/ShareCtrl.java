package com.fungame.aircraft.ctrl;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.fungame.aircraft.core.lock.Lock;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO;
import com.fungame.aircraft.ctrl.vo.ShareAwardBeOpenedVO;
import com.fungame.aircraft.ctrl.vo.ShareLockFuncVO;
import com.fungame.aircraft.ctrl.vo.UserShareAwardVO;
import com.fungame.aircraft.ctrl.vo.UserShareHelpRecvVO;
import com.fungame.aircraft.ctrl.vo.UserShareHelpVO;
import com.fungame.aircraft.ctrl.vo.UserShareNewVO;
import com.fungame.aircraft.dao.entity.ShareLockFunc;
import com.fungame.aircraft.service.FuncLockService;
import com.fungame.aircraft.service.ShareHelpService;
import com.fungame.aircraft.service.ShareService;
import com.fungame.aircraft.service.UserService;
import com.fungame.aircraft.service.dto.UserShareAwardDTO;
import com.fungame.aircraft.service.dto.UserShareHelpDTO;
import com.fungame.aircraft.service.dto.UserShareNewDTO;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionAuthHelper;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.IpHelper;
import com.fungame.utils.mapper.BeanMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value="/share")
@Api(tags = "share", description="share")
public class ShareCtrl {
	@Autowired
	ShareService shareService;
	@Autowired
	ShareHelpService shareHelpService;
	@Autowired
	UserService userService;
	@Autowired
	FuncLockService funcLockService;
	
	@RequestMapping(value="/award/be-opened", method=RequestMethod.POST)
    public ResponseResult beOpened(
    		SessionVals sessionVals,
    		@RequestBody ShareAwardBeOpenedVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		String fromKey = vo.getFromKey();
		String friendName = vo.getName();
		String friendHeadimg = vo.getHeadimg();
		int fromUserId = vo.getFromUserId();
		if(fromUserId <= 0) {
			fromUserId = (int) SessionAuthHelper.decode(fromKey).getUid();
		}
		this.shareService.addAwardFriend(fromUserId, userId, friendName, friendHeadimg);
        return new ResponseResult();
	}
	
	@RequestMapping(value="/award/list-friends", method=RequestMethod.GET)
    public ResponseResult listFriends(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		List<UserShareAwardDTO> list = this.shareService.list(userId);
		List<UserShareAwardVO> voList = new ArrayList<>();
		if(list != null) {
			for(UserShareAwardDTO tmp: list) {
				UserShareAwardVO vo = BeanMapper.map(tmp, UserShareAwardVO.class);
				vo.setName(tmp.getFriendName());
				vo.setHeadimg(tmp.getFriendHeadimg());
				voList.add(vo);
			}
		}
        return new ResponseResult(voList);
	}
	
	@Lock()
	@RequestMapping(value="/award/{id}", method=RequestMethod.GET)
    public ResponseResult award(
    		SessionVals sessionVals,
    		@PathVariable(value = "id") int id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		int addCoin = this.shareService.updateAward(userId, id);
        return new ResponseResult(new JSONObject().fluentPut("addCoin", addCoin));
	}
	
	@RequestMapping(value="/cfgs", method=RequestMethod.GET)
    public ResponseResult cfgs(
    		@RequestParam(value="ver", name="ver", required=false)String ver,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		String ip = IpHelper.getIpAddr(request);
		List<ShareLockFunc> funcs = this.funcLockService.getShareCfgs(ip, ver);
		List<ShareLockFuncVO> vo = BeanMapper.mapList(funcs, ShareLockFuncVO.class);
		return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/help", method=RequestMethod.POST)
    public ResponseResult help(
    		SessionVals sessionVals,
    		@RequestBody ShareAwardBeOpenedVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = sessionVals == null? 0 : (int) sessionVals.getUid();
		String fromKey = vo.getFromKey();
		String friendName = vo.getName();
		String friendHeadimg = vo.getHeadimg();
		int fromUserId = (int) SessionAuthHelper.decode(fromKey).getUid();
		this.shareHelpService.addHelpFriend(fromUserId, userId, friendName, friendHeadimg);
		return new ResponseResult();
	}
	
	@RequestMapping(value="/help/list", method=RequestMethod.POST)
    public ResponseResult helpList(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		List<UserShareHelpDTO> list = this.shareHelpService.list(userId);
		List<UserShareHelpVO> voList = new ArrayList<>();
		if(list != null) {
			for(UserShareHelpDTO tmp: list) {
				UserShareHelpVO vo = BeanMapper.map(tmp, UserShareHelpVO.class);
				vo.setName(tmp.getFriendName());
				vo.setHeadimg(tmp.getFriendHeadimg());
				voList.add(vo);
			}
		}
        return new ResponseResult(voList);
	}
	
	@RequestMapping(value="/help/recv/{id}", method=RequestMethod.GET)
    public ResponseResult helpRecv(
    		SessionVals sessionVals,
    		@PathVariable(value = "id") int id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		UserShareHelpRecvVO vo = this.shareHelpService.updateHelp(userId, id);
        return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/invite-new/list", method=RequestMethod.GET)
	@ApiOperation( value = "", response = UserShareNewVO.class, notes = "" )
    public ResponseResult listInviteNew(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		List<UserShareNewDTO> list = this.shareService.listInviteNew(userId);
		UserShareNewVO vo = new UserShareNewVO();
		vo.setList(list);
		vo.setIsRecv(this.shareService.getRecvInviteNewAwardState(userId));
		vo.setAward(this.shareService.inviteNewwardToAwardItemsVO(userId));
        return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/invite-new/recv", method=RequestMethod.POST)
	@ApiOperation( value = "", response = AwardItemsVO.class, notes = "" )
    public ResponseResult recvInviteNew(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		AwardItemsVO vo = this.shareService.updateAwardInviteNew(userId);
        return new ResponseResult(vo);
	}
}
