ALTER TABLE `user_game`
ADD COLUMN `money`  decimal(5,2) NULL DEFAULT 0,
ADD COLUMN `money_new_user`  decimal(5,2) NULL DEFAULT 0 AFTER `money`;

CREATE TABLE `names_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `redpack_cfg` (
  `id` int(11) NOT NULL,
  `type` tinyint(2) NOT NULL,
  `min` decimal(4,2) DEFAULT NULL,
  `max` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
