ALTER TABLE `dict_cfg`
MODIFY COLUMN `value`  varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL AFTER `dict_key`;