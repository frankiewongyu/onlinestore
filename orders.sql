-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 10 月 31 日 01:36
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
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address1` varchar(255) NOT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `region` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `total_items` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`id`, `email`, `first_name`, `last_name`, `address1`, `address2`, `region`, `area`, `district`, `contact`, `payment_method`, `total_items`, `total_price`, `order_date`) VALUES
(1, 'sas@dsd.com', 'ewewe', 'wew', 'eweewe', 'wew', 'ewe', 'we', 'ewe', '45645646', 'bank-transfer', 10, 1060.00, '2024-10-30 15:11:14'),
(2, 'dsds@ddsd.com', 'dsdsd', 'dsds', 'dsd3434', 'dsd', 'dsds', 'ds', 'dsds', '34343434', 'Not specified', 2, 180.00, '2024-10-31 05:33:42'),
(3, 'fdfdf@fdfd.com', 'fdf', 'fdf', 'dfddsds', 'fdfd', 'fdfd', 'fdf', 'dfd', '45454545', 'fps', 6, 630.00, '2024-10-31 08:35:12');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
