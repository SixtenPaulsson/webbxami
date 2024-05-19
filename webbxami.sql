-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2024 at 05:44 PM
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
-- Database: `webbxami`
--

-- --------------------------------------------------------

--
-- Table structure for table `houses`
--

CREATE TABLE `houses` (
  `id` varchar(255) NOT NULL,
  `ownerId` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` varchar(256) NOT NULL DEFAULT 'Ingen beskrivning',
  `price` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `houses`
--
DELIMITER $$
CREATE TRIGGER `suggestionAfterHouseDeletion` AFTER DELETE ON `houses` FOR EACH ROW DELETE FROM suggestions WHERE houseId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `taskAfterHouseDeletion` AFTER DELETE ON `houses` FOR EACH ROW DELETE FROM tasks WHERE houseId = old.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `id` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `text` varchar(255) NOT NULL,
  `houseId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `taskName` varchar(255) NOT NULL,
  `houseId` varchar(255) NOT NULL,
  `procent` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `tasks`
--
DELIMITER $$
CREATE TRIGGER `UserTaskAfterTaskDeletion` AFTER DELETE ON `tasks` FOR EACH ROW DELETE FROM usertask WHERE taskId = old.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `worker` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `UserTaskAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM usertask WHERE userId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `houseAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM houses WHERE ownerId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `suggestionAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM suggestions WHERE userId = old.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `usertask`
--

CREATE TABLE `usertask` (
  `userId` varchar(255) NOT NULL,
  `taskId` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `address` (`address`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `usertask`
--
ALTER TABLE `usertask`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
