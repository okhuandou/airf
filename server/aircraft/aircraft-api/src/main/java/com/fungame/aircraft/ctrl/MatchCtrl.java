package com.fungame.aircraft.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.ctrl.vo.MatchAddReqVO;
import com.fungame.aircraft.ctrl.vo.MatchAddUserReqVO;
import com.fungame.aircraft.ctrl.vo.MatchAddUserVO;
import com.fungame.aircraft.ctrl.vo.MatchRecvVO;
import com.fungame.aircraft.ctrl.vo.UserMatchVO;
import com.fungame.aircraft.service.UserMatchService;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/match")
@Api(tags = "match", description="match")
public class MatchCtrl {
	private static Logger logger = LoggerFactory.getLogger(MatchCtrl.class);
	@Autowired
	UserMatchService userMatchService;

	@RequestMapping(value="/list/{fromUserId}", method=RequestMethod.GET)
    public ResponseResult list(
    		SessionVals sessionVals,
    		@PathVariable(value = "fromUserId") int fromUserId,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		UserMatchVO vo = this.userMatchService.select(fromUserId);
		return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/add", method=RequestMethod.POST)
    public ResponseResult add(
    		SessionVals sessionVals,
    		@RequestBody MatchAddReqVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		this.userMatchService.add(userId, vo.getScore(), vo.getHeroKind(), vo.getHeroSeq());
		return new ResponseResult();
	}
	
	@RequestMapping(value="/add-user", method=RequestMethod.POST)
    public ResponseResult addUser(
    		SessionVals sessionVals,
    		@RequestBody MatchAddUserReqVO vo,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		MatchAddUserVO rsp = this.userMatchService.addUser(userId, vo.getScore(), vo.getFromUserId(), vo.getHeroKind(), vo.getHeroSeq());
		return new ResponseResult(rsp);
	}
	
	@RequestMapping(value="/recv", method=RequestMethod.GET)
    public ResponseResult recv(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		MatchRecvVO vo = this.userMatchService.updateRecv(userId);
		return new ResponseResult(vo);
	}
	
}
