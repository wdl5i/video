package com.monitor.video.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitor.video.vo.Authority;
import com.monitor.video.vo.AuthorityType;
import com.monitor.video.vo.RestResult;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import java.lang.reflect.Method;

public class SecurityInterceptor extends HandlerInterceptorAdapter {

    private static Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);
    private static ObjectMapper mapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        System.out.println("preHandler:" + request.getRequestURI());
        boolean validate;
        validate = validateMethod(handler);
        if(validate) {
            String auth = request.getHeader("auth");
            validate = validateClaims(auth);
            if(validate)
                return true;
        }

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");

        RestResult resultMsg = RestResult.buildResult(RestResult.Status.AUTH_ERROR, null);
        response.getWriter().write(mapper.writeValueAsString(resultMsg));
        return false;
    }

    private boolean validateMethod(Object handler)  {
        HandlerMethod hm = (HandlerMethod) handler;

        Class<?> clazz = hm.getBeanType();
        Method m = hm.getMethod();
        try {
            if (clazz != null && m != null) {
                boolean isClzAnnotation = clazz.isAnnotationPresent(Authority.class);
                boolean isMethodAnnotation = m.isAnnotationPresent(Authority.class);
                Authority authority = null;
                // 如果方法和类声明中同时存在这个注解，那么方法中的会覆盖类中的设定。
                if (isMethodAnnotation) {
                    authority = m.getAnnotation(Authority.class);
                } else if (isClzAnnotation) {
                    authority = clazz.getAnnotation(Authority.class);
                }
                if (authority != null && AuthorityType.NO_VALIDATE == authority.value()) {
                    // 标记为不验证,放行
                    return true;
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return false;
    }

    private boolean validateClaims(String auth) {

        if (!StringUtils.isEmpty(auth)) {
            Claims claims = null;
            try {
                claims = JWTUtil.parseJWT(auth);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            if (claims != null) {

            }
        }
        return false;
    }
}