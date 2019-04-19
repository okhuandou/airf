package com.fungame.core.web;

import javax.servlet.annotation.WebFilter;

import com.alibaba.druid.support.http.WebStatFilter;

@WebFilter(filterName="druidWebStatServlet",urlPatterns="/*")
public class DruidWebStatServlet extends WebStatFilter {
	
}
