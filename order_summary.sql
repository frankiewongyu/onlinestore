-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 10 月 27 日 06:59
-- 伺服器版本： 10.4.28-MariaDB
-- PHP 版本： 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `paper_palette`
--

-- --------------------------------------------------------

--
-- 資料表結構 `order_summary`
--

CREATE TABLE `order_summary` (
  `id` int(6) UNSIGNED NOT NULL,
  `total_items` int(6) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `order_summary`
--

INSERT INTO `order_summary` (`id`, `total_items`, `total_price`, `created_at`) VALUES
(11, 38, 3420.00, '2024-10-26 12:30:33'),
(12, 2, 220.00, '2024-10-26 12:42:39'),
(13, 6, 580.00, '2024-10-26 12:45:16'),
(14, 3, 270.00, '2024-10-26 13:15:25'),
(15, 1, 90.00, '2024-10-27 04:46:51');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `order_summary`
--
ALTER TABLE `order_summary`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_summary`
--
ALTER TABLE `order_summary`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
