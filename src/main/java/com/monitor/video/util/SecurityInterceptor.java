package com.monitor.video.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitor.video.vo.Authority;
import com.monitor.video.vo.AuthorityType;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
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

        logger.info("preHandler:" + request.getRequestURI());
        boolean validate = false;
        Authority authority = validateAuthType(handler);
        if(authority != null && authority.value() == AuthorityType.NO_VALIDATE) {
            validate = true;
            return validate;
        } else {
            String auth = request.getHeader("auth");
            validate = validateClaims(auth, authority);
            if(validate)
                return true;
        }

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");

        RestResult resultMsg = RestResult.buildResult(RestResult.Status.UNAUTHORIZED, null);
        response.getWriter().write(mapper.writeValueAsString(resultMsg));
        return false;
    }

    private Authority validateAuthType(Object handler)  {
        Authority authority = null;
        HandlerMethod hm = (HandlerMethod) handler;
        Class<?> clazz = hm.getBeanType();
        Method m = hm.getMethod();
        try {
            if (clazz != null && m != null) {
                boolean isClzAnnotation = clazz.isAnnotationPresent(Authority.class);
                boolean isMethodAnnotation = m.isAnnotationPresent(Authority.class);
                // 如果方法和类声明中同时存在这个注解，那么方法中的会覆盖类中的设定。
                if (isMethodAnnotation) {
                    authority = m.getAnnotation(Authority.class);
                } else if (isClzAnnotation) {
                    authority = clazz.getAnnotation(Authority.class);
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return authority;
    }

    private boolean validateClaims(String auth, Authority authority) {

        if (!StringUtils.isEmpty(auth)) {
            Claims claims = null;
            try {
                claims = JWTUtil.parseJWT(auth);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            if (claims != null) {
                String userName = claims.get("user").toString();
                if(authority != null && authority.value() == AuthorityType.ADMIN && User.isAdmin(userName))
                    return true;
                else {
                    //TODO 需要验证权限
                    return true;
                }
            }
        }
        return false;
    }

}