package com.fungame.core.cache;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONType;
import com.alibaba.fastjson.util.FieldInfo;
import com.alibaba.fastjson.util.TypeUtils;
import com.fungame.core.cache.codec.AbstractCodec;
import com.fungame.utils.mapper.JSONMapper;
import com.google.common.collect.Lists;

import redis.clients.jedis.BinaryJedis;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.exceptions.JedisException;
/**
 * 
 * @author peter.lim林炳忠
 *
 */
@Component
public class JedisCache {
	static Logger logger = LoggerFactory.getLogger(JedisCache.class);
	private JedisPoolWriper jedisPool;
	private String name;
	private AbstractCodec codec;
	public void setCodec(AbstractCodec codec) {
		this.codec = codec;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public byte[] serializeKey(String t) {
		return codec.encode(t);
	}
	
	public byte[] serializeValue(Object obj) {
		return codec.encode(obj);
	}
	
	public <T>T deserializeValue(byte[] bytes, Class<T> valueType) {
		return codec.decode(bytes, valueType);
	}
	public void setJedisPool(JedisPoolWriper jedisPool) {
		this.jedisPool = jedisPool;
	}
	public Jedis getJedis() {
		if (jedisPool != null) {
			return jedisPool.getJedisPool().getResource();
		}
		return null;
	}
	public boolean release(Jedis jedis) {
		if (jedis != null) {
			jedis.close();
			return true;
		}
		return false;
	}
	
	public boolean exits(String key) throws CacheException {
		if (key == null) {
			throw new CacheException("key can not be null");
		}
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Boolean resvalue = jedis.exists(key);
			if (null != resvalue) {
				return resvalue.booleanValue();
			}
		} catch (JedisException e) {
			logger.error("exits:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return false;
	}
	
	public void del(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.del(key);
		} catch (JedisException e) {
			logger.error("del:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public boolean expire(String key,int seconds) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			if(jedis.expire(key, seconds)>0){
				return true;
			}
		} catch (JedisException e) {
			logger.error("expire:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return false;
	}
	
	public void set(String key, Object obj) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.set(getKeyBytes(key), codec.encode(obj));
		} catch (JedisException e) {
			logger.error("set:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void append(String key, String value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.append(key,value);
		} catch (JedisException e) {
			logger.error("append:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	
	public void setex(String key, int second, Object obj) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.setex(getKeyBytes(key), second, codec.encode(obj));
		} catch (JedisException e) {
			logger.error("set:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	/**
	 * 不推荐使用
	 * @param key
	 * @return
	 * @throws CacheException
	 */
	
	@Deprecated
	public String getStr(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			String data = jedis.get(key);

			if (data != null) {
				return data;
			}

		} catch (JedisException e) {
			logger.error("getStr:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return null;
	}
	
	
	public long incr(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.incr(key);
		} catch (JedisException e) {
			logger.error("incr:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public long incrby(String key, long step) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.incrBy(key, step);
		} catch (JedisException e) {
			logger.error("incrby:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void decr(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.decr(key);
		} catch (JedisException e) {
			logger.error("decr:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public void decrby(String key, int step) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.decrBy(key, new Long(step).longValue());
		} catch (JedisException e) {
			logger.error("step:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public void push(String key, List<Object> obj) throws CacheException {
		del(key);
		for (Object t : obj) {
			rpush(key, t);
		}
	}
	
	public void rpush(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.rpush(getKeyBytes(key), codec.encode(value));
		} catch (JedisException e) {
			logger.error("rpush:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public void lpush(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.lpush(getKeyBytes(key), codec.encode(value));
		} catch (JedisException e) {
			logger.error("lpush:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public int llen(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Long longValue = jedis.llen(key);
			if (null != longValue) {
				return longValue.intValue();
			}
		} catch (JedisException e) {
			logger.error("rpush:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return 0;
	}
	
	public void sadd(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.sadd(getKeyBytes(key), codec.encode(value));
		} catch (JedisException e) {
			logger.error("sadd:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public void addset(String key, List<Object> obj) throws CacheException {
		try {
			if (obj != null && !obj.isEmpty()) {
				for (Object value : obj) {
					sadd(key, value);
				}
			}
		} catch (Exception e) {
			logger.error("addset:" + key, e);
			throw new CacheException(e.getMessage());
		}
	}
	
	public boolean sismember(String key, Object member) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.sismember(getKeyBytes(key), codec.encode(member));
		} catch (JedisException e) {
			logger.error("srem:" + key, e);
		} finally {
			release(jedis);
		}
		return false;
	}
	
	public boolean srem(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.srem(getKeyBytes(key), codec.encode(value));
		} catch (JedisException e) {
			logger.error("srem:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return false;
	}
	
	public <VT> Set<VT> smembers(String key, Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Set<byte[]> set = jedis.smembers(getKeyBytes(key));
			Set<VT> rs = new HashSet<VT>();
			if(set != null) {
				for(byte[] b: set) {
					rs.add(codec.decode(b, valueType));
				}
			}
			return rs;
		} catch (JedisException e) {
			logger.error("srem:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long scard(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.scard(key).longValue();
		} catch (JedisException e) {
			logger.error("scard:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}

	}

	public void addItemToList(String key, byte[] value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.lpush(getKeyBytes(key), value);

		} catch (JedisException e) {
			logger.error("addItemToList:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}

	}
	
	public <KT, VT> void hmset(String key, Map<KT, VT> map, Class<KT> keyType, Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Map<byte[], byte[]> hash = new HashMap<byte[], byte[]>();
			if (map != null && ! map.isEmpty()) {
				for (Map.Entry<KT, VT> entry : map.entrySet()) {
					hash.put(codec.encode(entry.getKey()), codec.encode(entry.getValue()));
				}
				jedis.hmset(getKeyBytes(key), hash);
			}
		} catch (JedisException e) {
			logger.error("setHashMap:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	private byte[] getKeyBytes(Object key) throws CacheException {
		if (null == key)
			throw new IllegalArgumentException("key is null");
		byte[] bytes = null;
		if(key instanceof String) {
			try {
				bytes = ((String) key).getBytes("UTF-8");
			} catch (UnsupportedEncodingException e) {
				logger.error("getKeyBytes:" + key, e);
				throw new CacheException(e.getMessage());
			}
		}
		else {
			bytes = codec.encode(key);
		}
		byte[] arr = bytes;
		int len = arr.length;
		for (int i = 0; i < len; ++i) {
			byte b = arr[i];
			if ((b == 32) || (b == 10) || (b == 13)) {
				throw new IllegalArgumentException(key+"; Key includes invalid byte value: " + b);
			}
		}
		return bytes;
	}
	
	public boolean setex(String key, int seconds, String value)
			throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.setex(key, seconds, value);
		} catch (Exception e) {
			logger.error("hdelObj:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return true;
	}
	
	public void zadd(String key, double score, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.zadd(getKeyBytes(key),score, codec.encode(value));
		} catch (JedisException e) {
			logger.error("sadd:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		
	}
	
	public long zcard(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.zcard(getKeyBytes(key));
		} catch (JedisException e) {
			logger.error("zcard:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void zremRangeByScore(String key, double min, double max) throws CacheException{
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.zremrangeByScore(getKeyBytes(key),min, max);
		} catch (JedisException e) {
			logger.error("zremRangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void zrem(String key, String... members) throws CacheException{
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.zrem(key, members);
		} catch (JedisException e) {
			logger.error("zremRangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long ttl(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.ttl(key);
		} catch (JedisException e) {
			logger.error("zremRangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> VT get(String key, Class<VT> valueType) throws CacheException {
		if (key == null) {
			throw new CacheException("key can not be null");
		}
		Jedis jedis = null;
		try {
			jedis = getJedis();
			byte[] bulkData = jedis.get(getKeyBytes(key));
			return (VT)codec.decode(bulkData, valueType);
		} catch (JedisException e) {
			logger.error("get", e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> mget(Class<VT> valueType, String ...keys) throws CacheException {
		if (keys == null) {
			throw new CacheException("key can not be null");
		}
		Jedis jedis = null;
		try {
			jedis = getJedis();
			byte byteKeys[][] = new byte[keys.length][];
			for(int i=0; i<keys.length; i++) {
				String key = keys[i];
				byte bk[] = getKeyBytes(key);
				byteKeys[i] = bk;
			}
			List<byte[]> list = jedis.mget(byteKeys);
			List<VT> rs = new ArrayList<>();
			if(list != null) {
				for(byte[] bytes: list) {
					VT v = codec.decode(bytes, valueType);
					rs.add(v);
				}
			}
			return rs;
		} catch (JedisException e) {
			logger.error("mget", e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> list(String key, Class<VT> valueType)
			throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return lrange(key, 0, -1, valueType);
		} catch (JedisException e) {
			logger.error("rpush:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> lrange(String key, int start, int end,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			List<byte[]> lists = jedis.lrange(key.getBytes(), start, end);
			if (null != lists && !lists.isEmpty()) {
				return codec.decode(lists, valueType);
			}
		} catch (JedisException e) {
			logger.error("lrange:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return null;
	}

	public <VT> VT lpop(String key, Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.lpop(getKeyBytes(key)), valueType);
		} catch (JedisException e) {
			logger.error("lpop:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public void lrem(String key, String value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.lrem(getKeyBytes(key), 1, codec.encode(value));
		} catch (JedisException e) {
			logger.error("lrem:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void lset(String key, int index, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.lset(getKeyBytes(key), index, codec.encode(value));
		} catch (JedisException e) {
			logger.error("lset:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> VT lindex(String key, int index, Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.lindex(getKeyBytes(key), index), valueType);
		} catch (JedisException e) {
			logger.error("lindex:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public <VT> List<VT> zrange(String key, long start, long end,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.zrange(getKeyBytes(key),start, end), valueType);
		} catch (JedisException e) {
			logger.error("zrange:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	public <VT> List<VT> zrevrange(String key, long start, long end,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.zrevrange(getKeyBytes(key),start, end), valueType);
		} catch (JedisException e) {
			logger.error("zrevrange:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> zrangeByScore(String key, double min, double max,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			if(max == 0) {
				return codec.decode(jedis.zrangeByScore(getKeyBytes(key),this.getKeyBytes(min+""), this.getKeyBytes("+inf")), valueType);
			}
			else {
				return codec.decode(jedis.zrangeByScore(getKeyBytes(key),min, max), valueType);
			}
		} catch (JedisException e) {
			logger.error("zrangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> zrangeByScore(String key, double min, double max, int offset, int limit,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(((BinaryJedis)jedis).zrangeByScore(getKeyBytes(key), min, max, offset, limit), valueType);
		} catch (JedisException e) {
			logger.error("zrangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> zrevrangeByScore(String key, double min, double max, int offset, int limit,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.zrevrangeByScore(getKeyBytes(key),min, max, offset, limit), valueType);
		} catch (JedisException e) {
			logger.error("zrevrangeByScore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <VT> List<VT> listset(String key, Class<VT> valueType)
			throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return codec.decode(jedis.smembers(getKeyBytes(key)), valueType);
		} catch (JedisException e) {
			logger.error("listset:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void hsetObj(String key, Object field, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.hset(getKeyBytes(key), codec.encode(field), codec.encode(value));
		} catch (Exception e) {
			logger.error("hset:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <KT, VT> Map<KT, VT> hgetAll(String key, Class<KT> keyType,
			Class<VT> valueType) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Map<byte[],byte[]> map = jedis.hgetAll(getKeyBytes(key));
			if(null == map){
				return null;
			}
			return codec.decode(map, keyType, valueType);
		} catch (Exception e) {
			logger.error("getHashMap:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public <VT> VT hget(String key, Object field, Class<VT> valueType)
			throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			byte[] b=jedis.hget(getKeyBytes(key), codec.encode(field));
			return codec.decode(b, valueType);
		} catch (Exception e) {
			logger.error("hgetObj:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	public <VT> List<VT> hmget(String key, Object []fields, Class<VT> valueType)
			throws CacheException {
		List<Object> flist = Lists.newArrayList(fields);
		return this.hmget(key, flist, valueType);
	}
	public <VT> List<VT> hmget(String key, List<Object>fields, Class<VT> valueType)
			throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			byte[][] fieldsByte = new byte[fields.size()][];
			for(int i =0; i<fields.size(); i++) {
				fieldsByte[i] = codec.encode(fields.get(i));
			}
			List<byte[]> rs = jedis.hmget(getKeyBytes(key), fieldsByte);
			List<VT> ret = new ArrayList<>();
			if(rs != null) {
				for(byte[] t: rs) {
					VT v = codec.decode(t, valueType);
					ret.add(v);
				}
			}
			return ret;
		} catch (Exception e) {
			logger.error("hgetObj:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public int hlen(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Long longValue = jedis.hlen(key);
			if (null != longValue) {
				return longValue.intValue();
			}
		} catch (JedisException e) {
			logger.error("hlen:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
		return 0;
	}
	
	public void hdelObj(String key, Object field) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.hdel(getKeyBytes(key), codec.encode(field));
		} catch (Exception e) {
			logger.error("hdelObj:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void shutdownClient() {
		this.jedisPool.getJedisPool().destroy();
	}

	public Set<String> keys(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.keys(key);
		} catch (Exception e) {
			logger.error("keys:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	public Set<String> hkeys(String key) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.hkeys(key);
		} catch (Exception e) {
			logger.error("hkeys:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public boolean hexists(String key, String field) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.hexists(getKeyBytes(key), codec.encode(field));
		} catch (Exception e) {
			logger.error("hexists:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public <T>Set<T> hkeys(String key, Class<T> clazz) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Set<byte[]> bs = jedis.hkeys(key.getBytes());
			Set<T> ret = new HashSet<T>();
			for(byte[] b: bs) {
				ret.add(this.codec.decode(b, clazz));
			}
			return ret;
		} catch (Exception e) {
			logger.error("hkeys:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long zrank(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.zrank(getKeyBytes(key), codec.encode(value));
		} catch (Exception e) {
			logger.error("zrank:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long zrevrank(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			Long r = jedis.zrevrank(getKeyBytes(key), codec.encode(value));
			return r == null ? -1 : r;
		} catch (Exception e) {
			logger.error("zrevrank:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}

	public double zscore(String key, Object value) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return null==jedis.zscore(getKeyBytes(key), codec.encode(value))?0:jedis.zscore(getKeyBytes(key), codec.encode(value));
		} catch (Exception e) {
			logger.error("zscore:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public void publish(String channel, String message) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			jedis.publish(channel, message);
		} catch (Exception e) {
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public Set<String> sinter(String... keys) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.sinter(keys);
		} catch (Exception e) {
			logger.error("sinter:" + keys, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long zadd(final String key, final Map<String, Double> scoreMembers) throws CacheException{
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.zadd(key, scoreMembers);
		} catch (JedisException e) {
			logger.error("zadd:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	
	public long zcount(String key, double min,double max) throws CacheException {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.zcount(key,min,max);
		} catch (Exception e) {
			logger.error("zcount:" + key, e);
			throw new CacheException(e.getMessage());
		} finally {
			release(jedis);
		}
	}
	private static final String LOCK_SUCCESS = "OK";
    private static final String SET_IF_NOT_EXIST = "NX";
    private static final String SET_WITH_EXPIRE_TIME = "PX";
	public boolean setNxPx(String key, String value, long expireMillis) {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return LOCK_SUCCESS.equals(jedis.set(key, value, SET_IF_NOT_EXIST, SET_WITH_EXPIRE_TIME, expireMillis));
		} catch (Exception e) {
			logger.error("set:" + key, e);
		} finally {
			release(jedis);
		}
		return false;
	}
	public boolean setnx(String key, String value) {
		Jedis jedis = null;
		try {
			jedis = getJedis();
			return jedis.setnx(key, value) == 1;
		} catch (Exception e) {
			logger.error("set:" + key, e);
		} finally {
			release(jedis);
		}
		return false;
	}
	/**
	 * 每分钟定时器环形队列
	 * @param keyPrefix
	 * @param value
	 * @param runAfterSeconds
	 * @throws CacheException 
	 */
	public void addRingQueueForPerMinuteTimer(String keySuffix, Object value, int runAfterMinutes) throws CacheException {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, runAfterMinutes);
		int m = cal.get(Calendar.MINUTE);
		//RQueue4PMTimer_
	}
	public void getRingQueueForPerMinuteTimer(String keySuffix) throws CacheException {
		Calendar cal = Calendar.getInstance();
		int m = cal.get(Calendar.MINUTE);
		Integer lastAt = this.get("RQueue4PMTimer_"+keySuffix+"_AT", Integer.class);
		if(lastAt == null) lastAt = 0;
		List<Integer> fields = new ArrayList<>();
		
	}
	
	public void setFields(String prefix, String suffix, Object value, int expire) {
		Jedis jedis = null;
		try {
			jedis = this.getJedis();
			Pipeline pipeline = jedis.pipelined();
			JSONObject valueJSON = JSONMapper.toJSONObject(value);
			for(String field: valueJSON.keySet()) {
				Object fieldVal = valueJSON.get(field);
				if(fieldVal == null) continue;
				String k = new StringBuilder(prefix).append(":").append(field).append(":").append(suffix).toString().toLowerCase();
				if(expire > 0) {
					pipeline.setex(this.serializeKey(k), expire ,this.serializeValue(fieldVal));
				}
				else {
					pipeline.set(this.serializeKey(k), this.serializeValue(fieldVal));
				}
			}
			pipeline.sync();
		}
		finally {
			if(jedis != null) this.release(jedis);
		}
	}
	
	public <T>T getFields(String prefix, String suffix, String idName, Class<T> type) {
		Jedis jedis = null;
		try {
			jedis = this.getJedis();
			Pipeline pipeline = jedis.pipelined();
			List<FieldInfo> getters = TypeUtils.computeGetters(type, type.getAnnotation(JSONType.class), null, false);
			for(FieldInfo field: getters) {
				String name = field.name;
				String k = new StringBuilder(prefix).append(":").append(name).append(":").append(suffix).toString().toLowerCase();
				pipeline.get(k);
			}
			List<Object> returnAll = pipeline.syncAndReturnAll();
			int i = 0;
			boolean isNull = false;
			JSONObject valueJSON = new JSONObject();
			for(FieldInfo field: getters) {
				String k = field.name;
				Object val = returnAll.get(i);
				i++;
				if(idName.equals(k) && val == null) {
					isNull = true;
					break;
				}
				if(val != null) {
					Object v = this.deserializeValue(((String)val).getBytes(), field.fieldClass);
					valueJSON.put(k, v);
				}
			}
			if(isNull) {
				return null;
			}
			return JSONMapper.toJavaBean(valueJSON, type);
		}
		finally {
			if(jedis != null) this.release(jedis);
		}
	}
}
