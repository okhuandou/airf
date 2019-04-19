package com.fungame.aircraft.dao.cfg;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.RedpackCfg;
import com.fungame.aircraft.dao.mapper.RedpackCfgMapper;
import com.google.common.collect.HashBasedTable;

@Repository
public class RedpackCfgDao extends BaseLocalCacheDao<Integer, HashBasedTable<Integer, Integer, RedpackCfg>> {
	@Autowired
	RedpackCfgMapper mapper;
	
	@Override
	public HashBasedTable<Integer, Integer, RedpackCfg> load(Integer key) {
		List<RedpackCfg> list = this.mapper.selectAll();
		HashBasedTable<Integer, Integer, RedpackCfg> table = HashBasedTable.create();
		for(RedpackCfg cfg: list) {
			table.put(cfg.getType(), cfg.getId(), cfg);
		}
		return table;
	}

	public RedpackCfg get(int type, int id) {
		HashBasedTable<Integer, Integer, RedpackCfg> cfgs = super.get(1);
		RedpackCfg cfg = null;
		if(cfgs != null) {
			cfg = cfgs.get(type, id);
			if(cfg == null) {
				Map<Integer, RedpackCfg> map = cfgs.row(type);
				TreeMap<Integer, RedpackCfg> tree = new TreeMap<>(map);
				return tree.lastEntry().getValue();
			}
		}
		if(cfg == null) {
			cfg = new RedpackCfg();
			cfg.setId(7);
			cfg.setMax(0.01);
			cfg.setMin(0.01);
		}
		return cfg;
	}
}
