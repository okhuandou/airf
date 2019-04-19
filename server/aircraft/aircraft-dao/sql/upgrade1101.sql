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



