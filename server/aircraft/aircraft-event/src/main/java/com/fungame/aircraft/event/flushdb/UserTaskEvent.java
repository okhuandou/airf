package com.fungame.aircraft.event.flushdb;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fungame.aircraft.dao.entity.UserTask;
import com.fungame.aircraft.dao.flush.UserTaskDao;
import com.fungame.aircraft.dao.mapper.UserTaskMapper;
import com.fungame.aircraft.event.IEventService;
import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;

@Component
public class UserTaskEvent extends IEventService<UserTask> {
	private static final Logger logger = LoggerFactory.getLogger(UserTaskEvent.class);
	@Autowired
	UserTaskDao userTaskDao;
	@Autowired
	UserTaskMapper mapper;
	private List<Object> locks = new ArrayList<>();
	@PostConstruct
	public void init() {
		for(int i=0; i<100000; i++) {
			locks.add(new Object());
		}
	}
	
	@Override
	public void execute(UserTask data) throws Exception {
		
	}

	public void insert(UserTask userTask) throws Throwable {
		synchronized (this.locks.get(userTask.getUserId() % locks.size())) {				
			try {
				UserTask utask = this.mapper.selectOne(userTask.getUserId(), userTask.getTaskId());
				if(utask != null && ! utask.isNull()) {
					this.update(userTask);
					return ;
				}
				
				this.userTaskDao.insert(userTask);
			}
			catch (Throwable e) {
				if(e instanceof MySQLIntegrityConstraintViolationException) {
					if(e.getMessage().contains("Duplicate entry")) {
						logger.warn(userTask.toString(), e);
						return;
					}
				}
				logger.error(userTask.toString(), e);
				throw e;
			}
		}
	}

	public void update(UserTask userTask) {
		this.userTaskDao.update(userTask);
	}
}
