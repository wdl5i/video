/*
 Navicat MySQL Data Transfer

 Source Server         : localhost_root
 Source Server Type    : MySQL
 Source Server Version : 50716
 Source Host           : localhost
 Source Database       : video

 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : utf-8

 Date: 05/10/2018 18:44:43 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `facility`
-- ----------------------------
DROP TABLE IF EXISTS `facility`;
CREATE TABLE `facility` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `serial` varchar(255) DEFAULT NULL,
  `order_num` float DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `facility_grp`
-- ----------------------------
DROP TABLE IF EXISTS `facility_grp`;
CREATE TABLE `facility_grp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facility_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `grp`
-- ----------------------------
DROP TABLE IF EXISTS `grp`;
CREATE TABLE `grp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `order_num` float DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `resource`
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL,
  `order_num` float DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `resource`
-- ----------------------------
BEGIN;
INSERT INTO `resource` VALUES ('1', '用户管理', '/user/page', 'POST', '3', '1', null, null, '1'), ('2', '添加用户', '/user', 'POST', null, '0', null, '1', '1'), ('3', '修改用户', '/user', 'PUT', null, '0', null, '1', '1'), ('4', '删除用户', '/user', 'DELETE', null, '0', null, '1', '1'), ('5', '设备管理', '/facility/page', 'POST', '1', '1', null, null, '1'), ('6', '添加设备', '/facility', 'POST', null, '0', null, '5', '1'), ('7', '修改设备', '/facility', 'PUT', null, '0', null, '5', '1'), ('8', '删除设备', '/facility', 'DELETE', null, '0', null, '5', '1'), ('9', '设备组管理', '/group/page', 'POST', '2', '1', null, null, '1'), ('10', '添加组', '/group', 'POST', null, '0', null, '9', '1'), ('11', '修改组', '/group', 'PUT', null, '0', null, '9', '1'), ('12', '删除组', '/group', 'DELETE', null, '0', null, '9', '1'), ('13', '绑定用户设备组', '/group/userGroups', 'ALL', null, '0', null, '1', '1'), ('14', '绑定设备组与设备', '/group/groupFacilities', 'ALL', null, '0', null, '9', '1'), ('15', '权限管理', '/auth/page', 'ALL', '4', '1', null, null, '0');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `sex` varchar(5) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'admin', 'admin', '男', '028-123456', '1');
COMMIT;

-- ----------------------------
--  Table structure for `user_grp`
-- ----------------------------
DROP TABLE IF EXISTS `user_grp`;
CREATE TABLE `user_grp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user_resource`
-- ----------------------------
DROP TABLE IF EXISTS `user_resource`;
CREATE TABLE `user_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;


SET FOREIGN_KEY_CHECKS = 1;
