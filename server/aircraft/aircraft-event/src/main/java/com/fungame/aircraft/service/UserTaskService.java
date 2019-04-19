package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.aircraft.dao.cfg.TaskDao;
import com.fungame.aircraft.dao.entity.Task;
import com.fungame.aircraft.dao.entity.UserTask;
import com.fungame.aircraft.dao.flush.UserTaskDao;
import com.fungame.core.cache.CacheException;

@Service
public class UserTaskService {
	@Autowired
	UserTaskDao userTaskDao;
	@Autowired
	TaskDao taskDao;
	
	public void doTask(int userId, int kind, int num) throws CacheException {
		List<UserTask> userTasks = this.userTaskDao.getTasks(userId);
		if(userTasks == null) userTasks = new ArrayList<>();
		UserTask userTask = null;
		Task task = null;
		List<Task> allTasks = this.taskDao.getAllByKind(kind);
		for(Task taskTmp: allTasks) {
			boolean found = false;
			for(UserTask userTaskTmp: userTasks) {
				if(taskTmp.getId() == userTaskTmp.getTaskId() && ! userTaskTmp.isNull()) {
					found = true;
					if(userTaskTmp.getIsComplete() == 0) {
						userTask = userTaskTmp;
						task = taskTmp;
						break;
					}
				}
			}
			if(found && userTask != null) {
				break;
			}
			if( ! found && (userTask == null || userTask.isNull())) {
				task = taskTmp;
				break;
			}
		}
		if(task == null) {
			return ;
		}
		boolean newTask = false;
		if(userTask == null || userTask.isNull()) {
			userTask = userTask == null ? new UserTask() : userTask;
			userTask.setUserId(userId);
			userTask.setTaskId(task.getId());
			userTask.setCreatedAt(new Date());
			userTask.setNull(false);
			newTask = true;
		}
		userTask.setCurrNum(userTask.getCurrNum() + num);
		userTask.setLastModified(new Date());
		if(userTask.getCurrNum() >= task.getNeed()) {
			userTask.setIsComplete(1);
		}
		if(newTask) {
			this.userTaskDao.insert(userTask);
		}
		else this.userTaskDao.update(userTask);
	}
}
