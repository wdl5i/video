package com.monitor.video.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitor.video.vo.RestResult;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.HandlerMethod;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import java.lang.reflect.Method;

public class SecurityInterceptor extends HandlerInterceptorAdapter {

    private static Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);
    private static ObjectMapper mapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

//        System.out.println("request.getRequestURI():" + request.getRequestURI());
        String auth = request.getHeader("auth");
        if (!StringUtils.isEmpty(auth)) {
            Claims claims = null;
            try {
                claims = JWTUtil.parseJWT(auth);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            if (claims != null) {
                return validate(claims, handler);
            }
        }

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");

        RestResult resultMsg = RestResult.buildResult(RestResult.Status.AUTH_ERROR, null);
        response.getWriter().write(mapper.writeValueAsString(resultMsg));
        return false;
    }

    private boolean validate(Claims claims, Object handler) {
        if (handler instanceof HandlerMethod) {
            HandlerMethod methodHandler = (HandlerMethod) handler;

            Class<?> clazz = methodHandler.getBeanType();
            Method m = methodHandler.getMethod();
        }
        return true;
    }
}