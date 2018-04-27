package com.monitor.video.util;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebSecurityConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration addInterceptor = registry.addInterceptor(new SecurityInterceptor());

     //       排除配置
        addInterceptor.excludePathPatterns("/error");
        addInterceptor.excludePathPatterns("/user/login");
        addInterceptor.excludePathPatterns("/user/1");

        // 拦截配置
        //addInterceptor.addPathPatterns("/**");
    }
}