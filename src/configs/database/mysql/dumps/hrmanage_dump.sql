-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: managehr
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `managehr`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `managehr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `managehr`;

--
-- Table structure for table `annualreviewform`
--

DROP TABLE IF EXISTS `annualreviewform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `annualreviewform` (
  `formID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `year` int NOT NULL,
  `review` varchar(255) DEFAULT NULL,
  `point` int unsigned DEFAULT '0',
  PRIMARY KEY (`formID`),
  CONSTRAINT `annualreviewform_ibfk_1` FOREIGN KEY (`formID`) REFERENCES `form` (`formID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annualreviewform`
--

LOCK TABLES `annualreviewform` WRITE;
/*!40000 ALTER TABLE `annualreviewform` DISABLE KEYS */;
INSERT INTO `annualreviewform` VALUES ('033c270d-615d-4bd7-abe2-b2386df8a5b7',NULL,2022,'okok',0),('06c007bb-f208-434d-b548-ed0fa593bed2','accounting',2022,'review form update employee',0),('0b775fdd-4f45-4140-8b6a-53af02c55a25','accounting',2022,'review form update',0),('1ef0c83c-7f97-4694-b5e3-ad3556c4c754',NULL,2022,'okok',0),('3140876a-cdb5-463f-84b1-2d4831db28c6','accounting',2022,'review form update',0),('368c5ab9-75cb-45ce-aa51-50d5452f8e35',NULL,2022,'okok',0),('39a5d3e6-c2e0-4500-a54c-d67e111efddd',NULL,2022,'okok',0),('3f76eff5-9d42-4fea-ba3c-14655ae80482',NULL,2022,'okok',0),('425c0dd2-3788-48b3-b53e-8008cc24314c',NULL,2022,'okok',0),('4825077b-38d4-4d47-b147-39adea7151e1','accounting',2022,'review form update',0),('59dea109-bf4c-48ec-9970-1a7c7fc4db72',NULL,2022,'okok',0),('6738242b-e9a1-4428-8ac0-7e75fd9201c1',NULL,2022,'okok',0),('8d65aa41-22eb-4b29-8809-19c9ad45b6bf',NULL,2022,'okok',0),('8e54cace-368e-4b91-906a-ab8fd9ee6e65','accounting',2022,'review form update',0),('90552083-c689-4294-836d-0ccf9142ad7a',NULL,2022,'okok',0),('a345fbff-7a3e-4999-a6c5-ccdc47abbe7b','accounting',2022,'review form update',0),('a8db1709-d6e0-4b53-973a-17fa7459b4a4',NULL,2022,'okok',0),('b1c3b274-1311-4623-bf21-820ca3e4d971',NULL,2022,'okok abcsaklhdfkajsdfhasgdkjagsdyfuagskj',10),('b87e52e4-cad8-4d64-9a5d-fd8949199416',NULL,2022,'okok',0),('bd9d92a0-5729-4910-85ce-94c04b06c2dc',NULL,2022,'okok',0),('be3d47b5-0453-4742-89a8-9c8c764e82a3',NULL,2022,'okok',0),('bfab565a-ee47-498b-af22-29aec324948d',NULL,2022,'okok',0),('c310b409-6c6a-4031-94e5-2d91c775a620','accounting',2022,'review form update',0),('c85572ac-3cf5-449d-8ab8-be4fd71ffc2a',NULL,2022,'okok',0),('cee53b82-cebd-4b92-912b-58f4cabf5eca','accounting',2022,'review form update',0),('e89e39a2-3efe-410a-96b3-00e75bfd6263',NULL,2022,'okok',0),('f68de2d3-b9aa-4ee8-92dd-822cae0ca184','accounting',2022,'review form update',0),('fc0b562c-91d7-4418-a9c0-260858c0a8e8',NULL,2022,'okok',0),('ff12f948-a93d-49d5-82f0-dd5cb2e88390','accounting',2022,'review form update',0);
/*!40000 ALTER TABLE `annualreviewform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form`
--

DROP TABLE IF EXISTS `form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form` (
  `formID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `formCode` varchar(30) NOT NULL,
  `status` enum('open','review','approve') DEFAULT 'open',
  `numReject` int unsigned DEFAULT '0',
  `sendTime` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ownerID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `reviewerID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`formID`),
  UNIQUE KEY `formCode_ownerID_unique_key` (`formCode`,`ownerID`),
  KEY `ownerID` (`ownerID`),
  KEY `reviewerID` (`reviewerID`),
  CONSTRAINT `form_ibfk_10` FOREIGN KEY (`formCode`) REFERENCES `formstore` (`formCode`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_11` FOREIGN KEY (`ownerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_12` FOREIGN KEY (`reviewerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_2` FOREIGN KEY (`ownerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_3` FOREIGN KEY (`reviewerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_5` FOREIGN KEY (`ownerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_6` FOREIGN KEY (`reviewerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_8` FOREIGN KEY (`ownerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `form_ibfk_9` FOREIGN KEY (`reviewerID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form`
--

LOCK TABLES `form` WRITE;
/*!40000 ALTER TABLE `form` DISABLE KEYS */;
INSERT INTO `form` VALUES ('033c270d-615d-4bd7-abe2-b2386df8a5b7','form02','open',0,NULL,'2022-08-02 14:40:11','2022-08-02 14:40:11','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('06c007bb-f208-434d-b548-ed0fa593bed2','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:21:23','9adb651d-47e6-4333-95d0-52487459736f',NULL),('0b775fdd-4f45-4140-8b6a-53af02c55a25','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','8d7963e6-49a5-40f0-8790-874d030d9fc6',NULL),('1ef0c83c-7f97-4694-b5e3-ad3556c4c754','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15',NULL),('3140876a-cdb5-463f-84b1-2d4831db28c6','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','cfff8f10-7234-4382-8be2-12daedb44a4e',NULL),('35d7759e-b81d-420f-8b15-86bdd6ef4283','form01','review',0,'2022-08-08 02:25:49','2022-08-03 03:32:30','2022-08-08 02:25:49','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15','f0d3c522-a977-49eb-a097-705f49d9d55e'),('368c5ab9-75cb-45ce-aa51-50d5452f8e35','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('39a5d3e6-c2e0-4500-a54c-d67e111efddd','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','cfff8f10-7234-4382-8be2-12daedb44a4e',NULL),('3f76eff5-9d42-4fea-ba3c-14655ae80482','form02','approve',0,NULL,'2022-08-02 14:40:11','2022-08-02 14:51:43','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e','951a7262-b5e0-4aef-a883-b16b6d25a36c'),('425c0dd2-3788-48b3-b53e-8008cc24314c','form02','open',0,NULL,'2022-08-02 14:40:11','2022-08-02 14:40:11','cfff8f10-7234-4382-8be2-12daedb44a4e',NULL),('4825077b-38d4-4d47-b147-39adea7151e1','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('517e41ed-d408-4f4b-99c3-8536f0dab28b','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:24:50','cfff8f10-7234-4382-8be2-12daedb44a4e',NULL),('59dea109-bf4c-48ec-9970-1a7c7fc4db72','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('5bc39768-a1ab-4002-bf46-9581098771d8','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','a5d0f029-c48b-4e6d-a79d-db0bd5f88122',NULL),('6738242b-e9a1-4428-8ac0-7e75fd9201c1','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('68229e2b-4387-4235-8219-bac1916f0ee7','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('7797c90a-41f3-4481-ba7a-7942bf3dcdcc','form01','open',0,NULL,'2022-08-03 03:32:30','2022-08-03 03:40:39','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('7a47e269-82f7-48d8-8421-2ee4b369f4f5','form01','open',0,NULL,'2022-08-03 03:32:30','2022-08-03 03:40:39','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('8d65aa41-22eb-4b29-8809-19c9ad45b6bf','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15',NULL),('8e54cace-368e-4b91-906a-ab8fd9ee6e65','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e',NULL),('90552083-c689-4294-836d-0ccf9142ad7a','form02','review',0,'2022-08-02 14:54:51','2022-08-02 14:40:11','2022-08-02 14:54:51','f0d3c522-a977-49eb-a097-705f49d9d55e','951a7262-b5e0-4aef-a883-b16b6d25a36c'),('90f3b89e-eef6-4327-ae2e-874ee0541ef7','form01','open',0,NULL,'2022-08-03 03:32:30','2022-08-03 03:40:40','f0d3c522-a977-49eb-a097-705f49d9d55e',NULL),('946a6547-0efb-4bf4-81a2-94d8cb96d014','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','8d7963e6-49a5-40f0-8790-874d030d9fc6',NULL),('a345fbff-7a3e-4999-a6c5-ccdc47abbe7b','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','a5d0f029-c48b-4e6d-a79d-db0bd5f88122',NULL),('a8db1709-d6e0-4b53-973a-17fa7459b4a4','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','f0d3c522-a977-49eb-a097-705f49d9d55e',NULL),('aedaa262-4cdc-4daa-8c87-36412b281e36','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('b1c3b274-1311-4623-bf21-820ca3e4d971','form02','review',0,'2022-08-02 15:00:03','2022-08-02 14:40:11','2022-08-02 15:00:03','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15','f0d3c522-a977-49eb-a097-705f49d9d55e'),('b87e52e4-cad8-4d64-9a5d-fd8949199416','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e',NULL),('bcecc85d-f6d4-419a-ad6e-140bfdd470f3','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15',NULL),('bd9d92a0-5729-4910-85ce-94c04b06c2dc','form02','open',0,NULL,'2022-08-02 14:40:11','2022-08-02 14:40:11','7fc453d4-6b6e-40eb-9353-4cde950dea11',NULL),('be3d47b5-0453-4742-89a8-9c8c764e82a3','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e',NULL),('bfab565a-ee47-498b-af22-29aec324948d','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','f0d3c522-a977-49eb-a097-705f49d9d55e',NULL),('c310b409-6c6a-4031-94e5-2d91c775a620','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','f0d3c522-a977-49eb-a097-705f49d9d55e',NULL),('c85572ac-3cf5-449d-8ab8-be4fd71ffc2a','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','cfff8f10-7234-4382-8be2-12daedb44a4e',NULL),('cee53b82-cebd-4b92-912b-58f4cabf5eca','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','ef94ffd0-7e1d-497b-8d4e-40ef973b3c15',NULL),('cf75c832-d17a-49a4-bd1c-ef362e29cfbd','form01','open',0,NULL,'2022-08-03 03:32:30','2022-08-03 03:40:40','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e',NULL),('d72458c8-42f8-4127-83ad-a33a40c0cdee','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','f0d3c522-a977-49eb-a097-705f49d9d55e',NULL),('e46a5f4a-28fe-480f-8dd7-19309c65cd8e','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','9adb651d-47e6-4333-95d0-52487459736f',NULL),('e4b6e517-9046-4306-b41c-bf05c64dfccc','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','9cf4db59-5f4f-4b7d-991e-1f9fd47cb76f',NULL),('e89e39a2-3efe-410a-96b3-00e75bfd6263','form06','open',0,NULL,'2022-08-03 07:45:25','2022-08-03 07:45:25','9cf4db59-5f4f-4b7d-991e-1f9fd47cb76f',NULL),('f68de2d3-b9aa-4ee8-92dd-822cae0ca184','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('f7e08ead-7a5b-4cd0-9047-ebe201137929','form03','open',0,NULL,'2022-08-08 03:51:32','2022-08-08 04:18:20','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e',NULL),('fc0b562c-91d7-4418-a9c0-260858c0a8e8','form04','open',0,NULL,'2022-08-02 14:46:18','2022-08-02 14:46:18','9c15ba67-8ee6-4685-87f3-63f8aab6ad51',NULL),('ff12f948-a93d-49d5-82f0-dd5cb2e88390','form05','open',0,NULL,'2022-08-08 03:09:38','2022-08-08 03:18:05','9cf4db59-5f4f-4b7d-991e-1f9fd47cb76f',NULL);
/*!40000 ALTER TABLE `form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formstore`
--

DROP TABLE IF EXISTS `formstore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formstore` (
  `formCode` varchar(255) NOT NULL,
  `status` enum('public','private') DEFAULT 'private',
  `title` text NOT NULL,
  `formType` enum('annualReviewForm','probationaryForm') NOT NULL,
  `describe` text,
  `note` text,
  `createrID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`formCode`),
  KEY `createrID` (`createrID`),
  FULLTEXT KEY `search_formStore_title_index` (`title`),
  CONSTRAINT `formstore_ibfk_1` FOREIGN KEY (`createrID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `formstore_ibfk_2` FOREIGN KEY (`createrID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `formstore_ibfk_3` FOREIGN KEY (`createrID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `formstore_ibfk_4` FOREIGN KEY (`createrID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formstore`
--

LOCK TABLES `formstore` WRITE;
/*!40000 ALTER TABLE `formstore` DISABLE KEYS */;
INSERT INTO `formstore` VALUES ('form01','public','khảo sát giai đoạn 2','probationaryForm','asfdhajksgd','kkkkkk','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e','2022-08-02 06:59:09','2022-08-03 03:32:30'),('form02','public','form khảo sát giai đoạn 1','annualReviewForm','asfdhajksgd','kkkkkk','951a7262-b5e0-4aef-a883-b16b6d25a36c','2022-08-02 14:38:02','2022-08-03 04:36:22'),('form03','public','form khảo sát giai đoạn 3','probationaryForm','asfdhajks adfiagd','kkkkkk','951a7262-b5e0-4aef-a883-b16b6d25a36c','2022-08-02 14:38:16','2022-08-08 03:51:32'),('form04','public','create ok form annual','annualReviewForm','abc kkasfdha ','dcaasfda e','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e','2022-08-02 14:45:10','2022-08-02 14:46:18'),('form05','public','create ok form annual','annualReviewForm','abc kkasfdha ','dcaasfda e','e796427b-cb2f-442b-bbc7-4e4c1bf74e3e','2022-08-03 06:55:52','2022-08-08 03:09:38'),('form06','public','create ok form annual test sendmail','annualReviewForm','abc kkasfdha ','dcaasfda e','9c15ba67-8ee6-4685-87f3-63f8aab6ad51','2022-08-03 07:44:40','2022-08-03 07:45:25'),('form08','private','form store title','annualReviewForm','describe form store','note form store','951a7262-b5e0-4aef-a883-b16b6d25a36c','2022-08-07 11:26:08','2022-08-08 02:20:27');
/*!40000 ALTER TABLE `formstore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `probationaryform`
--

DROP TABLE IF EXISTS `probationaryform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `probationaryform` (
  `formID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `durationTime` int unsigned DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `workResult` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`formID`),
  CONSTRAINT `probationaryform_ibfk_1` FOREIGN KEY (`formID`) REFERENCES `form` (`formID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `probationaryform`
--

LOCK TABLES `probationaryform` WRITE;
/*!40000 ALTER TABLE `probationaryform` DISABLE KEYS */;
INSERT INTO `probationaryform` VALUES ('35d7759e-b81d-420f-8b15-86bdd6ef4283',10,'2022-08-02 07:54:51','Employee','update ok r','kkkk'),('517e41ed-d408-4f4b-99c3-8536f0dab28b',5,'2022-08-08 00:00:00','xyz','comment form update one','work result update one'),('5bc39768-a1ab-4002-bf46-9581098771d8',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('68229e2b-4387-4235-8219-bac1916f0ee7',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('7797c90a-41f3-4481-ba7a-7942bf3dcdcc',10,'2022-08-02 07:54:51','Employee','update ok r','kkkk'),('7a47e269-82f7-48d8-8421-2ee4b369f4f5',10,'2022-08-02 07:54:51','Employee','update ok r','kkkk'),('90f3b89e-eef6-4327-ae2e-874ee0541ef7',10,'2022-08-02 07:54:51','Employee','update ok r','kkkk'),('946a6547-0efb-4bf4-81a2-94d8cb96d014',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('aedaa262-4cdc-4daa-8c87-36412b281e36',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('bcecc85d-f6d4-419a-ad6e-140bfdd470f3',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('cf75c832-d17a-49a4-bd1c-ef362e29cfbd',10,'2022-08-02 07:54:51','Employee','update ok r','kkkk'),('d72458c8-42f8-4127-83ad-a33a40c0cdee',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('e46a5f4a-28fe-480f-8dd7-19309c65cd8e',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('e4b6e517-9046-4306-b41c-bf05c64dfccc',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all'),('f7e08ead-7a5b-4cd0-9047-ebe201137929',5,'2022-08-08 00:00:00','xyz','comment form update all','work result update all');
/*!40000 ALTER TABLE `probationaryform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staffCode` varchar(30) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `cmnd` varchar(255) DEFAULT NULL,
  `numberBHXH` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Drirector','HR','Manager','Employee') NOT NULL DEFAULT 'Employee',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `managerID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `staffCode` (`staffCode`),
  UNIQUE KEY `staffCode_2` (`staffCode`),
  UNIQUE KEY `staffCode_3` (`staffCode`),
  UNIQUE KEY `staffCode_4` (`staffCode`),
  UNIQUE KEY `cmnd` (`cmnd`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cmnd_2` (`cmnd`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `cmnd_3` (`cmnd`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `cmnd_4` (`cmnd`),
  UNIQUE KEY `email_4` (`email`),
  KEY `managerID` (`managerID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`managerID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`managerID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_3` FOREIGN KEY (`managerID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_4` FOREIGN KEY (`managerID`) REFERENCES `user` (`userID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0d3e4943-7d8e-4b3f-bcca-7a2c021c9047','em07','trung','dong',NULL,NULL,NULL,NULL,NULL,'em7@gmail.com','$2b$10$9CzMD.o1fmh8FmBA3p2f2OzS7otq3etPSn3sEFI3LzLevOpQfsdJq','Employee','2022-08-06 15:59:29','2022-08-06 15:59:29','2022-08-07 10:38:31',NULL),('1a96edcb-d77e-473e-8dd3-d18058c0584a','dr02','trung','dong',NULL,NULL,NULL,NULL,NULL,'dr2@gmail.com','$2b$10$w8us4hccNMBMT375UQmic.06j0Y9LJyLMaHgpv1vzCcSLCLE5hEHi','Drirector','2022-08-02 06:58:00','2022-08-02 06:58:00',NULL,NULL),('7fc453d4-6b6e-40eb-9353-4cde950dea11','em02','trung','dong',NULL,'avatar-1659423346125-641811399vuonglam.jpg',NULL,NULL,NULL,'em2@gmail.com','$2b$10$D13nPuee0.emuexkZ7QCTOc/JbE3bwAzoCzYn9.hDvFFmk9DKfOvy','Employee','2022-08-02 06:55:46','2022-08-02 06:55:46',NULL,NULL),('8d7963e6-49a5-40f0-8790-874d030d9fc6','em04','trung','dong',NULL,NULL,NULL,NULL,NULL,'trungdongfym1@gmail.com','$2b$10$Icm8hKxS10E.HX6n3MnDiu3A.6U2ChLC2sWCA5YgFouHHWJC2GEkO','Employee','2022-08-03 15:33:18','2022-08-03 15:33:18',NULL,NULL),('951a7262-b5e0-4aef-a883-b16b6d25a36c','Admin','Le Trung','Dong',NULL,NULL,NULL,NULL,NULL,'admin@gmail.com','$2b$10$LQwQczRXF6hwjROa0QhnCe3uyZsFZNmHjCMdPWBvKW9Gck0beXyH.','Admin','2022-08-02 06:54:24','2022-08-02 06:54:24',NULL,NULL),('9adb651d-47e6-4333-95d0-52487459736f','em08','trung','dong',NULL,NULL,NULL,NULL,NULL,'em8@gmail.com','$2b$10$yXjl8Rb6Pgx/L7JwHM4RW.jvR8vqgWNRkML3x6qKsjn20bpIosFiy','Employee','2022-08-07 07:54:34','2022-08-07 07:54:34',NULL,NULL),('9c15ba67-8ee6-4685-87f3-63f8aab6ad51','hr02','trung','dong',NULL,NULL,NULL,NULL,NULL,'hr2@gmail.com','$2b$10$HaO.3BGt6xIdKJLKjblgeOPWyhx1rZMiuuVPWj7jBM9WngOHWI9J6','HR','2022-08-02 06:57:22','2022-08-02 06:57:22',NULL,NULL),('9cf4db59-5f4f-4b7d-991e-1f9fd47cb76f','em03','trung','dong',NULL,NULL,NULL,NULL,NULL,'trungdonfym1@gmail.com','$2b$10$6SBHVl.OJZv0zbBU0PfB.efz0jURqZFjSvPy0VB3OvpDC9Ast6ix.','Employee','2022-08-03 07:43:16','2022-08-03 07:43:16',NULL,NULL),('a5d0f029-c48b-4e6d-a79d-db0bd5f88122','em05','trung','dong',NULL,'avatar-1659540829562-710959288vuonglam.jpg',NULL,NULL,NULL,'em5@gmail.com','$2b$10$8koaFyG9m.qJdK8rIGWL.uRQgKacqMTkCLfC285SH9ZaTgoru8vty','Employee','2022-08-03 15:33:50','2022-08-03 15:33:50',NULL,NULL),('abe25f6c-41bc-4747-9d84-b5ab78caa2c7','dr01','trung','dong',NULL,NULL,NULL,NULL,NULL,'dr1@gmail.com','$2b$10$dm6Nw7XHAG4suIBER0evx.uE6hSHB4SQaaDaryr6qx/dJzimd81tO','Drirector','2022-08-02 06:57:51','2022-08-02 06:57:51',NULL,NULL),('cfff8f10-7234-4382-8be2-12daedb44a4e','mg02','trung','dong',NULL,NULL,NULL,NULL,NULL,'mg2@gmail.com','$2b$10$OYdFFVaCaySq/83rp7wtVuAfz65k9oN2UCplbvtDxIVTdKPHpaP3K','Manager','2022-08-02 06:56:31','2022-08-02 06:56:31',NULL,NULL),('e796427b-cb2f-442b-bbc7-4e4c1bf74e3e','hr01','trung','dong',NULL,NULL,NULL,NULL,NULL,'hr1@gmail.com','$2b$10$anOCihZc6KCVTxEauD6cEOUHRgtV1Y15ItC7Xzz5Dh1ZaTPpfVJ/S','HR','2022-08-02 06:57:28','2022-08-02 06:57:28',NULL,NULL),('ef94ffd0-7e1d-497b-8d4e-40ef973b3c15','em01','trung','dong',NULL,NULL,NULL,NULL,NULL,'em1@gmail.com','$2b$10$lfyo8W29jAb7asgwH8iEKuIpg114O3uLW6E3O3CxuU.gVL8arvPmm','Employee','2022-08-02 06:55:58','2022-08-02 07:39:23',NULL,'f0d3c522-a977-49eb-a097-705f49d9d55e'),('f0d3c522-a977-49eb-a097-705f49d9d55e','mg01','trung','dong',NULL,NULL,NULL,NULL,NULL,'mg1@gmail.com','$2b$10$izXfjPeAVEia5xhl6LtRg.Aqbzw0qNFtFEJIhpqAbRUZSpmUbAg8q','Manager','2022-08-02 06:56:22','2022-08-02 06:56:22',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-08 16:18:29
