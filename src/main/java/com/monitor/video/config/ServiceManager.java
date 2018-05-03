package com.monitor.video.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Configuration
public class ServiceManager {

    private static Logger logger = LoggerFactory.getLogger(ServiceManager.class);

    @PostConstruct
    public void initConstants() {
        logger.info("---------------------init method invoked----------------------");
    }

    @PreDestroy
    public void preDestroy() {
        logger.info("--------------------preDestroy method invoked----------------------");
    }
}
