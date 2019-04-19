package com.fungame.aircraft.ctrl;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.ctrl.vo.TaskRecvVO;
import com.fungame.aircraft.ctrl.vo.TaskVO;
import com.fungame.aircraft.dao.entity.UserTask;
import com.fungame.aircraft.service.UserTaskService;
import com.fungame.core.web.ResponseResult;
import com.fungame.core.web.session.SessionVals;
import com.fungame.utils.mapper.BeanMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value="/task")
@Api(tags = "task", description="task")
public class TaskCtrl {
	private static Logger logger = LoggerFactory.getLogger(TaskCtrl.class);
	@Autowired
	UserTaskService userTaskService;
	
	@RequestMapping(value="/list", method= RequestMethod.POST)
	@ApiOperation( value = "", response = TaskVO.class, responseContainer="List", notes = "" )
    public ResponseResult list(
    		SessionVals sessionVals,
    		HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		List<UserTask> tasks = this.userTaskService.getUserTasks(userId);
		List<TaskVO> vo = new ArrayList<>();
		if(tasks != null) {
			vo = BeanMapper.mapList(tasks, TaskVO.class);
		}
		return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/do-it", method= RequestMethod.GET)
	@ApiOperation( value = "", response = TaskVO.class, notes = "" )
    public ResponseResult doIt(
    		SessionVals sessionVals,
    		@RequestParam(value="taskId") int taskId,
    		@RequestParam(value="num", defaultValue="1", required=false) int num,
    		HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		TaskVO vo = this.userTaskService.doTask(userId, taskId, num);
		return new ResponseResult(vo);
	}
	
	@RequestMapping(value="/recv", method= RequestMethod.POST)
	@ApiOperation( value = "", response = TaskRecvVO.class, notes = "" )
    public ResponseResult recv(
    		SessionVals sessionVals,
    		@RequestParam(value="taskId") int taskId,
    		HttpServletRequest request, HttpServletResponse response) throws Exception {
		int userId = (int) sessionVals.getUid();
		TaskRecvVO vo = this.userTaskService.doRecv(userId, taskId);
		return new ResponseResult(vo);
	}
	
	
}
