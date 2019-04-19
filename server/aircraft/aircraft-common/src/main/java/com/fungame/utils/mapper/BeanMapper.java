package com.fungame.utils.mapper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.BeanUtils;

/**
 * 实现深度转换Bean<->Bean的Mapper.
 */
public class BeanMapper {

//	private static MapperFacade mapper = null;
//	private static Mapper mapper = null;
	static {
//		MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();
//		mapper = mapperFactory.getMapperFacade();
//		mapper = new MapperBuilder()
//				.addMapAnyByConvention(NameBasedMapConvention.get())
//				.buildMapper();
	}

	/**
	 * 转换对象的类型.
	 */
	public static <S, D> D map(S source, Class<D> destinationClass) {
//		return mapper.map(source, destinationClass);
		D target = BeanUtils.instantiateClass(destinationClass);
		map(source, target);
		return target;
	}
	
	/**
	 * 转换对象的类型.
	 */
	public static <S, D> void map(S source, D destinationObject) {
//		mapper.map(source, destinationObject);
		BeanUtils.copyProperties(source, destinationObject);
	}

	/**
	 * 转换Collection中对象的类型.
	 */
	public static <S, D> List<D> mapList(Iterable<S> sourceList, Class<D> destinationClass) {
//		return mapper.mapAsList(sourceList, destinationClass);
		List<D> list = new ArrayList<>();
		if(sourceList == null) return list;
		Iterator<S> iter = sourceList.iterator();
		while(iter.hasNext()) {
			S s = iter.next();
			list.add(map(s, destinationClass));
		}
		return list;
	}

}