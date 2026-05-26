-- Staff, monthly targets, and car sales (run once on existing carnest DB)

ALTER TABLE `cars`
  ADD COLUMN `listing_status` ENUM('available','sold','withdrawn') NOT NULL DEFAULT 'available' AFTER `is_featured`,
  ADD COLUMN `sold_at` DATETIME NULL DEFAULT NULL AFTER `listing_status`;

CREATE TABLE IF NOT EXISTS `staff_members` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `color` varchar(20) NOT NULL DEFAULT '#3b82f6',
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `staff_monthly_targets` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `staff_id` int(10) UNSIGNED NOT NULL,
  `year` smallint(5) UNSIGNED NOT NULL,
  `month` tinyint(3) UNSIGNED NOT NULL,
  `target_cars` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `target_revenue` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_month_unique` (`staff_id`,`year`,`month`),
  CONSTRAINT `staff_monthly_targets_staff_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff_members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `car_sales` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` int(10) UNSIGNED NOT NULL,
  `staff_id` int(10) UNSIGNED NOT NULL,
  `sale_price` bigint(20) UNSIGNED NOT NULL,
  `sold_at` datetime NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `car_sales_car_unique` (`car_id`),
  KEY `car_sales_staff_sold` (`staff_id`,`sold_at`),
  CONSTRAINT `car_sales_car_fk` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  CONSTRAINT `car_sales_staff_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff_members` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
