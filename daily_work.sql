-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2020 at 11:22 AM
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
(1, 1, 'Backend Developer - Senior', 1),
(2, 1, 'Project Leader', 1),
(3, 4, 'Frontend Developer - Junior', 1),
(5, 1, 'Quality Assurance', 1),
(6, 4, 'Support Engineer', 1),
(7, 1, 'Project Leader', 3),
(8, 4, 'Quality Assurance', 3);

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
(1, 1, 1),
(2, 2, 2),
(3, 3, 1),
(5, 5, 7),
(6, 6, 7),
(7, 7, 5),
(8, 7, 6),
(9, 8, 6);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `message` text NOT NULL,
  `file` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender`, `receiver`, `message`, `file`) VALUES
(1, 4, 1, 'hello brother', NULL),
(2, 4, 1, 'K xa halkhabar', NULL),
(3, 1, 4, 'Hi man, mero thik xa ni, timro k xa ?', NULL),
(4, 4, 1, 'mero ni badiya xa. K gardai ho ta ?', NULL),
(5, 4, 1, 'sunan na, euta kura sodhna thyo!', NULL),
(6, 1, 4, 'vanana bro', NULL),
(7, 4, 1, 'nodejs ko application deploy garna aauxa timlai ?', NULL),
(8, 4, 2, 'Hello annata sir', NULL),
(9, 2, 4, 'Hello susan', NULL),
(10, 4, 2, 'Sir, I want to do some project, do you have any idea ?', NULL),
(11, 2, 4, 'Yes, I do. ', NULL),
(12, 4, 2, 'Can you please give me some idea about it?', NULL),
(13, 2, 4, 'What about working on blood donation application ?', NULL),
(14, 4, 2, 'Sounds cool, Can you give me the details ?', NULL),
(15, 2, 4, 'Yes, email me with proper header.', NULL),
(16, 4, 2, 'Okay sir', NULL),
(17, 2, 4, 'Cool', NULL),
(18, 4, 2, 'Email already sent to you', NULL),
(19, 2, 4, 'Okay, I will check it', NULL),
(20, 4, 2, 'Do it fast', NULL),
(21, 4, 2, 'I am waiting sir', NULL),
(22, 2, 4, 'I already replied to you', NULL),
(23, 2, 4, 'check email', NULL),
(24, 4, 2, 'Got it. Thank you', NULL),
(27, 4, 2, 'Hello ', NULL),
(28, 4, 2, 'Hello sir', NULL),
(29, 2, 4, 'Yes', NULL),
(30, 4, 2, 'K xa khabar', NULL),
(31, 4, 2, 'thikai xa', NULL),
(32, 2, 1, 'Hello tilak', NULL),
(33, 2, 1, 'How are you ?', NULL),
(34, 2, 4, 'K xa susan halkhabar ?', NULL),
(35, 4, 2, 'thikai xa ', NULL),
(36, 4, 2, 'sir', NULL),
(37, 4, 2, 'Hajur k gardai hunuhunxa ?', NULL),
(38, 4, 2, 'k xa oi', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message_notification`
--

CREATE TABLE `message_notification` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `sender` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `message_notification`
--

INSERT INTO `message_notification` (`id`, `title`, `sender`, `receiver`, `seen`) VALUES
(1, 'Hello sir', 4, 2, 1),
(2, 'Yes', 2, 4, 1),
(3, 'K xa khabar', 4, 2, 1),
(4, 'thikai xa', 4, 2, 1),
(5, 'aru k hudai xa', 2, 4, 1),
(6, 'Hello susan bro', 1, 4, 1),
(7, 'Hello tilak', 2, 1, 0),
(8, 'How are you ?', 2, 1, 0),
(9, 'K xa susan halkhabar ?', 2, 4, 1),
(10, 'thikai xa ', 4, 2, 1),
(11, 'sir', 4, 2, 1),
(12, 'Hajur k gardai hunuhunxa ?', 4, 2, 1),
(13, 'k xa oi', 4, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT 0,
  `type` varchar(10) NOT NULL,
  `notify_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `seen`, `type`, `notify_id`, `user_id`) VALUES
(1, 'Generate Receipts', 0, 'i', 5, 1),
(2, 'Visit Client office', 0, 'i', 6, 1),
(3, 'Visit Client office', 1, 'i', 6, 4),
(4, 'Visit Client office', 0, 'co', 6, 1),
(5, 'I am commenting this to check for the notification system in issue reply', 1, 'ir', 7, 2),
(6, 'I am commenting this to check for the notification system in issue reply', 1, 'ir', 7, 4),
(7, 'This is followback comment', 1, 'ir', 7, 2),
(8, 'This is followback comment', 1, 'ir', 7, 4),
(9, 'this is followback comment for notification testing', 1, 'ir', 7, 2),
(10, 'this is followback comment for notification testing', 1, 'ir', 7, 4),
(11, 'I think i am doing this write but don\'t know why getting error all the time.', 1, 'ir', 7, 2),
(12, 'I think i am doing this write but don\'t know why getting error all the time.', 1, 'ir', 7, 4),
(13, 'mike testing mike testing', 1, 'ir', 7, 2),
(14, 'mike is not testing', 1, 'ir', 7, 4),
(15, 'sachai hora', 1, 'ir', 7, 2),
(16, 'sachai hora', 1, 'ir', 7, 4),
(17, 'ho ni yaaar', 1, 'ir', 7, 2),
(18, 'ho ni yaaar', 1, 'ir', 7, 4),
(19, 'ho ni yaaar', 0, 'ir', 7, 1),
(20, 'delete this comment bro', 1, 'ir', 7, 4),
(21, 'delete this comment bro', 0, 'ir', 7, 1),
(22, 'ma ferri aaye', 1, 'ir', 7, 4),
(23, 'ma ferri aaye', 0, 'ir', 7, 1);

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
(4, 'Hotel Booking System', 'ReactJs', 'Laravel / PHP', 'Use .flex-shrink-* utilities to toggle a flex item’s ability to shrink if necessary. In the example below, the second flex item with .flex-shrink-1 is forced to wrap it’s contents to a new line, “shrinking” to allow more space for the previous flex item with .w-100.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `projects_todo`
--

CREATE TABLE `projects_todo` (
  `id` int(11) NOT NULL,
  `todo` text NOT NULL,
  `description` text NOT NULL,
  `file` text NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects_todo`
--

INSERT INTO `projects_todo` (`id`, `todo`, `description`, `file`, `project_id`, `user_id`, `owner_id`, `status`, `date_time`) VALUES
(1, 'Add project issue', 'Need to design project issue page for multiple issues of project.', '1586278824936-issue.png', 1, 2, 0, 2, '0000-00-00 00:00:00'),
(2, 'Add comment page', 'Need to add comment page for user and admin to update the issue progress and status.', '1586278824940-comment.png', 1, 2, 0, 1, '0000-00-00 00:00:00'),
(3, 'Change database design', 'Need to mofidy database for project issues additional features.', '', 1, 2, 0, 0, '0000-00-00 00:00:00'),
(4, 'Add search issue page', 'Need to design search issue page by various parameters.', '1586278824952-search.png', 1, 2, 0, 0, '0000-00-00 00:00:00'),
(5, 'Generate Receipts', 'We need to design a page to generate bills.', '', 3, 2, 0, 0, '2020-04-10 15:46:58'),
(6, 'Visit Client office', 'We need to go the client office for requirements gathering.', '', 3, 2, 1, 0, '2020-04-10 15:46:58'),
(7, 'Unit testing to login module', 'unit testing should be done in login module to test authentication', '', 1, 2, 4, 0, '2020-04-19 13:57:02');

-- --------------------------------------------------------

--
-- Table structure for table `project_status`
--

CREATE TABLE `project_status` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `project_status`
--

INSERT INTO `project_status` (`id`, `name`) VALUES
(0, 'stopped/completed'),
(1, 'ongoing');

-- --------------------------------------------------------

--
-- Table structure for table `todo_reply`
--

CREATE TABLE `todo_reply` (
  `id` int(11) NOT NULL,
  `projects_todo_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `file` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `todo_reply`
--

INSERT INTO `todo_reply` (`id`, `projects_todo_id`, `comment`, `file`, `user_id`, `date_time`) VALUES
(1, 1, 'this task need more time than assigned.', '1586361393598-issue.png', 2, '2020-04-08 21:41:33'),
(2, 1, 'This task is solved before the deadline. Now ready for QC team for testing.', '', 2, '2020-04-08 21:45:17'),
(3, 2, 'This is closed', '', 2, '2020-04-09 18:31:35'),
(4, 7, 'I am commenting this to check for the notification system in issue reply', '', 2, '2020-04-22 13:44:52'),
(6, 7, 'this is followback comment for notification testing', '', 2, '2020-04-22 13:50:54'),
(7, 7, 'I think i am doing this write but don\'t know why getting error all the time.', '', 2, '2020-04-22 13:54:34'),
(8, 7, 'mike testing mike testing', '', 2, '2020-04-22 13:58:23'),
(9, 7, 'sachai hora', '', 2, '2020-04-22 13:59:34'),
(10, 7, 'ho ni yaaar', '', 2, '2020-04-22 14:00:06'),
(11, 7, 'delete this comment bro', '', 2, '2020-04-22 14:02:27'),
(12, 7, 'ma ferri aaye', '', 2, '2020-04-23 22:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `todo_status`
--

CREATE TABLE `todo_status` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `todo_status`
--

INSERT INTO `todo_status` (`id`, `name`) VALUES
(0, 'open'),
(1, 'closed'),
(2, 'resolved');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `skills` text NOT NULL,
  `password` text NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `designation`, `skills`, `password`, `role`, `status`) VALUES
(1, 'Tilak Poudel', 'poudell.tilakk@gmail.com', 'Laravel Developer', '', '$2a$10$LucVjtyYpwrRN2EQuRL6VutS.OBPnRnTCcaSK7C2XGHyp2NmbS.6C', 1, 1),
(2, 'Ananta Pandey', 'alwaysananta@gmail.com', 'Supervisor', '', '$2a$10$yS7bcOMMm/xMVjG6f3kdje9hXO7DQBV1r3aN9m/ojScNawVwAcXl2', 0, 1),
(3, 'Sagar Gharti', 'sagarchhetri981@gmail.com', 'NodeJs Developer', '', '$2a$10$s/k0orFsS9IoQJYP4TMQh.84D8C0TquQ9uIBqip1UODcPCyLiLNJm', 1, 0),
(4, 'Susan Neupane', 'susaneupane@gmail.com', 'Web Developer', '', '$2a$10$X8CEBVDhG9PveY6KrEK.fOOy5evG5olqQc9CByzQIsbchuF1WdZq.', 1, 1),
(5, 'Radhika Pokhrel', 'radhika@gmail.com', 'Intern', 'php, laravel https://www.essentialsql.com/get-ready-to-learn-sqlserver-18-how-to-use-the-except-operator/', '$2a$10$r3.ktJNzfj95Vt3fNItLtuvTjgK36FVOqhjMULcwsdt41iSrddWpm', 1, 1);

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
(11, 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.\r\n', '2020-03-25 17:45:21', 4),
(12, 'what', 'phhh', '2020-04-01 17:12:02', 4),
(13, 'rty', 'wqq', '2020-04-01 17:15:10', 4),
(14, 'this is just don', 'this is not done', '2020-04-01 17:19:26', 4);

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
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_notification`
--
ALTER TABLE `message_notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
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
-- Indexes for table `project_status`
--
ALTER TABLE `project_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `todo_reply`
--
ALTER TABLE `todo_reply`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `todo_status`
--
ALTER TABLE `todo_status`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assigned_todos`
--
ALTER TABLE `assigned_todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `message_notification`
--
ALTER TABLE `message_notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects_todo`
--
ALTER TABLE `projects_todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `todo_reply`
--
ALTER TABLE `todo_reply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
