package com.fungame.aircraft.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fungame.AppException;
import com.fungame.aircraft.ctrl.vo.UserShareHelpRecvVO;
import com.fungame.aircraft.dao.UserGameDao;
import com.fungame.aircraft.dao.UserShareHelpDao;
import com.fungame.aircraft.dao.cfg.DictCfgDao;
import com.fungame.aircraft.dao.entity.DictCfg;
import com.fungame.aircraft.dao.entity.UserShareHelp;
import com.fungame.aircraft.service.dto.UserShareHelpDTO;
import com.fungame.core.cache.CacheException;
import com.fungame.utils.mapper.BeanMapper;

@Service
public class ShareHelpService {
	@Autowired
	UserShareHelpDao userShareHelpDao;
	@Autowired
	UserService userService;
	@Autowired
	UserGameDao userGameDao;
	@Autowired
	DictCfgDao dictCfgDao;
	
	public void addHelpFriend(int userId, int friendUserId, String friendName, String friendHeadimg) throws CacheException {
		if(userId == friendUserId) {
			return;
		}
		int cnt = this.userShareHelpDao.selectCount(userId);
		int shareHelpCount = this.dictCfgDao.intValue(DictCfg.ShareHelpCount, 3);
		if(cnt >= shareHelpCount) {
			return;
		}
		UserShareHelp help = new UserShareHelp();
		help.setUserId(userId);
		help.setFriendUserId(friendUserId);
		help.setFriendHeadimg(friendHeadimg);
		help.setFriendName(friendName);
		help.setCreatedAt(new Date());
		help.setIsRecv(0);
		this.userShareHelpDao.insert(help);
	}
	
	public List<UserShareHelpDTO> list(int userId) throws CacheException {
		List<UserShareHelp> list = this.userShareHelpDao.select(userId);
		int shareHelpCount = this.dictCfgDao.intValue(DictCfg.ShareHelpCount, 3);
		List<UserShareHelpDTO> result = new ArrayList<>();
		for (int idx=0; idx<=shareHelpCount-1; idx++) {
			UserShareHelpDTO userShareDTO = null;
			if(list.size() >= idx+1) {
				UserShareHelp userShare = list.get(idx);
				userShareDTO = BeanMapper.map(userShare, UserShareHelpDTO.class);
				if(userShare.getIsRecv() == 1 && userShare.getRecvAt() != null) {
					long nowDate = new Date().getTime();
					long endTime = userShare.getRecvAt().getTime() + 10*60*1000L;
					userShareDTO.setRemainSec((int)((endTime - nowDate)/1000));
				}
			}else {
				userShareDTO = new UserShareHelpDTO();
			}
			if(userShareDTO.getRemainSec() < 0) userShareDTO.setRemainSec(0);
			result.add(userShareDTO);
		}
		return result;
	}
	public UserShareHelpRecvVO updateHelp(int userId, int awardId) throws AppException, CacheException {
		UserShareHelp help = this.userShareHelpDao.selectOne(userId, awardId);
		UserShareHelpRecvVO vo = new UserShareHelpRecvVO();
		vo.setId(awardId);
		if(help != null) {
			this.userShareHelpDao.updateIsReceive(userId, awardId);
			help.setRecvAt(new Date());
			
			long nowDate = new Date().getTime();
			long endTime = help.getRecvAt().getTime() + 10*60*1000L;
			vo.setRemainSec((int)((endTime - nowDate)/1000));
		}
		return vo;
	}
	
}
