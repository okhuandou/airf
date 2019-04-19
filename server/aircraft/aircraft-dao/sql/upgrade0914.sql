ALTER TABLE `hero` 
ADD COLUMN `power_need_incr` INT(11) NULL DEFAULT NULL AFTER `blood_need`,
ADD COLUMN `attack_speed_need_incr` INT(11) NULL DEFAULT NULL AFTER `power_need_incr`,
ADD COLUMN `blood_need_incr` INT(11) NULL DEFAULT NULL AFTER `attack_speed_need_incr`;
