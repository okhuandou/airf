package com.fungame.aircraft.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.dao.entity.WorldRank;
import com.fungame.aircraft.service.RankService;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/rank")
@Api(tags = "rank", description="rank")
public class RankCtrl {
	@Autowired
	RankService rankService;
	
	@RequestMapping(value="/world", method=RequestMethod.GET)
    public ResponseResult world(
    		SessionVals sessionVals,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		List<WorldRank> list = this.rankService.getWorldRankList();
        return new ResponseResult(list);
	}
}
