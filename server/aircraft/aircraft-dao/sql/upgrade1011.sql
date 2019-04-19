ALTER TABLE `sign_cfg`
ADD COLUMN `item_id2`  int(11) NULL AFTER `item_num`,
ADD COLUMN `item_num2`  int(11) NULL AFTER `item_id2`;

CREATE TABLE `user_share_help` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_user_id` int(11) DEFAULT '0',
  `friend_headimg` varchar(255) DEFAULT NULL,
  `friend_name` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_item` (
  `user_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `num` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

