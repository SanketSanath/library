-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: localhost    Database: library
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book_tags`
--

DROP TABLE IF EXISTS `book_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `book_tags` (
  `isbn` varchar(20) NOT NULL,
  `tag` int(11) NOT NULL,
  KEY `isbn` (`isbn`),
  KEY `tag` (`tag`),
  CONSTRAINT `book_tags_ibfk_1` FOREIGN KEY (`isbn`) REFERENCES `books` (`isbn`),
  CONSTRAINT `book_tags_ibfk_2` FOREIGN KEY (`tag`) REFERENCES `tag_names` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_tags`
--

LOCK TABLES `book_tags` WRITE;
/*!40000 ALTER TABLE `book_tags` DISABLE KEYS */;
INSERT INTO `book_tags` VALUES ('14509',1),('34509',4),('34509',5),('34567',4),('34572',2);
/*!40000 ALTER TABLE `book_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `books` (
  `isbn` varchar(20) NOT NULL,
  `name` varchar(60) NOT NULL,
  `author` varchar(60) NOT NULL,
  `section` varchar(20) DEFAULT NULL,
  `sub_section` varchar(20) DEFAULT NULL,
  `url` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES ('14509','Concepts of Physics','H.C. Verma','3rd floor','2nd shelf',NULL),('34509','Higher Algorithm','D. Sharma','3rd floor','1st shelf',NULL),('34567','Intro to Programming','Kenatkar','ground floor','2nd shelf',NULL),('34572','Intro to Chemical Science','S. Mishra','First floor','3rd shelf',NULL),('677889','tyhj','jkhkj','1','1',NULL),('6789','Discrete Mathematics','A.J. Singh','4th Floor','5th Shelf',NULL);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrowed`
--

DROP TABLE IF EXISTS `borrowed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `borrowed` (
  `user_id` varchar(20) NOT NULL,
  `book_id` int(11) NOT NULL,
  `due_date` datetime NOT NULL,
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `borrowed_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `library_books` (`book_id`),
  CONSTRAINT `borrowed_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrowed`
--

LOCK TABLES `borrowed` WRITE;
/*!40000 ALTER TABLE `borrowed` DISABLE KEYS */;
INSERT INTO `borrowed` VALUES ('vishwas',467,'2019-02-02 00:00:00'),('keshav',472,'2019-02-02 00:00:00'),('rituraj',471,'2019-02-02 00:00:00');
/*!40000 ALTER TABLE `borrowed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `library_books`
--

DROP TABLE IF EXISTS `library_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `library_books` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `isbn` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  KEY `isbn` (`isbn`),
  CONSTRAINT `library_books_ibfk_1` FOREIGN KEY (`isbn`) REFERENCES `books` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `library_books`
--

LOCK TABLES `library_books` WRITE;
/*!40000 ALTER TABLE `library_books` DISABLE KEYS */;
INSERT INTO `library_books` VALUES (472,'14509'),(473,'14509'),(474,'14509'),(475,'14509'),(467,'34509'),(468,'34509'),(469,'34509'),(470,'34509'),(471,'34509'),(462,'34567'),(463,'34567'),(464,'34567'),(465,'34572'),(466,'34572'),(481,'677889'),(482,'677889'),(483,'677889'),(476,'6789'),(477,'6789'),(478,'6789'),(479,'6789'),(480,'6789');
/*!40000 ALTER TABLE `library_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_names`
--

DROP TABLE IF EXISTS `tag_names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_names` (
  `tag` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_names`
--

LOCK TABLES `tag_names` WRITE;
/*!40000 ALTER TABLE `tag_names` DISABLE KEYS */;
INSERT INTO `tag_names` VALUES (1,'Physics'),(2,'Chemistry'),(3,'Maths'),(4,'Computer'),(5,'Algorithms');
/*!40000 ALTER TABLE `tag_names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(20) NOT NULL,
  `branch` varchar(20) DEFAULT NULL,
  `roll_no` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `due_fines` int(11) NOT NULL DEFAULT '0',
  `validity` date NOT NULL DEFAULT '9999-01-01',
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','$2a$10$0OvCgqPAHF9q0dbt9zV/v.zQ5juloyVPGRGI1e9D3ltaYUCiCSlBS','Administrator',NULL,NULL,1,0,'2069-01-26',NULL),('keshav','$2a$10$UN4gFSfO/QNZjpHl/GUuAOEJyCIB7.Bb0HGnM3CfNz/mEnBBs2kWu','Keshav','CSE',1607003,2,0,'2020-01-26','keshav@hotmail.com'),('rituraj','$2a$10$YSgobaVKKVr4IJDLYqC1p.k3mxqCrUvboGZRUuLHI405fWhPlWzb.','Ritu Raj','IT',1607005,2,0,'2020-01-26','rituraj22in@gmail.com'),('vishwas','$2a$10$AVFZWdetgw8cYCZ0d5E1CekCg33K6LlszX/p7Qk5uwIi/HXkaf4zu','Vishwas','ME',1607007,2,0,'2020-01-26','vishwas@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-27 14:31:24
