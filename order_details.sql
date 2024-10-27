-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 10 月 27 日 07:00
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
-- 資料表結構 `order_details`
--

CREATE TABLE `order_details` (
  `id` int(6) UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `address1` varchar(50) NOT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `region` varchar(30) NOT NULL,
  `area` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL,
  `contact` int(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `order_details`
--

INSERT INTO `order_details` (`id`, `email`, `first_name`, `last_name`, `address1`, `address2`, `region`, `area`, `district`, `contact`, `created_at`) VALUES
(7, 'dsds@dsmdi.com', 'sa', 'dsds', 'dsd', 'dsd', 'dsd', 'dsd', 'dsd', 45455, '2024-10-26 12:30:32'),
(8, 'ssaa@dfd.com', 'sds', 'dsd', 'dsd', 'ds', 'sdssd', 'dsd', 'sds', 454, '2024-10-26 12:42:39'),
(9, 'dsd@fdfdf.com', 'dsds', 'dsd', 'dsd', 'dsd', 'dsd', 'dsd', 'dsd', 3434, '2024-10-26 12:45:16'),
(10, 'fdfd@gamil.com', 'wewe', 'ewe', 'ewe', 'ewe', 'ewe', 'ewe', 'ewe', 545454, '2024-10-26 13:15:24'),
(11, 'fdf@fdfd.com', 'sf', 'fdf', 'fdfd', '', 'fdf', 'fdf', 'fd', 434343, '2024-10-27 04:46:51');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
