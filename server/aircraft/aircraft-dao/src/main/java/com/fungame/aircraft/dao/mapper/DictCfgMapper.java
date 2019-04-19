package com.fungame.aircraft.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fungame.aircraft.dao.entity.DictCfg;

@Mapper
public interface DictCfgMapper {
	
	@Select("select * from dict_cfg")
	public List<DictCfg> selectAll();

	@Update("update dict_cfg set value=#{value} where type=#{type} and dict_key=#{dictKey}")
	public void update(@Param("type")String type, @Param("dictKey")String dictKey, @Param("value")String value);
}
