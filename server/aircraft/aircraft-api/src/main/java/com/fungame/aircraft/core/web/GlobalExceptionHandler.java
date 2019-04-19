package com.fungame.aircraft.core.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fungame.AppException;
import com.fungame.core.web.CommonError;
import com.fungame.core.web.ResponseResult;

/**
 * 异常捕捉并输出错误信息
 * 
 * @author peter.lim林炳忠
 *
 */
@ControllerAdvice
public class GlobalExceptionHandler {
	private static Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(value = Exception.class)
	@ResponseBody
	public ResponseResult jsonErrorHandler(HttpServletRequest request, Exception ex) throws Exception {
		int code = CommonError.SysError.getCode();
		String msg = CommonError.SysError.getMsg();
		if (ex instanceof MethodArgumentNotValidException) {
			MethodArgumentNotValidException notVaildEx = (MethodArgumentNotValidException) ex;
			code = CommonError.SysError.getCode();
			msg = notVaildEx.getBindingResult().getFieldError().getDefaultMessage();
		} else {
			if (ex instanceof AppException) {
				code = ((AppException) ex).getCode();
				msg = ((AppException) ex).getErrmsg();
			}
			else {
				if (ex instanceof HttpMessageNotReadableException) {
					code = CommonError.SysError.getCode();
					msg = CommonError.SysError.getMsg();
				}
				else if (ex instanceof MissingServletRequestParameterException) {
					code = CommonError.MissParam.getCode();
					msg = CommonError.MissParam.getMsg();
				}
				else if (ex instanceof TypeMismatchException) {
					code = CommonError.MissParam.getCode();
					msg = CommonError.MissParam.getMsg();
				}
				else if (ex instanceof IOException) {
					code = CommonError.IoError.getCode();
					msg = CommonError.IoError.getMsg();
				}
			}
		}
		
		String url = request.getRequestURL().toString();
		logger.error(System.currentTimeMillis()+" "+url, ex);
		ResponseResult result = new ResponseResult();
		result.setCode(code);
		result.setMsg(msg);
		return result;
	}
}
