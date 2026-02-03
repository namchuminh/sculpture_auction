-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2026 at 08:18 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sculpture_auction`
--

-- --------------------------------------------------------

--
-- Table structure for table `auctions`
--

CREATE TABLE `auctions` (
  `id` int(10) UNSIGNED NOT NULL,
  `sculpture_id` int(10) UNSIGNED NOT NULL,
  `seller_id` int(10) UNSIGNED NOT NULL,
  `start_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) NOT NULL,
  `bid_step` decimal(10,2) NOT NULL,
  `buy_now_price` decimal(10,2) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('SCHEDULED','OPEN','CLOSED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `winner_id` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`id`, `sculpture_id`, `seller_id`, `start_price`, `current_price`, `bid_step`, `buy_now_price`, `start_time`, `end_time`, `status`, `winner_id`, `createdAt`, `updatedAt`) VALUES
(2, 22, 1, 12195601.87, 99999999.99, 51315.62, 48309913.50, '2026-01-30 22:35:30', '2026-02-02 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-02-02 07:26:07'),
(3, 24, 1, 2503993.04, 13291541.61, 73643.24, 39850950.57, '2026-01-30 22:35:30', '2026-02-05 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(4, 5, 5, 15762625.68, 14670927.96, 151669.08, 26455283.48, '2026-01-29 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(5, 12, 5, 18275178.94, 5100469.56, 116920.29, 37517363.34, '2026-01-31 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(6, 13, 5, 8912431.08, 15015682.43, 258527.99, 23931989.31, '2026-01-29 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(7, 15, 5, 8128218.27, 8495776.88, 402355.75, NULL, '2026-01-31 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(8, 18, 5, 9243785.10, 7527111.50, 197605.07, NULL, '2026-01-30 22:35:30', '2026-02-07 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(9, 27, 5, 13592213.24, 11631314.95, 384498.39, 23086360.00, '2026-01-29 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(10, 9, 6, 15063485.08, 2910537.91, 84055.87, 46246892.77, '2026-01-31 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(11, 17, 6, 4303644.87, 2565751.86, 397945.63, NULL, '2026-01-30 22:35:30', '2026-02-03 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(12, 20, 6, 7151313.49, 7195194.77, 313050.85, 31237395.39, '2026-01-30 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(13, 25, 6, 14276003.98, 18735729.55, 321265.91, 22617910.07, '2026-01-31 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(14, 8, 7, 4380093.46, 19218240.76, 223773.10, 15881598.90, '2026-01-30 22:35:30', '2026-02-03 22:35:30', 'CLOSED', NULL, '2026-01-29 22:35:30', '2026-02-02 08:06:22'),
(15, 14, 7, 18845088.44, 15037363.67, 416288.84, NULL, '2026-01-29 22:35:30', '2026-02-04 22:35:30', 'CLOSED', NULL, '2026-01-29 22:35:30', '2026-02-02 08:08:47'),
(16, 23, 7, 10836831.02, 17889349.26, 473406.34, 28349660.32, '2026-01-29 22:35:30', '2026-02-02 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(17, 26, 7, 17575370.27, 99999999.99, 192709.90, NULL, '2026-01-29 22:35:30', '2026-02-05 22:35:30', 'CLOSED', 4, '2026-01-29 22:35:30', '2026-02-02 08:28:23'),
(18, 28, 7, 13967235.19, 7920843.00, 271166.89, 24181611.22, '2026-01-29 22:35:30', '2026-02-03 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-02-02 07:26:49'),
(19, 29, 7, 8096777.09, 15585785.10, 390964.87, 23916250.44, '2026-01-29 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(20, 6, 8, 10168846.92, 18134456.36, 104143.54, NULL, '2026-01-29 22:35:30', '2026-02-02 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(21, 7, 8, 15468310.64, 18727516.96, 230816.34, 46012499.33, '2026-01-31 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(22, 10, 8, 18807046.70, 5596254.34, 139003.30, 24175766.57, '2026-01-30 22:35:30', '2026-02-07 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(23, 11, 8, 19228758.26, 18658931.63, 390209.60, 40001057.38, '2026-01-31 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(24, 16, 9, 2246940.22, 15133931.79, 323220.97, NULL, '2026-01-30 22:35:30', '2026-02-04 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(25, 19, 9, 8724593.54, 7422346.73, 223448.84, 48443957.90, '2026-01-31 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07'),
(26, 21, 9, 15579151.62, 9132970.02, 373184.89, 44240356.79, '2026-01-29 22:35:30', '2026-02-06 22:35:30', 'OPEN', NULL, '2026-01-29 22:35:30', '2026-01-29 22:36:07');

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `id` int(10) UNSIGNED NOT NULL,
  `auction_id` int(10) UNSIGNED NOT NULL,
  `bidder_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('VALID','OUTBID','CANCELLED') NOT NULL DEFAULT 'VALID',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bids`
--

INSERT INTO `bids` (`id`, `auction_id`, `bidder_id`, `amount`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 3, 15500.00, 'OUTBID', '2026-01-21 18:29:31', '2026-01-21 11:48:53'),
(2, 1, 3, 17000.00, 'OUTBID', '2026-01-21 11:48:53', '2026-01-21 11:55:49'),
(3, 1, 3, 19000.00, 'OUTBID', '2026-01-21 11:55:49', '2026-01-26 17:09:38'),
(4, 1, 3, 20000.00, 'VALID', '2026-01-26 17:09:38', '2026-01-26 17:09:38'),
(5, 2, 4, 99999999.99, 'OUTBID', '2026-01-31 18:55:40', '2026-02-02 07:25:55'),
(6, 2, 4, 99999999.99, 'OUTBID', '2026-02-02 07:25:55', '2026-02-02 07:26:07'),
(7, 2, 4, 99999999.99, 'VALID', '2026-02-02 07:26:07', '2026-02-02 07:26:07'),
(8, 17, 4, 99999999.99, 'VALID', '2026-02-02 07:26:26', '2026-02-02 07:26:26'),
(9, 18, 4, 7920843.00, 'VALID', '2026-02-02 07:26:49', '2026-02-02 07:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `createdAt`, `updatedAt`) VALUES
(1, 'Gỗ (Wood)', 'Tác phẩm điêu khắc bằng gỗ.', '/uploads/1769699883126-688885191.jpg', '2026-01-21 09:59:34', '2026-01-29 15:18:03'),
(2, 'Gốm (Ceramic)', 'Tác phẩm gốm, men và tạo hình thủ công.', '/uploads/1769699946466-374494611.webp', '2026-01-29 22:09:33', '2026-01-29 15:19:06'),
(3, 'Tranh (Painting)', 'Tranh sơn dầu, acrylic, màu nước.', '/uploads/1769699995917-60665593.jpg', '2026-01-29 22:09:33', '2026-01-29 15:19:55'),
(4, 'Tượng (Sculpture)', 'Tượng và điêu khắc nhiều chất liệu.', '/uploads/1769700022086-784546089.jpg', '2026-01-29 22:09:33', '2026-01-29 15:20:22'),
(5, 'Đá (Stone)', 'Tác phẩm điêu khắc từ đá tự nhiên.', '/uploads/1769700056503-412546597.webp', '2026-01-29 22:09:33', '2026-01-29 15:20:56'),
(22, 'Kim loại (Metal)', 'Tác phẩm kim loại, hàn, đúc.', '/uploads/1769700071107-152051512.jpg', '2026-01-29 22:16:57', '2026-01-29 15:21:11'),
(23, 'Nhiếp ảnh (Photography)', 'Ảnh nghệ thuật, in giới hạn.', '/uploads/1769700096314-700223444.jpeg', '2026-01-29 22:16:57', '2026-01-29 15:21:36'),
(24, 'In ấn (Print)', 'Tranh in, khắc gỗ, lithography.', '/uploads/1769700116507-643930339.jpg', '2026-01-29 22:16:57', '2026-01-29 15:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Có lượt đặt giá mới', 'Phiên #1 vừa có bid mới.', 'NEW_BID', 1, '2026-01-21 11:48:53', '2026-02-02 07:24:51'),
(2, 2, 'Có lượt đặt giá mới', 'Phiên #1 vừa có bid mới.', 'NEW_BID', 1, '2026-01-21 11:55:49', '2026-02-02 07:24:51'),
(3, 2, 'Có lượt đặt giá mới', 'Phiên #1 vừa có bid mới.', 'NEW_BID', 1, '2026-01-26 17:09:39', '2026-02-02 07:24:51'),
(4, 3, 'Cập nhật trạng thái đơn hàng', 'Đơn #1 chuyển sang trạng thái COMPLETED.', 'ORDER_STATUS', 0, '2026-01-29 13:49:54', '2026-01-29 13:49:54'),
(5, 3, 'Cập nhật trạng thái đơn hàng', 'Đơn #1 chuyển sang trạng thái PENDING.', 'ORDER_STATUS', 0, '2026-01-29 13:49:57', '2026-01-29 13:49:57'),
(6, 1, 'Có lượt đặt giá mới', 'Phiên #2 vừa có bid mới.', 'NEW_BID', 0, '2026-01-31 18:55:40', '2026-01-31 18:55:40'),
(7, 1, 'Có lượt đặt giá mới', 'Phiên #2 vừa có bid mới.', 'NEW_BID', 0, '2026-02-02 07:25:55', '2026-02-02 07:25:55'),
(8, 1, 'Có lượt đặt giá mới', 'Phiên #2 vừa có bid mới.', 'NEW_BID', 0, '2026-02-02 07:26:07', '2026-02-02 07:26:07'),
(9, 7, 'Có lượt đặt giá mới', 'Phiên #17 vừa có bid mới.', 'NEW_BID', 1, '2026-02-02 07:26:26', '2026-02-02 07:31:03'),
(10, 7, 'Có lượt đặt giá mới', 'Phiên #18 vừa có bid mới.', 'NEW_BID', 1, '2026-02-02 07:26:49', '2026-02-02 07:31:02'),
(11, 4, 'Bạn đã thắng đấu giá', 'Phiên #17 đã kết thúc.', 'AUCTION_WON', 0, '2026-02-02 08:28:23', '2026-02-02 08:28:23'),
(12, 7, 'Phiên đấu giá đã kết thúc', 'Phiên #17 đã có người thắng.', 'AUCTION_CLOSED', 0, '2026-02-02 08:28:23', '2026-02-02 08:28:23');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `buyer_id` int(10) UNSIGNED NOT NULL,
  `auction_id` int(10) UNSIGNED NOT NULL,
  `sculpture_id` int(10) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `status` enum('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `buyer_id`, `auction_id`, `sculpture_id`, `total_amount`, `shipping_address`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 3, 1, 1, 16000.00, 'ABCDE', 'PENDING', '2026-01-21 17:50:26', '2026-01-29 13:49:57'),
(2, 4, 17, 26, 99999999.99, '', 'PENDING', '2026-02-02 08:28:23', '2026-02-02 08:28:23');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('COD','BANK_TRANSFER','CREDIT_CARD','OTHER') NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') NOT NULL DEFAULT 'PENDING',
  `transaction_code` varchar(100) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `sculpture_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `order_id`, `sculpture_id`, `user_id`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 3, 4, 'ổn', '2026-01-21 17:50:44', '2026-01-21 17:50:44');

-- --------------------------------------------------------

--
-- Table structure for table `sculptures`
--

CREATE TABLE `sculptures` (
  `id` int(10) UNSIGNED NOT NULL,
  `artist_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `year_created` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','SOLD') NOT NULL DEFAULT 'DRAFT',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sculptures`
--

INSERT INTO `sculptures` (`id`, `artist_id`, `category_id`, `title`, `description`, `material`, `dimensions`, `weight`, `year_created`, `image_url`, `status`, `createdAt`, `updatedAt`) VALUES
(5, 5, 1, 'Mộc Vân 01', 'Khối gỗ tối giản, nhấn vân tự nhiên.', 'Gỗ tự nhiên', '35x18x12 cm', 2.80, 2022, 'https://upload.wikimedia.org/wikipedia/commons/9/97/Kozienice_Palace_park_-_wooden_sculpture.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(6, 8, 1, 'Tĩnh Mộc 02', 'Tượng gỗ nhỏ, bề mặt chà nhám mịn.', 'Gỗ sồi', '28x16x10 cm', 2.10, 2021, 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Wooden_sculpture_01_by_Jozsef_Balint%2C_Hundsheim.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(7, 8, 1, 'Hình Khối 03', 'Tạo hình trừu tượng, cân bằng khối.', 'Gỗ thông', '40x22x15 cm', 3.40, 2023, 'https://upload.wikimedia.org/wikipedia/commons/8/87/Wooden_Sculpture_of_C%C3%BA_Chulainn_%28cropped%29.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(8, 7, 1, 'Vân Đạo 04', 'Đường cắt sắc, tương phản sáng tối.', 'Gỗ óc chó', '32x20x14 cm', 2.95, 2020, 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Vlkol%C3%ADnec_the_wooden_sculpture.JPG', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(9, 6, 1, 'Thớ Thở 05', 'Tác phẩm nhấn nhịp thớ gỗ chạy dọc.', 'Gỗ teak', '45x15x12 cm', 3.10, 2019, 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Wooden_sculpture_1.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(10, 8, 2, 'Men Lam 01', 'Gốm tạo hình thủ công, men xanh lam.', 'Gốm nung', '22x22x18 cm', 1.60, 2022, 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Ceramic_Vase_%2815428781445%29.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(11, 8, 2, 'Bình Hơi 02', 'Bề mặt men mờ, vệt chảy tự nhiên.', 'Gốm nung', '30x16x16 cm', 2.20, 2021, 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Vase_by_Chu_Dau_ceramic_2.JPG', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(12, 5, 2, 'Dáng Đứng 03', 'Khối gốm trừu tượng, nhấn đường cong.', 'Gốm', '26x14x12 cm', 1.85, 2023, 'https://upload.wikimedia.org/wikipedia/commons/4/49/Vase%E2%80%93_Ceramics_%2811th_%E2%80%93_12th_C%29%2C_Ceramics_of_Ly_Dynasty_%2811th_-_13th_c.%29_of_the_Museum_of_Vietnamese_History.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(13, 5, 2, 'Vệt Men 04', 'Hiệu ứng men rạn nhẹ, phối màu trung tính.', 'Gốm men', '24x20x14 cm', 1.70, 2020, 'https://upload.wikimedia.org/wikipedia/commons/7/77/Vase%2C_Bat_Trang_ceramic%2C_ivory_glaze_with_underglaze_motifs_-_Nguyen_dynasty%2C_19th_century_AD_-_Vietnam_National_Museum_of_Fine_Arts_-_Hanoi%2C_Vietnam_-_DSC05326.JPG', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(14, 7, 2, 'Hạt Đất 05', 'Chất đất thô, bề mặt nhám có hạt.', 'Gốm đất', '18x18x18 cm', 1.40, 2019, 'https://upload.wikimedia.org/wikipedia/commons/9/99/Ceramic_vase_-_Ayubbid_period.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(15, 5, 3, 'Sắc Độ 01', 'Bố cục tối giản, chuyển sắc mềm.', 'Acrylic trên canvas', '60x80 cm', NULL, 2023, 'https://upload.wikimedia.org/wikipedia/commons/6/65/Arise_by_Edgar_Medina.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(16, 9, 3, 'Phố Mưa 02', 'Không khí mưa, nét cọ nhanh.', 'Sơn dầu trên canvas', '70x90 cm', NULL, 2022, 'https://upload.wikimedia.org/wikipedia/commons/f/f4/%22Codes%22_Abstract_Watercolor_Painting_by_Bruce_Black_%282020%29.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(17, 6, 3, 'Tĩnh Vật 03', 'Tĩnh vật tông ấm, ánh sáng xiên.', 'Sơn dầu', '50x70 cm', NULL, 2021, 'https://upload.wikimedia.org/wikipedia/commons/9/90/%22Afterglow%22_by_Ray_L._Burggraf%2C_2005.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(18, 5, 3, 'Vệt Gió 04', 'Lớp màu mỏng, nhịp điệu đường nét.', 'Màu nước', '40x60 cm', NULL, 2020, 'https://upload.wikimedia.org/wikipedia/commons/5/55/Jungle_Arc.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(19, 9, 3, 'Đêm Xanh 05', 'Gam xanh sâu, tương phản điểm sáng.', 'Acrylic', '80x80 cm', NULL, 2019, 'https://upload.wikimedia.org/wikipedia/commons/d/d4/%22Sailboat_Disguise%22_by_Ray_L._Burggraf.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(20, 6, 4, 'Trừu Tượng 01', 'Khối tượng trừu tượng, bề mặt đánh bóng.', 'Composite', '55x20x18 cm', 4.90, 2022, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Abstract_sculpture_in_Malaga%2C_Spain.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(21, 9, 4, 'Dáng Người 02', 'Tượng bán thân cách điệu.', 'Thạch cao', '45x22x20 cm', 5.30, 2021, 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Abstract_Sculpture_Earlham_Centre_Norwich.JPG', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(22, 1, 4, 'Cân Bằng 03', 'Cấu trúc mô-đun, tạo thế cân bằng.', 'Nhựa resin', '60x18x18 cm', 3.80, 2023, 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Abstract_sculpture_-_geograph.org.uk_-_177454.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(23, 7, 4, 'Khối Sáng 04', 'Khối đặc, nhấn mặt phẳng và cạnh.', 'Bê tông mỹ thuật', '40x25x25 cm', 7.20, 2020, 'https://upload.wikimedia.org/wikipedia/commons/2/26/Abstract_sculpture_and_post_office%2C_2019_Veresegyh%C3%A1z.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(24, 1, 4, 'Nhịp 05', 'Đường cong liên tục, cảm giác chuyển động.', 'Composite', '50x16x14 cm', 4.10, 2019, 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Abstract_sculpture_by_K%C3%A1roly_Szekeres%2C_2018_Istv%C3%A1nmez%C5%91.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(25, 6, 5, 'Thạch 01', 'Điêu khắc đá, bề mặt mài mờ.', 'Đá granite', '30x18x16 cm', 9.80, 2022, 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Stone_Sculpture.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(26, 7, 5, 'Vân Đá 02', 'Nhấn vân tự nhiên, tạo hình tối giản.', 'Đá marble', '28x20x14 cm', 8.40, 2021, 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Stone_sculptures_YSP_-_geograph.org.uk_-_1395794.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(27, 5, 5, 'Khối Tĩnh 03', 'Khối đá nguyên bản, can thiệp tối thiểu.', 'Đá bazan', '35x22x18 cm', 11.20, 2023, 'https://upload.wikimedia.org/wikipedia/commons/3/39/Stone_sculpture_red_Main_sandstone_Yoshikuni_Iida_Gro%C3%9Fer_Tiergarten_Berlin_3v4.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(28, 7, 5, 'Đá Thở 04', 'Khoét rỗng tạo “nhịp thở” ánh sáng.', 'Đá marble', '32x18x18 cm', 9.10, 2020, 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Stone_Sculpture-_Hun_Intruder_Hoofed_by_a_Warhorse.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57'),
(29, 7, 5, 'Đường Nứt 05', 'Giữ vết nứt tự nhiên như điểm nhấn.', 'Đá granite', '26x16x12 cm', 7.60, 2019, 'https://upload.wikimedia.org/wikipedia/commons/0/08/Stone_Sculpture_Representing_The_Group_Of_Elephants%2C_Monkeys.jpg', 'PUBLISHED', '2026-01-29 22:14:50', '2026-01-29 23:16:57');

-- --------------------------------------------------------

--
-- Table structure for table `sculpture_images`
--

CREATE TABLE `sculpture_images` (
  `id` int(10) UNSIGNED NOT NULL,
  `sculpture_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role` enum('ADMIN','ARTIST','USER') NOT NULL DEFAULT 'USER',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `address`, `avatar_url`, `bio`, `role`, `is_active`, `createdAt`, `updatedAt`) VALUES
(1, 'user1@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'User One', NULL, NULL, NULL, NULL, 'ARTIST', 1, '2025-12-23 02:26:28', '2026-01-29 20:51:52'),
(2, 'admin@gmail.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Admin', NULL, NULL, NULL, NULL, 'ADMIN', 1, '2025-12-23 02:27:19', '2026-01-29 20:48:05'),
(3, 'khoai@gmail.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Khoai', '0333555666', 'Hà Nội', '/uploads/1768989326966-409650525.png', 'ABCDE', 'USER', 1, '2026-01-21 09:34:07', '2026-01-26 23:05:38'),
(4, 'tu1234@gmail.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Tú', NULL, NULL, NULL, NULL, 'USER', 1, '2026-01-26 14:21:57', '2026-01-26 14:21:57'),
(5, 'artist.minh.nguyen01@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Nguyễn Minh', '0901234561', 'Quận 1, TP.HCM', 'https://i.pravatar.cc/150?img=11', 'Nghệ sĩ điêu khắc đương đại.', 'ARTIST', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(6, 'artist.thao.tran02@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Trần Thảo', '0901234562', 'Quận 3, TP.HCM', 'https://i.pravatar.cc/150?img=12', 'Thực hành nghệ thuật sắp đặt.', 'ARTIST', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(7, 'artist.huy.le03@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Lê Huy', '0901234563', 'Hải Châu, Đà Nẵng', 'https://i.pravatar.cc/150?img=13', 'Tranh acrylic, tối giản.', 'ARTIST', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(8, 'artist.linh.pham04@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Phạm Linh', '0901234564', 'Cầu Giấy, Hà Nội', 'https://i.pravatar.cc/150?img=14', NULL, 'ARTIST', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(9, 'artist.quang.do05@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Đỗ Quang', '0901234565', NULL, NULL, 'Nhiếp ảnh và in khắc.', 'ARTIST', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(10, 'user.tuan.nguyen01@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Nguyễn Tuấn', '0912345671', 'Long Biên, Hà Nội', NULL, NULL, 'USER', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(11, 'user.ha.tran02@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Trần Hà', '0912345672', 'Ninh Kiều, Cần Thơ', NULL, 'Sưu tầm tranh.', 'USER', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(12, 'user.khanh.le03@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Lê Khánh', '0912345673', NULL, NULL, NULL, 'USER', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(13, 'user.my.pham04@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Phạm My', '0912345674', 'Bình Thạnh, TP.HCM', 'https://i.pravatar.cc/150?img=21', NULL, 'USER', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21'),
(14, 'user.nam.do05@example.com', '$2b$10$9B6zBWZnXc9SjYD9c5DQ7OpkoRKD6Rfw.0lp9Pupj1GZuLEhCMT/i', 'Đỗ Nam', '0912345675', 'Lê Chân, Hải Phòng', NULL, 'Thích đấu giá tác phẩm.', 'USER', 1, '2026-01-29 22:03:21', '2026-01-29 22:03:21');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `auction_id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `user_id`, `auction_id`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, '2026-01-21 12:27:47', '2026-01-21 12:27:47'),
(2, 3, 1, '2026-01-21 12:34:31', '2026-01-21 12:34:31'),
(3, 4, 1, '2026-01-26 15:39:02', '2026-01-26 15:39:02'),
(4, 5, 15, '2026-01-29 17:33:10', '2026-01-29 17:33:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_auctions_sculpture_id` (`sculpture_id`),
  ADD KEY `IDX_auctions_seller_id` (`seller_id`),
  ADD KEY `IDX_auctions_winner_id` (`winner_id`);

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_bids_auction_id` (`auction_id`),
  ADD KEY `IDX_bids_bidder_id` (`bidder_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_categories_name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_notifications_user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_orders_buyer_id` (`buyer_id`),
  ADD KEY `IDX_orders_auction_id` (`auction_id`),
  ADD KEY `IDX_orders_sculpture_id` (`sculpture_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_payments_order_id` (`order_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_reviews_order_id` (`order_id`),
  ADD KEY `IDX_reviews_sculpture_id` (`sculpture_id`),
  ADD KEY `IDX_reviews_user_id` (`user_id`);

--
-- Indexes for table `sculptures`
--
ALTER TABLE `sculptures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_sculptures_artist_id` (`artist_id`),
  ADD KEY `IDX_sculptures_category_id` (`category_id`);

--
-- Indexes for table `sculpture_images`
--
ALTER TABLE `sculpture_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sculpture_images_sculpture_id` (`sculpture_id`),
  ADD KEY `idx_sculpture_images_primary` (`sculpture_id`,`is_primary`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_users_email` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_watchlist_user_auction` (`user_id`,`auction_id`),
  ADD KEY `IDX_watchlist_auction_id` (`auction_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sculptures`
--
ALTER TABLE `sculptures`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `sculpture_images`
--
ALTER TABLE `sculpture_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auctions`
--
ALTER TABLE `auctions`
  ADD CONSTRAINT `FK_auctions_sculpture` FOREIGN KEY (`sculpture_id`) REFERENCES `sculptures` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_auctions_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_auctions_winner` FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `FK_bids_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_bids_bidder` FOREIGN KEY (`bidder_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_orders_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_orders_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_orders_sculpture` FOREIGN KEY (`sculpture_id`) REFERENCES `sculptures` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_reviews_sculpture` FOREIGN KEY (`sculpture_id`) REFERENCES `sculptures` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `sculptures`
--
ALTER TABLE `sculptures`
  ADD CONSTRAINT `FK_sculptures_artist` FOREIGN KEY (`artist_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_sculptures_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sculpture_images`
--
ALTER TABLE `sculpture_images`
  ADD CONSTRAINT `fk_sculpture_images_sculpture` FOREIGN KEY (`sculpture_id`) REFERENCES `sculptures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `FK_watchlist_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_watchlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
