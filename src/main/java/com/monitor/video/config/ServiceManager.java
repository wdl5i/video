package com.monitor.video.config;

import com.monitor.video.dao.TableDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Configuration
public class ServiceManager {

    @Autowired
    private TableDao tableDao;

    private static Logger logger = LoggerFactory.getLogger(ServiceManager.class);

    @PostConstruct
    public void initConstants() {
        tableUpdate();
        logger.info("---------------------init method invoked----------------------");
    }

    @PreDestroy
    public void preDestroy() {
        logger.info("--------------------preDestroy method invoked----------------------");
    }

    private void tableUpdate() {
        if(tableDao.tableNum("facility") > 0) {
            if (tableDao.columnExisted("ip_addr", "facility") > 0) {
                tableDao.deleteColumn("ip_addr", "facility");
                tableDao.addVarCharColumn("user_name", "facility");
            }
            if (tableDao.columnExisted("port", "facility") > 0) {
                tableDao.deleteColumn("port", "facility");
                tableDao.addVarCharColumn("password", "facility");
            }
        }
    }
}
