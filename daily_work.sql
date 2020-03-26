-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2020 at 10:58 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `daily_work`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_projects`
--

CREATE TABLE `assigned_projects` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assigned_projects`
--

INSERT INTO `assigned_projects` (`id`, `user_id`, `designation`, `project_id`) VALUES
(1, 4, 'Backend Developer - Junior', 1),
(2, 4, 'Quality Assurance', 2),
(3, 1, 'Backend Developer - Senior', 1),
(4, 4, 'Frontend Developer - Junior', 2);

-- --------------------------------------------------------

--
-- Table structure for table `assigned_todos`
--

CREATE TABLE `assigned_todos` (
  `id` int(11) NOT NULL,
  `assigned_projects_id` int(11) NOT NULL,
  `assigned_todo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assigned_todos`
--

INSERT INTO `assigned_todos` (`id`, `assigned_projects_id`, `assigned_todo`) VALUES
(1, 1, 50),
(2, 1, 52),
(3, 2, 53),
(5, 3, 50),
(6, 3, 51),
(8, 4, 54),
(9, 4, 55);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `frontend` varchar(255) NOT NULL,
  `backend` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `frontend`, `backend`, `details`, `status`) VALUES
(1, 'Employe Management System', 'Bootstrap / JavaScript', 'NodeJS', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 1),
(2, 'Daily Work Update', 'Bootstrap / JavaScript', 'NodeJS', '\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"', 1),
(3, 'Billing System', 'HTML / CSS', 'Laravel / PHP', 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus', 1),
(4, 'Hotel Booking System', 'ReactJs', 'Laravel / PHP', 'Use .flex-shrink-* utilities to toggle a flex item’s ability to shrink if necessary. In the example below, the second flex item with .flex-shrink-1 is forced to wrap it’s contents to a new line, “shrinking” to allow more space for the previous flex item with .w-100.', 0);'

-- --------------------------------------------------------

--
-- Table structure for table `projects_todo`
--

CREATE TABLE `projects_todo` (
  `id` int(11) NOT NULL,
  `todo` text NOT NULL,
  `project_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects_todo`
--

INSERT INTO `projects_todo` (`id`, `todo`, `project_id`, `status`) VALUES
(50, 'Project setup', 1, 0),
(51, 'Database design', 1, 0),
(52, 'Deploy on server', 1, 1),
(53, 'Collect user requirements', 2, 1),
(54, 'Meeting with client', 2, 0),
(55, 'Project assign to the developers', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `designation`, `password`, `role`, `status`) VALUES
(1, 'Tilak Poudel', 'poudell.tilakk@gmail.com', 'Laravel Developer', '$2a$10$LucVjtyYpwrRN2EQuRL6VutS.OBPnRnTCcaSK7C2XGHyp2NmbS.6C', 1, 1),
(2, 'Ananta Pandey', 'alwaysananta@gmail.com', 'Supervisor', '$2a$10$yS7bcOMMm/xMVjG6f3kdje9hXO7DQBV1r3aN9m/ojScNawVwAcXl2', 0, 1),
(3, 'Sagar Gharti', 'sagarchhetri981@gmail.com', 'NodeJs Developer', '$2a$10$s/k0orFsS9IoQJYP4TMQh.84D8C0TquQ9uIBqip1UODcPCyLiLNJm', 1, 0),
(4, 'Susan Neupane', 'susaneupane@gmail.com', 'Web Developer', '$2a$10$X8CEBVDhG9PveY6KrEK.fOOy5evG5olqQc9CByzQIsbchuF1WdZq.', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int(11) NOT NULL,
  `task_done` text NOT NULL,
  `task_to_do` text NOT NULL,
  `work_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `task_done`, `task_to_do`, `work_date`, `user_id`) VALUES
(3, 'I have done many things today', 'I have to do many things tomorrow', '2020-03-17 16:05:18', 1),
(4, 'I did nothing', 'Do nothing', '2020-03-18 13:54:51', 3),
(5, '1. Edit / Delete on Job\r\n2. CRUD on Project', '1. JWT for authentication', '2020-03-18 14:52:40', 4),
(6, 'Nothing to do', 'I will watch tutorial', '2020-03-22 11:19:08', 3),
(7, 'this is done task', 'this is todo task', '2020-03-24 09:25:20', 2),
(8, 'adsfsdfsdfsf', 'sdfsdfsdfsfsf', '2020-03-25 17:44:12', 4),
(9, 'adsadada\r\nadada\r\nadada\r\ndadasd\r\nadadsa\r\ndadada\r\nadsasda', 'adadad\r\nadasdasd\r\nadadasda\r\ndaasdasd\r\nadasdad\r\naadadasd\r\nadsadad', '2020-03-25 17:44:28', 4),
(10, 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', '2020-03-25 17:45:17', 4),
(11, 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', '2020-03-25 17:45:21', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_projects`
--
ALTER TABLE `assigned_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assigned_todos`
--
ALTER TABLE `assigned_todos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects_todo`
--
ALTER TABLE `projects_todo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_projects`
--
ALTER TABLE `assigned_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `assigned_todos`
--
ALTER TABLE `assigned_todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects_todo`
--
ALTER TABLE `projects_todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_details`
--
ALTER TABLE `user_details`
  ADD CONSTRAINT `user_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
