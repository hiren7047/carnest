-- Run once on existing MySQL/MariaDB databases (production uses sync alter off).
-- Adds typed, nullable car detail fields used by the rich Car Detail page + Admin form.
--
-- Safe to run on DBs that already have these columns? No: this script is not idempotent.
-- If you need idempotency, adapt with INFORMATION_SCHEMA checks per column.

ALTER TABLE `cars`
  ADD COLUMN `variant_name` VARCHAR(180) NULL AFTER `description`,
  ADD COLUMN `registration_year` SMALLINT UNSIGNED NULL AFTER `variant_name`,
  ADD COLUMN `registration_month` TINYINT UNSIGNED NULL AFTER `registration_year`,
  ADD COLUMN `owner_count` TINYINT UNSIGNED NULL AFTER `registration_month`,
  ADD COLUMN `color` VARCHAR(80) NULL AFTER `owner_count`,
  ADD COLUMN `body_type` VARCHAR(80) NULL AFTER `color`,
  ADD COLUMN `rto_city` VARCHAR(120) NULL AFTER `body_type`,

  ADD COLUMN `engine_cc` INT UNSIGNED NULL AFTER `rto_city`,
  ADD COLUMN `power_bhp` DECIMAL(6,1) NULL AFTER `engine_cc`,
  ADD COLUMN `torque_nm` DECIMAL(7,1) NULL AFTER `power_bhp`,
  ADD COLUMN `top_speed_kmph` SMALLINT UNSIGNED NULL AFTER `torque_nm`,
  ADD COLUMN `accel_0_100_sec` DECIMAL(4,1) NULL AFTER `top_speed_kmph`,
  ADD COLUMN `drivetrain` VARCHAR(40) NULL AFTER `accel_0_100_sec`,
  ADD COLUMN `seating_capacity` TINYINT UNSIGNED NULL AFTER `drivetrain`,
  ADD COLUMN `boot_space_l` SMALLINT UNSIGNED NULL AFTER `seating_capacity`,

  ADD COLUMN `battery_kwh` DECIMAL(6,1) NULL AFTER `boot_space_l`,
  ADD COLUMN `range_km` SMALLINT UNSIGNED NULL AFTER `battery_kwh`,
  ADD COLUMN `charging_time_ac` VARCHAR(120) NULL AFTER `range_km`,
  ADD COLUMN `charging_time_dc` VARCHAR(120) NULL AFTER `charging_time_ac`,

  ADD COLUMN `insurance_valid_till` VARCHAR(40) NULL AFTER `charging_time_dc`,
  ADD COLUMN `warranty_info` VARCHAR(500) NULL AFTER `insurance_valid_till`,
  ADD COLUMN `service_history` VARCHAR(500) NULL AFTER `warranty_info`,

  ADD COLUMN `sunroof` TINYINT(1) NOT NULL DEFAULT 0 AFTER `service_history`,
  ADD COLUMN `alloy_wheels` TINYINT(1) NOT NULL DEFAULT 0 AFTER `sunroof`,
  ADD COLUMN `led_headlamps` TINYINT(1) NOT NULL DEFAULT 0 AFTER `alloy_wheels`,
  ADD COLUMN `fog_lamps` TINYINT(1) NOT NULL DEFAULT 0 AFTER `led_headlamps`,
  ADD COLUMN `rear_camera` TINYINT(1) NOT NULL DEFAULT 0 AFTER `fog_lamps`,
  ADD COLUMN `parking_sensors` TINYINT(1) NOT NULL DEFAULT 0 AFTER `rear_camera`,

  ADD COLUMN `ventilated_seats` TINYINT(1) NOT NULL DEFAULT 0 AFTER `parking_sensors`,
  ADD COLUMN `leather_seats` TINYINT(1) NOT NULL DEFAULT 0 AFTER `ventilated_seats`,
  ADD COLUMN `ambient_lighting` TINYINT(1) NOT NULL DEFAULT 0 AFTER `leather_seats`,
  ADD COLUMN `digital_cluster` TINYINT(1) NOT NULL DEFAULT 0 AFTER `ambient_lighting`,

  ADD COLUMN `airbags_count` TINYINT UNSIGNED NULL AFTER `digital_cluster`,
  ADD COLUMN `abs` TINYINT(1) NOT NULL DEFAULT 0 AFTER `airbags_count`,
  ADD COLUMN `esc` TINYINT(1) NOT NULL DEFAULT 0 AFTER `abs`,
  ADD COLUMN `tpms` TINYINT(1) NOT NULL DEFAULT 0 AFTER `esc`,
  ADD COLUMN `adas` TINYINT(1) NOT NULL DEFAULT 0 AFTER `tpms`,

  ADD COLUMN `android_auto` TINYINT(1) NOT NULL DEFAULT 0 AFTER `adas`,
  ADD COLUMN `apple_carplay` TINYINT(1) NOT NULL DEFAULT 0 AFTER `android_auto`,
  ADD COLUMN `wireless_charging` TINYINT(1) NOT NULL DEFAULT 0 AFTER `apple_carplay`,
  ADD COLUMN `cruise_control` TINYINT(1) NOT NULL DEFAULT 0 AFTER `wireless_charging`,

  ADD COLUMN `emi_note` VARCHAR(300) NULL AFTER `cruise_control`;

