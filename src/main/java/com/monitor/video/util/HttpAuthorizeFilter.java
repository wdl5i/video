package com.monitor.video.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.monitor.video.vo.RestResult;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;
import com.fasterxml.jackson.databind.ObjectMapper;

//@Component
//@WebFilter(urlPatterns = "/",filterName = "httpAuthorizeFilter")
public class HttpAuthorizeFilter implements Filter {


    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // TODO Auto-generated method stub  
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this,
                filterConfig.getServletContext());

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // TODO Auto-generated method stub  

        RestResult resultMsg;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String auth = httpRequest.getHeader("Authorization");
        if ((auth != null) && (auth.length() > 7)) {
            String HeadStr = auth.substring(0, 6).toLowerCase();
            if (HeadStr.compareTo("bearer") == 0) {

                auth = auth.substring(7, auth.length());
                Claims claims = null;
                try {
                    claims = JWTUtil.parseJWT(auth);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (claims != null) {
                    chain.doFilter(request, response);
                    return;
                }
            }
        }

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setCharacterEncoding("UTF-8");
        httpResponse.setContentType("application/json; charset=utf-8");
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ObjectMapper mapper = new ObjectMapper();

        resultMsg = RestResult.buildResult(RestResult.Status.AUTH_ERROR, null);
        httpResponse.getWriter().write(mapper.writeValueAsString(resultMsg));
        return;
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub  

    }
}  