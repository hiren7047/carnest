-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 02:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carnest`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `car_id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `car_id`, `date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 137, '2026-04-06', 'confirmed', '2026-04-06 16:32:09', '2026-04-06 16:32:22'),
(2, 1, 145, '2026-04-06', 'pending', '2026-04-06 16:38:30', '2026-04-06 16:38:30');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `brand` varchar(120) NOT NULL,
  `model` varchar(120) NOT NULL,
  `year` smallint(5) UNSIGNED NOT NULL,
  `price` bigint(20) UNSIGNED NOT NULL,
  `fuel_type` varchar(60) NOT NULL,
  `transmission` varchar(60) NOT NULL,
  `km_driven` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `location` varchar(120) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `description` text NOT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `title`, `brand`, `model`, `year`, `price`, `fuel_type`, `transmission`, `km_driven`, `location`, `images`, `description`, `is_featured`, `created_at`, `updated_at`) VALUES
(137, 'MG Hector Sharp MT BS6', 'MG', 'Hector', 2023, 1350000, 'Diesel', 'Manual', 85000, 'Gujarat', '[\"/uploads/1775468049861-wt6ezuocb8i.jpg\",\"/uploads/1775468049877-ruv1sbrd9jo.jpg\",\"/uploads/1775468050186-l7q33penp1.jpg\",\"/uploads/1775468050191-7foecm2md0i.jpg\",\"/uploads/1775468050194-p47jbkmokoo.jpg\"]', 'Reg: GJ27 · Colour: Starry Black · Mfg year 2022, reg. March.\n1st owner · Insurance Feb 2027 (full) · 2 keys.\nFeatures: push button start, navigation, reverse & 360° cameras, cruise control, wireless charger, ventilated & electric seats, panoramic sunroof, alloy wheels, brand new tyres.\nCompany service record available. Next-to-new condition.', 1, '2026-04-06 14:49:21', '2026-04-06 15:04:13'),
(138, 'Hyundai Alcazar Platinum (O) 7-Seater', 'Hyundai', 'Alcazar', 2022, 1390000, 'Diesel', 'Automatic', 70000, 'Gujarat', '[\"/uploads/alcazar/IMG-20260406-WA0029.jpg\",\"/uploads/alcazar/IMG-20260406-WA0021.jpg\",\"/uploads/alcazar/IMG-20260406-WA0022.jpg\",\"/uploads/alcazar/IMG-20260406-WA0023.jpg\",\"/uploads/alcazar/IMG-20260406-WA0024.jpg\",\"/uploads/alcazar/IMG-20260406-WA0025.jpg\",\"/uploads/alcazar/IMG-20260406-WA0026.jpg\",\"/uploads/alcazar/IMG-20260406-WA0027.jpg\",\"/uploads/alcazar/IMG-20260406-WA0028.jpg\",\"/uploads/alcazar/IMG-20260406-WA0030.jpg\",\"/uploads/alcazar/IMG-20260406-WA0031.jpg\",\"/uploads/alcazar/IMG-20260406-WA0032.jpg\",\"/uploads/alcazar/IMG-20260406-WA0033.jpg\",\"/uploads/alcazar/IMG-20260406-WA0034.jpg\",\"/uploads/alcazar/IMG-20260406-WA0035.jpg\",\"/uploads/alcazar/IMG-20260406-WA0036.jpg\",\"/uploads/alcazar/IMG-20260406-WA0037.jpg\",\"/uploads/alcazar/IMG-20260406-WA0038.jpg\"]', 'Reg: GJ02DM1483 · White · Jan registration.\n1st owner · Insurance Dec 2026 (full) · 2 keys.\nPush button, navigation, 360° camera, cruise control, panoramic sunroof, wireless charger, alloy wheels.\nNext-to-new condition.', 1, '2026-04-06 14:49:21', '2026-04-06 16:20:28'),
(139, 'Kia Seltos GTX+ Diesel AT', 'Kia', 'Seltos', 2020, 1275000, 'Diesel', 'Automatic', 75000, 'Gujarat', '[\"/uploads/kia%20seltos/IMG-20260406-WA0041.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0039.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0040.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0042.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0043.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0044.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0045.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0046.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0047.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0048.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0049.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0050.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0051.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0052.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0053.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0054.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0055.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0065.jpg\",\"/uploads/kia%20seltos/IMG-20260406-WA0067.jpg\"]', 'Reg: GJ-27 · White · GTX+ Auto.\n1st owner · Insurance valid to 22 Sep 2026 (full) · 2 keys.\nAll new tyres. Genuine km.', 1, '2026-04-06 14:49:21', '2026-04-06 16:21:11'),
(140, 'Hyundai Creta SX (O) Diesel MT', 'Hyundai', 'Creta', 2021, 1390000, 'Diesel', 'Manual', 95000, 'Gujarat', '[\"/uploads/creta/IMG-20260406-WA0083.jpg\",\"/uploads/creta/IMG-20260406-WA0069.jpg\",\"/uploads/creta/IMG-20260406-WA0071.jpg\",\"/uploads/creta/IMG-20260406-WA0073.jpg\",\"/uploads/creta/IMG-20260406-WA0075.jpg\",\"/uploads/creta/IMG-20260406-WA0077.jpg\",\"/uploads/creta/IMG-20260406-WA0079.jpg\",\"/uploads/creta/IMG-20260406-WA0081.jpg\",\"/uploads/creta/IMG-20260406-WA0085.jpg\",\"/uploads/creta/IMG-20260406-WA0096.jpg\",\"/uploads/creta/IMG-20260406-WA0097.jpg\",\"/uploads/creta/IMG-20260406-WA0098.jpg\",\"/uploads/creta/IMG-20260406-WA0099.jpg\",\"/uploads/creta/IMG-20260406-WA0100.jpg\"]', 'Reg: GJ 27 · Black · SX(O) variant.\n1st owner · Insurance full (19 Sep 2026).\nAll new tyres · spare unused · 2nd key available. Genuine km.', 1, '2026-04-06 14:49:21', '2026-04-06 16:21:23'),
(141, 'Skoda Rapid Style Plus AT', 'Skoda', 'Rapid', 2019, 835000, 'Diesel', 'Automatic', 95000, 'Gujarat', '[\"/uploads/rapid/IMG-20260406-WA0103.jpg\",\"/uploads/rapid/IMG-20260406-WA0086.jpg\",\"/uploads/rapid/IMG-20260406-WA0087.jpg\",\"/uploads/rapid/IMG-20260406-WA0088.jpg\",\"/uploads/rapid/IMG-20260406-WA0089.jpg\",\"/uploads/rapid/IMG-20260406-WA0091.jpg\",\"/uploads/rapid/IMG-20260406-WA0093.jpg\",\"/uploads/rapid/IMG-20260406-WA0094.jpg\",\"/uploads/rapid/IMG-20260406-WA0095.jpg\",\"/uploads/rapid/IMG-20260406-WA0101.jpg\",\"/uploads/rapid/IMG-20260406-WA0102.jpg\",\"/uploads/rapid/IMG-20260406-WA0104.jpg\",\"/uploads/rapid/IMG-20260406-WA0105.jpg\",\"/uploads/rapid/IMG-20260406-WA0106.jpg\",\"/uploads/rapid/IMG-20260406-WA0107.jpg\",\"/uploads/rapid/IMG-20260406-WA0108.jpg\",\"/uploads/rapid/IMG-20260406-WA0109.jpg\",\"/uploads/rapid/IMG-20260406-WA0110.jpg\"]', 'Reg: GJ03 · White · Style Plus AT.\n1st owner · TP insurance 28 Feb 2027.\nAll new tyres · 2nd key available. Genuine km.', 1, '2026-04-06 14:49:21', '2026-04-06 16:20:56'),
(142, 'Tata Hexa XT Diesel', 'Tata', 'Hexa', 2017, 790000, 'Diesel', 'Manual', 62000, 'Gujarat', '[\"/uploads/tata%20hexa/IMG-20260406-WA0122.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0111.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0112.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0113.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0114.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0115.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0116.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0117.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0118.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0119.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0120.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0121.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0123.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0124.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0125.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0126.jpg\",\"/uploads/tata%20hexa/IMG-20260406-WA0127.jpg\"]', 'Reg: GJ01 · Golden · XT trim.\n1st owner · Full insurance.\nAll new tyres.', 1, '2026-04-06 14:49:21', '2026-04-06 16:20:47'),
(143, 'Hyundai Xcent S MT Petrol/CNG', 'Hyundai', 'Xcent', 2019, 491000, 'Petrol/CNG', 'Manual', 78000, 'Gujarat', '[\"/uploads/xcent/IMG-20260406-WA0128.jpg\",\"/uploads/xcent/IMG-20260406-WA0129.jpg\",\"/uploads/xcent/IMG-20260406-WA0130.jpg\",\"/uploads/xcent/IMG-20260406-WA0131.jpg\",\"/uploads/xcent/IMG-20260406-WA0136.jpg\",\"/uploads/xcent/IMG-20260406-WA0140.jpg\",\"/uploads/xcent/IMG-20260406-WA0142.jpg\",\"/uploads/xcent/IMG-20260406-WA0144.jpg\",\"/uploads/xcent/IMG-20260406-WA0146.jpg\",\"/uploads/xcent/IMG-20260406-WA0148.jpg\",\"/uploads/xcent/IMG-20260406-WA0150.jpg\",\"/uploads/xcent/IMG-20260406-WA0152.jpg\",\"/uploads/xcent/IMG-20260406-WA0153.jpg\",\"/uploads/xcent/IMG-20260406-WA0154.jpg\",\"/uploads/xcent/IMG-20260406-WA0155.jpg\"]', 'Reg: GJ05 · Grey · S MT · Petrol/CNG sequential.\n1st owner · Insurance: nil at listing · 2nd key available. Genuine km.', 1, '2026-04-06 14:49:21', '2026-04-06 14:57:17'),
(144, 'Jaguar XF 2.2L Diesel', 'Jaguar', 'XF', 2015, 1621000, 'Diesel', 'Automatic', 95500, 'Gujarat', '[\"/uploads/jaguar/IMG-20260406-WA0158.jpg\",\"/uploads/jaguar/IMG-20260406-WA0156.jpg\",\"/uploads/jaguar/IMG-20260406-WA0157.jpg\",\"/uploads/jaguar/IMG-20260406-WA0159.jpg\",\"/uploads/jaguar/IMG-20260406-WA0160.jpg\",\"/uploads/jaguar/IMG-20260406-WA0161.jpg\",\"/uploads/jaguar/IMG-20260406-WA0162.jpg\",\"/uploads/jaguar/IMG-20260406-WA0163.jpg\",\"/uploads/jaguar/IMG-20260406-WA0164.jpg\",\"/uploads/jaguar/IMG-20260406-WA0165.jpg\",\"/uploads/jaguar/IMG-20260406-WA0166.jpg\",\"/uploads/jaguar/IMG-20260406-WA0167.jpg\",\"/uploads/jaguar/IMG-20260406-WA0168.jpg\",\"/uploads/jaguar/IMG-20260406-WA0169.jpg\",\"/uploads/jaguar/IMG-20260406-WA0170.jpg\",\"/uploads/jaguar/IMG-20260406-WA0171.jpg\",\"/uploads/jaguar/IMG-20260406-WA0172.jpg\"]', 'Reg: GJ05-0515 · Black · XF 2.2L · July 2015.\n1st owner · Insurance: nil at listing.\nAll company service · ceramic coating · brand new tyres.', 1, '2026-04-06 14:49:21', '2026-04-06 16:20:38'),
(145, 'Mercedes-Benz C220d', 'Mercedes-Benz', 'C220d', 2023, 4575000, 'Diesel', 'Automatic', 8000, 'Gujarat', '[\"/uploads/mercedese/IMG-20260406-WA0173.jpg\",\"/uploads/mercedese/IMG-20260406-WA0174.jpg\",\"/uploads/mercedese/IMG-20260406-WA0175.jpg\",\"/uploads/mercedese/IMG-20260406-WA0176.jpg\",\"/uploads/mercedese/IMG-20260406-WA0177.jpg\",\"/uploads/mercedese/IMG-20260406-WA0178.jpg\",\"/uploads/mercedese/IMG-20260406-WA0179.jpg\",\"/uploads/mercedese/IMG-20260406-WA0180.jpg\",\"/uploads/mercedese/IMG-20260406-WA0181.jpg\",\"/uploads/mercedese/IMG-20260406-WA0182.jpg\",\"/uploads/mercedese/IMG-20260406-WA0183.jpg\",\"/uploads/mercedese/IMG-20260406-WA0184.jpg\",\"/uploads/mercedese/IMG-20260406-WA0185.jpg\",\"/uploads/mercedese/IMG-20260406-WA0186.jpg\",\"/uploads/mercedese/IMG-20260406-WA0187.jpg\",\"/uploads/mercedese/IMG-20260406-WA0188.jpg\",\"/uploads/mercedese/IMG-20260406-WA0189.jpg\",\"/uploads/mercedese/IMG-20260406-WA0190.jpg\"]', 'Reg: GJ05 · Mojave Silver · Nov 2023.\n1st owner · Insurance running.\nAll company service · ceramic coating · brand new tyres. Genuine km.', 1, '2026-04-06 14:49:21', '2026-04-06 14:57:17');

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

CREATE TABLE `contact_inquiries` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_cars`
--

CREATE TABLE `saved_cars` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `car_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_cars`
--

INSERT INTO `saved_cars` (`id`, `user_id`, `car_id`, `created_at`, `updated_at`) VALUES
(1, 1, 145, '2026-04-06 16:36:16', '2026-04-06 16:36:16');

-- --------------------------------------------------------

--
-- Table structure for table `sell_requests`
--

CREATE TABLE `sell_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `car_details` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `status` enum('pending','contacted','closed') NOT NULL DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `content`, `created_at`, `updated_at`) VALUES
(1, '{\"hero\":{\"eyebrow\":\"India\'s Premium Car Marketplace\",\"headlineLines\":[\"Driven by Trust.\",\"Defined by Quality.\"],\"subheadline\":\"Find Your Perfect Premium Ride\",\"heroImageUrl\":\"\",\"primaryCtaLabel\":\"Browse Cars\",\"primaryCtaHref\":\"/cars\",\"secondaryCtaLabel\":\"Sell Your Car\",\"secondaryCtaHref\":\"/sell\"},\"testimonials\":{\"sectionTitle\":\"What Our Customers Say\",\"items\":[{\"name\":\"Rahul Sharma\",\"city\":\"Mumbai\",\"rating\":5,\"text\":\"Bought my BMW 5 Series from Carnest. The process was seamless, and the car was exactly as described. Truly premium experience!\"},{\"name\":\"Priya Menon\",\"city\":\"Bangalore\",\"rating\":5,\"text\":\"Sold my Audi through Carnest and got the best price in the market. Their inspection team is top-notch.\"},{\"name\":\"Vikram Singh\",\"city\":\"Delhi\",\"rating\":5,\"text\":\"The financing options made it easy to afford my dream Porsche Macan. Incredible customer service throughout.\"}]},\"contact\":{\"whatsappNumber\":\"919876543210\",\"supportEmail\":\"\"}}', '2026-04-06 13:43:05', '2026-04-06 13:43:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Khiren39', 'khiren39@gmail.com', '$2b$12$DrUcvYN9WpVz0yu9QUg3k.a27u4nO7yc3vaG.Jan.kDO/H4VMA/r2', 'admin', '2026-04-06 13:34:22', '2026-04-06 13:40:25'),
(2, 'Carnest Admin', 'admin@carnest.com', '$2b$12$btE1FUTfst99r4nkV4QsveqN2Ssm5937oLcaHMQuVRwgk8fHJzdcK', 'admin', '2026-04-06 13:43:05', '2026-04-06 13:43:05'),
(3, 'Rahul Verma', 'rahul@demo.com', '$2b$12$WyEp4wkWHWHu/8wtKAR1tuGzHxYcuqAR10LcSigVyI5SBNBCuBcNS', 'user', '2026-04-06 13:44:06', '2026-04-06 13:44:06'),
(4, 'Sneha Patel', 'sneha@demo.com', '$2b$12$SNfjDOpthXjWq1OHoiYITer.jr03e0pI3f9fhT.wA4M/gyIQqHIPO', 'user', '2026-04-06 13:44:07', '2026-04-06 13:44:07'),
(5, 'Vikram Singh', 'vikram@demo.com', '$2b$12$VPIunfZx2OMTV.h8GDTf/.OpJ3G2Nbly1amoJcPFUSwNSgMhty22a', 'user', '2026-04-06 13:44:07', '2026-04-06 13:44:07'),
(6, 'Ananya Iyer', 'ananya@demo.com', '$2b$12$3pC.22bxvBYUoIHGs7luvO7Rh0EBphRwrID7.FIeRrGpjDtClzM.6', 'user', '2026-04-06 13:44:08', '2026-04-06 13:44:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saved_cars`
--
ALTER TABLE `saved_cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_cars_user_id_car_id` (`user_id`,`car_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `sell_requests`
--
ALTER TABLE `sell_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saved_cars`
--
ALTER TABLE `saved_cars`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sell_requests`
--
ALTER TABLE `sell_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_32` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `saved_cars`
--
ALTER TABLE `saved_cars`
  ADD CONSTRAINT `saved_cars_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saved_cars_ibfk_40` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
