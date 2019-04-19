package com.fungame.aircraft.dao.flush;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.UserTask;
import com.fungame.aircraft.dao.mapper.UserTaskMapper;
import com.fungame.core.cache.CacheException;
import com.fungame.core.cache.JedisCache;
import com.fungame.core.cache.annotation.CacheableKVSetFields;
import com.fungame.core.cache.annotation.ExpireMode;
@Repository
public class UserTaskDao extends BaseDao {
	@Autowired
	UserTaskMapper mapper;
	
	public List<UserTask> getTasks(int userId) throws CacheException {
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		Set<Integer> ids = cache.smembers("utaskids:"+userId, Integer.class);
		List<UserTask> list = new ArrayList<>();
		if(ids != null && ! ids.isEmpty()) {
			for(int id: ids) {
				if(id == 0) continue;
				UserTask item = cache.getFields("utask", userId+":"+id, "taskId", UserTask.class);
				if(item == null || item.isNull()) continue;
				list.add(item);
			}
		}
		else {
			list = this.mapper.select(userId);
			if(list != null && ! list.isEmpty()) {
				for(UserTask task: list) {
					cache.setFields("utask", userId+":"+task.getTaskId(), task, ExpireMode.Daily.getExpire(3));
					cache.sadd("utaskids:"+userId, task.getTaskId());
				}
			}
			else cache.sadd("utaskids:"+userId, 0);
			cache.expire("utaskids:"+userId, ExpireMode.Daily.getExpire(3));
		}
		return list;
	}
	
	public UserTask getTask(int userId, int taskId) throws CacheException {
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		UserTask item = cache.getFields("utask", userId+":"+taskId, "taskId", UserTask.class);
		if(item == null) {
			item = this.mapper.selectOne(userId, taskId);
			item = new UserTask();
			item.setUserId(userId);
			item.setTaskId(taskId);
			item.setNull(true);
			cache.setFields("utask", userId+":"+taskId, item, 3*24*3600);
		}
		return item;
	}
	
	@CacheableKVSetFields(prefix="utask", suffix= {"#userTask.userId","#userTask.taskId"},value="#userTask",expire=3,expireMode=ExpireMode.Daily)
	public void insert(UserTask userTask) throws CacheException {
		this.mapper.insert(userTask);
		JedisCache cache = this.cacheMgr.getCache(CacheName);
		cache.sadd("utaskids:"+userTask.getUserId(), userTask.getTaskId());
	}
	
	@CacheableKVSetFields(prefix="utask", suffix= {"#userTask.userId","#userTask.taskId"},value="#userTask",expire=3,expireMode=ExpireMode.Daily)
	public void update(UserTask userTask) {
		this.mapper.update(userTask);
	}
}
