package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.AwardItemsVO;
import com.fungame.aircraft.ctrl.vo.TaskRecvVO;
import com.fungame.aircraft.ctrl.vo.TaskVO;
import com.fungame.aircraft.dao.UserTaskDao;
import com.fungame.aircraft.dao.cfg.TaskDao;
import com.fungame.aircraft.dao.entity.Task;
import com.fungame.aircraft.dao.entity.UserTask;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.mapper.BeanMapper;
import com.fungame.utils.time.DateTimeUtils;

@Service
public class UserTaskService {
	private static Logger logger = LoggerFactory.getLogger(UserTaskService.class);
	@Autowired
	UserTaskDao userTaskDao;
	@Autowired
	TaskDao taskDao;
	@Autowired
	UserService userService;
	
	public List<UserTask> getUserTasks(int userId) throws CacheException {
		List<UserTask> tasks = this.userTaskDao.getTasks(userId);
		List<UserTask> res = new ArrayList<>();
		Map<Integer, List<Task>> allTaskCfgs = this.taskDao.getAll();
		for(int kind: allTaskCfgs.keySet()) {
			boolean isExits = false;
			for(UserTask task: tasks) {
				Task taskCfg = this.taskDao.getById(task.getTaskId());
				if(taskCfg.getKind() != kind) {
					continue;
				}
				if( ! DateTimeUtils.isSameDay(new Date(), task.getLastModified())) {
					task.reset();
				}
				isExits = true;
				if(task.getIsComplete() == 1 && task.getIsReceive() == 1) {
					if(taskCfg.getTrigger1() > 0) {
						boolean flag = false;
						for(UserTask tmpTask: tasks) {
							if(tmpTask.getTaskId() == taskCfg.getTrigger1()) {
								flag = true;
								break;
							}
						}
						if( ! flag) {
							UserTask nextUserTask = new UserTask();
							nextUserTask.setUserId(userId);
							nextUserTask.setTaskId(taskCfg.getTrigger1());
							nextUserTask.setCreatedAt(new Date());
							nextUserTask.setNull(false);
							nextUserTask.setLastModified(new Date());
							this.userTaskDao.insert(nextUserTask);
							res.add(nextUserTask);
						}
						continue;
					}
				}
				res.add(task);
			}
			if( ! isExits) {
				Task taskCfg = this.taskDao.getFirstByKind(kind);
				if(taskCfg != null) {					
					UserTask nextUserTask = new UserTask();
					nextUserTask.setUserId(userId);
					nextUserTask.setTaskId(taskCfg.getId());
					nextUserTask.setCreatedAt(new Date());
					nextUserTask.setNull(false);
					nextUserTask.setLastModified(new Date());
					this.userTaskDao.insert(nextUserTask);
					res.add(nextUserTask);
				}
			}
		}
		return res;
	}
	
	public TaskVO doTask(int userId, int taskId, int num) throws CacheException {
		UserTask userTask = this.userTaskDao.getTask(userId, taskId);
		boolean newTask = false;
		TaskVO vo = new TaskVO();
		if(userTask == null || userTask.isNull()) {
			userTask = userTask == null ? new UserTask() : userTask;
			userTask.setUserId(userId);
			userTask.setTaskId(taskId);
			userTask.setCreatedAt(new Date());
			userTask.setNull(false);
			newTask = true;
		}
		else {
			if( ! DateTimeUtils.isSameDay(new Date(), userTask.getLastModified())) {
				userTask.reset();
			}
		}
		userTask.setCurrNum(userTask.getCurrNum() + num);
		userTask.setLastModified(new Date());
		Task taskCfg = this.taskDao.getById(taskId);
		if(userTask.getCurrNum() >= taskCfg.getNeed()) {
			userTask.setIsComplete(1);
		}
		if(newTask) {
			this.userTaskDao.insert(userTask);
		}
		else this.userTaskDao.update(userTask);
		
		vo = BeanMapper.map(userTask, TaskVO.class);
		return vo;
	}
	
	public TaskRecvVO doRecv(int userId, int taskId) throws CacheException, AppException {
		TaskRecvVO vo = new TaskRecvVO();
		vo.setTaskId(taskId);
		UserTask userTask = this.userTaskDao.getTask(userId, taskId);
		Task taskCfg = this.taskDao.getById(taskId);
		if(userTask == null || userTask.isNull()
				|| userTask.getIsComplete() == 0
				|| userTask.getCurrNum() < taskCfg.getNeed()) return vo;
		if(userTask.getIsReceive() == 1) return vo;
		userTask.setIsReceive(1);
		userTask.setLastModified(new Date());
		this.userTaskDao.update(userTask);
		
		AwardItemsVO award = new AwardItemsVO();
		if(taskCfg.getCoin() > 0) {
			int mycoin = this.userService.addUserCoin(userId, taskCfg.getCoin(), BillLogger.reason_coin_task, taskId);
			award.setCoin(taskCfg.getCoin());
			award.setMycoin(mycoin);
		}
		if(taskCfg.getQzb() > 0) {
			int myqzb = this.userService.addUserQzb(userId, taskCfg.getQzb(), BillLogger.reason_coin_task, taskId);
			award.setQzb(taskCfg.getQzb());
			award.setMyqzb(myqzb);
		}
		vo.setAward(award);
		
		if(taskCfg.getTrigger1() > 0 && this.taskDao.get(taskCfg.getTrigger1()) != null) {
			TaskVO nextTaskVO = new TaskVO();
			nextTaskVO.setTaskId(taskCfg.getTrigger1());
			vo.setNext(nextTaskVO);
			
			UserTask nextUserTask = new UserTask();
			nextUserTask.setUserId(userId);
			nextUserTask.setTaskId(taskCfg.getTrigger1());
			nextUserTask.setCreatedAt(new Date());
			nextUserTask.setNull(false);
			nextUserTask.setLastModified(new Date());
			this.userTaskDao.insert(nextUserTask);
		}
		return vo;
	}
}
