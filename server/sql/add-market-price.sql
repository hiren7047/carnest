-- Run once on existing MySQL/MariaDB databases (production uses sync alter off).
ALTER TABLE `cars` ADD COLUMN `market_price` BIGINT UNSIGNED NULL AFTER `price`;
