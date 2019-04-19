ALTER TABLE `user_share_award` ADD COLUMN `recv_at`  datetime NULL;

ALTER TABLE `user_share_help`
ADD COLUMN `is_recv`  tinyint(2) NULL DEFAULT 0 AFTER `created_at`,
ADD COLUMN `recv_at`  datetime NULL DEFAULT NULL AFTER `is_recv`;
ALTER TABLE `user_share_help` ADD COLUMN `is_new`  tinyint(1) NULL DEFAULT 0;

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

CREATE TABLE `user_task` (
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `is_complete` tinyint(1) NOT NULL,
  `is_receive` tinyint(1) NOT NULL,
  `curr_num` int(11) NOT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户任务';


