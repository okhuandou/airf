package com.fungame.aircraft.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.ctrl.vo.BillVO;
import com.fungame.aircraft.ctrl.vo.BillVoV2;
import com.fungame.aircraft.service.BillLogger;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/bill")
@Api(tags = "bill", description="bill")
public class BillCtrl {

	@RequestMapping(value="", method= RequestMethod.POST)
    public ResponseResult bill(
    		SessionVals sessionVals,
    		@RequestBody BillVO bill,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = sessionVals!=null?(int) sessionVals.getUid():0;
		BillLogger.common(userId, bill.getCard(), bill.getSlot(), bill.getAct(), bill.getExt1(), 
				bill.getExt2(), bill.getExt3(), bill.getExt4(), bill.getExt5());
        return new ResponseResult();
	}

	@RequestMapping(value="/v2", method= RequestMethod.POST)
    public ResponseResult billV2(
    		SessionVals sessionVals,
    		@RequestBody BillVoV2 bill,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = sessionVals!=null?(int) sessionVals.getUid():0;
		BillLogger.commonV2(userId, bill.getCard(), bill.getSlot(), bill.getAct(), bill.getExt1(), 
				bill.getExt2(), bill.getExt3(), bill.getExt4(), bill.getExt5());
        return new ResponseResult();
	}
}
