-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2024 at 10:46 PM
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
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `text` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `taskId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `text`, `description`, `taskId`, `userId`, `date`) VALUES
('5vvw0ivclwgv34a2', '2', '2', '5vvw07islwguompw', '5vvw07islwguobug', '2024-05-21 20:42:33');

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
-- Dumping data for table `houses`
--

INSERT INTO `houses` (`id`, `ownerId`, `address`, `description`, `price`) VALUES
('5vvw07islwguoj4y', '5vvw07islwguobug', 'asdasd', '2', 2);

--
-- Triggers `houses`
--
DELIMITER $$
CREATE TRIGGER `WorkerHouseAfterHouseDeletion` AFTER DELETE ON `houses` FOR EACH ROW DELETE FROM workerhouse WHERE houseId = old.id
$$
DELIMITER ;
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
  `description` varchar(255) NOT NULL,
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
  `procent` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `taskName`, `houseId`, `procent`) VALUES
('5vvw07islwguompw', 'asdasd', '5vvw07islwguoj4y', '2'),
('5vvw0e7slwgv14zx', 'asdasd', '5vvw07islwguoj4y', '100');

--
-- Triggers `tasks`
--
DELIMITER $$
CREATE TRIGGER `CommentDeletionAfterTaskDeletion` AFTER DELETE ON `tasks` FOR EACH ROW DELETE FROM comments WHERE taskId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `WorkerTaskAfterTaskDeletion` AFTER DELETE ON `tasks` FOR EACH ROW DELETE FROM workertask WHERE taskId = old.id
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `worker`, `name`, `password`) VALUES
('5vvw07islwguobug', 0, 'User', '$2b$12$p4jmUp2dCvLhXDRDOteZXutyXY3TsBO03C2UyqxAxsx2AKNRFcLJy'),
('5vvw0d2klwfdu9nk', 1, 'Worker2', '$2b$12$zl9eryt1A4l30ZlB6wXdk.LoMavAHI7aayHdbyYzj3/CBzyi4lIiS'),
('5vvw0mclwe0y2cy', 1, 'Worker', '$2b$12$6opTjK9JTmb1ftV1Zne2SOjhJl9DbnxpwiGB9vStyl.DDnfMjPpR6');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `CommentAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM workertask WHERE userId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `WorkerHouseAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM workerhouse WHERE userId = old.id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `WorkerTaskAfterUserDeletion` AFTER DELETE ON `users` FOR EACH ROW DELETE FROM workertask WHERE userId = old.id
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
-- Table structure for table `workerhouse`
--

CREATE TABLE `workerhouse` (
  `userId` varchar(255) NOT NULL,
  `houseId` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `workerhouse`
--
DELIMITER $$
CREATE TRIGGER `WorkerTaskAfterWorkerHouseDeletion` AFTER DELETE ON `workerhouse` FOR EACH ROW DELETE FROM workertask WHERE userId = old.userId
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `workertask`
--

CREATE TABLE `workertask` (
  `userId` varchar(255) NOT NULL,
  `taskId` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `workerhouse`
--
ALTER TABLE `workerhouse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workertask`
--
ALTER TABLE `workertask`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
