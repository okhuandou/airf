package com.fungame.aircraft.ctrl;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fungame.aircraft.dao.NamesSetDao;
import com.fungame.aircraft.dao.entity.NamesSet;
import com.fungame.core.web.ResponseResult;
import com.fungame.utils.EmojiChar;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value="/notice")
@Api(tags = "notice", description="notice")
public class NoticeCtrl {
	@Autowired
	NamesSetDao namesSetDao;
	
	@RequestMapping(value="/list", method=RequestMethod.GET)
    public ResponseResult list(
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		List<NamesSet> list = namesSetDao.getLimit(50);
		List<String> vo = new ArrayList<>();
		for(NamesSet name: list) {
			vo.add(EmojiChar.emojiRecovery(name.getName()));
		}
		return new ResponseResult(vo);
	}
}
