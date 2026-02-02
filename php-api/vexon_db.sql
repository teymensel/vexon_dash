-- Vexon Dash Database Structure
CREATE DATABASE IF NOT EXISTS `vexon_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vexon_db`;

-- Guild Settings Table
CREATE TABLE IF NOT EXISTS `guild_settings` (
    `guild_id` VARCHAR(100) NOT NULL,
    `modules` LONGTEXT DEFAULT NULL COMMENT 'JSON stored as text',
    `config` LONGTEXT DEFAULT NULL COMMENT 'JSON stored as text',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
