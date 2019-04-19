ALTER TABLE `user_game`
ADD COLUMN `invite_new_recv_at`  datetime NULL,
ADD COLUMN `invite_new_recv`  tinyint(1) NULL DEFAULT 0;

CREATE TABLE `user_share_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_user_id` int(11) DEFAULT '0',
  `friend_headimg` varchar(255) DEFAULT NULL,
  `friend_name` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

ALTER TABLE `user_share_award` ADD COLUMN `friend_user_id` int(11) NULL DEFAULT 0;