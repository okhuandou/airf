package com.fungame.aircraft.dao.cfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.Task;
import com.fungame.aircraft.dao.mapper.TaskMapper;

@Repository
public class TaskDao extends BaseLocalCacheDao<Integer, Map<Integer, List<Task>>> {
	@Autowired
	TaskMapper mapper;
	
	@Override
	public Map<Integer, List<Task>> load(Integer key) {
		List<Task> all = this.mapper.selectAll();
		Map<Integer, List<Task>> res = new HashMap<>();
		for(Task task: all) {
			List<Task> list = res.get(task.getKind());
			if(list == null) {
				list = new ArrayList<>();
				res.put(task.getKind(), list);
			}
			list.add(task);
		}
		return res;
	}
	
	public Task getById(int id) {
		Map<Integer, List<Task>> all = this.getAll();
		for(List<Task> tasks: all.values()) {
			for(Task task: tasks) {
				if(task.getId() == id) {
					return task;
				}
			}
		}
		return null;
	}
	
	public Map<Integer, List<Task>> getAll() {
		return this.get(1);
	}
	
	public Task getFirstByKind(int kind) {
		Map<Integer, List<Task>> all = this.getAll();
		List<Task> list = all.get(kind);
		if(list != null && list.size() > 0) return list.get(0);
		return null;
	}

	public List<Task> getAllByKind(int kind) {
		Map<Integer, List<Task>> all = this.getAll();
		return all.get(kind);
	}
}
