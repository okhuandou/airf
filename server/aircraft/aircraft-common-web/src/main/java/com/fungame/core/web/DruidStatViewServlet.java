package com.fungame.core.web;

import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

import com.alibaba.druid.support.http.StatViewServlet;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = "/dbmonitor/*", 
initParams={  
        @WebInitParam(name="loginUsername",value="druid"),//用户名
        @WebInitParam(name="loginPassword",value="Budding-com.888"),//密码
        @WebInitParam(name="resetEnable",value="false")//不允许清空统计数据
})
public class DruidStatViewServlet extends StatViewServlet {
	
}
