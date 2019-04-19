/*
Navicat MySQL Data Transfer

Source Server         : 192.168.1.87
Source Server Version : 50720
Source Host           : 192.168.1.87:3306
Source Database       : aircraft

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-01-16 18:03:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dict_cfg
-- ----------------------------
DROP TABLE IF EXISTS `dict_cfg`;
CREATE TABLE `dict_cfg` (
  `type` char(8) NOT NULL,
  `dict_key` varchar(32) NOT NULL,
  `value` varchar(1024) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type`,`dict_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for hero
-- ----------------------------
DROP TABLE IF EXISTS `hero`;
CREATE TABLE `hero` (
  `id` int(11) NOT NULL,
  `kind` tinyint(4) DEFAULT NULL,
  `sub_seq` tinyint(2) DEFAULT '1',
  `name` varchar(64) DEFAULT NULL,
  `access` tinyint(4) DEFAULT NULL,
  `access_param` int(11) DEFAULT NULL,
  `descr` varchar(64) DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `skill` tinyint(4) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `power_radix` decimal(8,2) DEFAULT NULL,
  `attack_speed_radix` decimal(8,2) DEFAULT NULL,
  `blood_radix` decimal(8,2) DEFAULT NULL,
  `init_power` int(11) DEFAULT NULL,
  `init_attack_speed` decimal(8,2) DEFAULT NULL,
  `init_blood` int(11) DEFAULT NULL,
  `init_armor` int(11) DEFAULT NULL,
  `ballistic` int(11) DEFAULT NULL,
  `power_need` int(11) DEFAULT NULL,
  `attack_speed_need` int(11) DEFAULT NULL,
  `blood_need` int(11) DEFAULT NULL,
  `power_need_incr` int(11) DEFAULT NULL,
  `attack_speed_need_incr` int(11) DEFAULT NULL,
  `blood_need_incr` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for names_set
-- ----------------------------
DROP TABLE IF EXISTS `names_set`;
CREATE TABLE `names_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4713 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for redpack_cfg
-- ----------------------------
DROP TABLE IF EXISTS `redpack_cfg`;
CREATE TABLE `redpack_cfg` (
  `id` int(11) NOT NULL,
  `type` tinyint(2) NOT NULL,
  `min` decimal(4,2) DEFAULT NULL,
  `max` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for share_lock
-- ----------------------------
DROP TABLE IF EXISTS `share_lock`;
CREATE TABLE `share_lock` (
  `id` int(11) NOT NULL,
  `lock_kind` int(11) DEFAULT NULL,
  `region_type` varchar(8) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  `week_start` tinyint(4) DEFAULT NULL,
  `week_end` tinyint(4) DEFAULT NULL,
  `time_start` tinyint(4) DEFAULT NULL,
  `time_end` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for share_lock_func
-- ----------------------------
DROP TABLE IF EXISTS `share_lock_func`;
CREATE TABLE `share_lock_func` (
  `lock_id` int(11) NOT NULL,
  `func` varchar(32) NOT NULL,
  `mode` char(1) NOT NULL,
  PRIMARY KEY (`lock_id`,`func`,`mode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sign_cfg
-- ----------------------------
DROP TABLE IF EXISTS `sign_cfg`;
CREATE TABLE `sign_cfg` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `descr` varchar(32) DEFAULT NULL,
  `item_num` int(11) DEFAULT NULL,
  `item_id2` int(11) DEFAULT NULL,
  `item_num2` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `kind` int(11) DEFAULT NULL,
  `name` char(50) DEFAULT NULL,
  `need` int(11) DEFAULT NULL,
  `trigger1` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `coin` int(11) DEFAULT NULL,
  `qzb` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_base
-- ----------------------------
DROP TABLE IF EXISTS `user_base`;
CREATE TABLE `user_base` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(64) NOT NULL,
  `unionid` varchar(64) DEFAULT '',
  `session_key` varchar(64) DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `img` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38453 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_game
-- ----------------------------
DROP TABLE IF EXISTS `user_game`;
CREATE TABLE `user_game` (
  `id` int(11) NOT NULL,
  `coin` int(11) DEFAULT NULL,
  `qzb` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `best_score` int(11) DEFAULT '0',
  `sign_num` int(11) DEFAULT '0' COMMENT '已签到天数',
  `sign_time` datetime DEFAULT NULL COMMENT '最后一天签到的时间',
  `best_score_modified_at` datetime DEFAULT NULL,
  `help_expire_at` datetime DEFAULT NULL,
  `help_counter` int(11) DEFAULT NULL,
  `invite_new_recv_at` datetime DEFAULT NULL,
  `invite_new_recv` tinyint(1) DEFAULT '0',
  `money` decimal(5,2) DEFAULT '0.00',
  `money_new_user` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_hero
-- ----------------------------
DROP TABLE IF EXISTS `user_hero`;
CREATE TABLE `user_hero` (
  `user_id` int(11) NOT NULL,
  `kind` tinyint(4) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `level` smallint(6) DEFAULT NULL,
  `power` int(11) DEFAULT NULL,
  `power_level` int(11) DEFAULT NULL,
  `attack_speed` decimal(8,2) DEFAULT NULL,
  `attack_speed_level` int(11) DEFAULT NULL,
  `blood` int(11) DEFAULT NULL,
  `blood_level` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`kind`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_item
-- ----------------------------
DROP TABLE IF EXISTS `user_item`;
CREATE TABLE `user_item` (
  `user_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `num` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_match
-- ----------------------------
DROP TABLE IF EXISTS `user_match`;
CREATE TABLE `user_match` (
  `user_id` int(11) NOT NULL,
  `friend_user_id` int(11) NOT NULL,
  `friend_name` varchar(50) DEFAULT NULL,
  `friend_headimg` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `success` tinyint(2) DEFAULT '0',
  `award` int(11) DEFAULT '0',
  `award_got` tinyint(4) DEFAULT '0',
  `hero_kind` tinyint(4) DEFAULT '1',
  `hero_seq` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`user_id`,`friend_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_share_award
-- ----------------------------
DROP TABLE IF EXISTS `user_share_award`;
CREATE TABLE `user_share_award` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_user_id` int(11) DEFAULT '0',
  `friend_headimg` varchar(255) DEFAULT NULL,
  `friend_name` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `is_recv` tinyint(2) DEFAULT '0',
  `recv_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_share_help
-- ----------------------------
DROP TABLE IF EXISTS `user_share_help`;
CREATE TABLE `user_share_help` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_user_id` int(11) DEFAULT '0',
  `friend_headimg` varchar(255) DEFAULT NULL,
  `friend_name` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `is_recv` tinyint(2) DEFAULT '0',
  `recv_at` datetime DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_share_new
-- ----------------------------
DROP TABLE IF EXISTS `user_share_new`;
CREATE TABLE `user_share_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_user_id` int(11) DEFAULT '0',
  `friend_headimg` varchar(255) DEFAULT NULL,
  `friend_name` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user_task
-- ----------------------------
DROP TABLE IF EXISTS `user_task`;
CREATE TABLE `user_task` (
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `is_complete` tinyint(1) NOT NULL,
  `is_receive` tinyint(1) NOT NULL,
  `curr_num` int(11) NOT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户任务';
