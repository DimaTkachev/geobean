-- Create tables
CREATE TABLE IF NOT EXISTS `continent` (
  `continentID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`continentID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `country` (
  `countryID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `iso3` varchar(3) NOT NULL,
  `continentID` int UNSIGNED NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`countryID`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `iso3` (`iso3`),
  KEY `continentID` (`continentID`),
  CONSTRAINT `country_ibfk_1` FOREIGN KEY (`continentID`) REFERENCES `continent` (`continentID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `region` (
  `regionID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `countryID` int UNSIGNED NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`regionID`),
  UNIQUE KEY `name` (`name`),
  KEY `countryID` (`countryID`),
  CONSTRAINT `region_ibfk_1` FOREIGN KEY (`countryID`) REFERENCES `country` (`countryID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `processing_method` (
  `methodID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`methodID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `roasting` (
  `roastingID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`roastingID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `supplier` (
  `supplierID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `url` varchar(1024) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`supplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `weight` (
  `weightID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `value` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`weightID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `coffee_lot` (
  `lotID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `regionID` int UNSIGNED NOT NULL,
  `taste` text,
  `tasteFilter` text,
  `qRate` float DEFAULT NULL,
  `roastingID` int UNSIGNED NOT NULL,
  `methodID` int UNSIGNED NOT NULL,
  `supplierID` int UNSIGNED NOT NULL,
  `height` varchar(20) DEFAULT NULL,
  `weightID` int UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `link` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`lotID`),
  KEY `regionID` (`regionID`),
  KEY `roastingID` (`roastingID`),
  KEY `methodID` (`methodID`),
  KEY `supplierID` (`supplierID`),
  KEY `weightID` (`weightID`),
  CONSTRAINT `coffee_lot_ibfk_6` FOREIGN KEY (`regionID`) REFERENCES `region` (`regionID`) ON UPDATE CASCADE,
  CONSTRAINT `coffee_lot_ibfk_7` FOREIGN KEY (`roastingID`) REFERENCES `roasting` (`roastingID`) ON UPDATE CASCADE,
  CONSTRAINT `coffee_lot_ibfk_8` FOREIGN KEY (`methodID`) REFERENCES `processing_method` (`methodID`) ON UPDATE CASCADE,
  CONSTRAINT `coffee_lot_ibfk_9` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`) ON UPDATE CASCADE,
  CONSTRAINT `coffee_lot_ibfk_10` FOREIGN KEY (`weightID`) REFERENCES `weight` (`weightID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `marker` (
  `markerID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `lotID` int UNSIGNED NOT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`markerID`),
  UNIQUE KEY `lotID` (`lotID`),
  CONSTRAINT `markers_ibfk_1` FOREIGN KEY (`lotID`) REFERENCES `coffee_lot` (`lotID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `taste_tag` (
  `tagID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`tagID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `coffee_lot_tag` (
  `lotID` int UNSIGNED NOT NULL,
  `tagID` int UNSIGNED NOT NULL,
  PRIMARY KEY (`lotID`,`tagID`),
  KEY `tagID` (`tagID`),
  CONSTRAINT `coffee_lot_tag_ibfk_1` FOREIGN KEY (`lotID`) REFERENCES `coffee_lot` (`lotID`) ON DELETE CASCADE,
  CONSTRAINT `coffee_lot_tag_ibfk_2` FOREIGN KEY (`tagID`) REFERENCES `taste_tag` (`tagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `userID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `passwordHash` char(60) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `shop` (
  `shopID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `userID` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `theme` enum('beige','purple','blue') DEFAULT 'beige',
  `shareUrl` varchar(255) DEFAULT NULL,
  `qrPath` varchar(255) DEFAULT NULL,
  `qrEnabled` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopID`),
  KEY `userID` (`userID`),
  CONSTRAINT `shop_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `inventory` (
  `inventoryID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `shopID` int UNSIGNED NOT NULL,
  `lotID` int UNSIGNED NOT NULL,
  `stock` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventoryID`),
  KEY `shopID` (`shopID`),
  KEY `lotID` (`lotID`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`shopID`) REFERENCES `shop` (`shopID`),
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`lotID`) REFERENCES `coffee_lot` (`lotID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert initial data
INSERT INTO `continent` (`continentID`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Южная Америка', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Северная Америка', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `country` (`countryID`, `name`, `iso3`, `continentID`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Бразилия', 'BRA', 1, 'Крупнейший производитель кофе в мире. Славится шоколадно-ореховыми профилями из регионов Минас-Жерайс и Серрадо. Пионер механизированного сбора и натуральной обработки. Отличается стабильным качеством и разнообразием - от коммерческих до премиальных лотов.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Гватемала', 'GTM', 2, 'Вулканические почвы и высотные плантации (до 2000м) создают кофе с яркой кислотностью и сложным букетом. Знаменита регионами Антигуа и Уэуэтенанго. Характерные ноты: специи, карамель, тропические фрукты.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(3, 'Колумбия', 'COL', 1, 'Второй производитель арабики после Бразилии. Узнаваем по балансу сладости, кислотности и орехово-фруктовым нотам. Инновации в обработке (термошок, анаэробная ферментация) делают колумбийские лоты эталоном спешелти.', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `region` (`regionID`, `name`, `countryID`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Минас-Жерайс', 1, 'Крупнейший кофейный регион Бразилии, даёт 50% национального производства. Известен сбалансированными лотами с нотами шоколада и орехов.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Антигуа', 2, 'Знаменитый регион между вулканами. Кофе отличается дымчатыми нотами и яркой кислотностью благодаря минеральным почвам.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(3, 'Уила', 3, 'Южный регион с вулканическими почвами. Лидер по инновационным обработкам (термошок, анаэробная ферментация).', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `processing_method` (`methodID`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'натуральный', 'Зерна сушат внутри ягод на солнце, что даёт насыщенную сладость и фруктовые ноты. Самый древний и экологичный метод, популярен в Эфиопии и Бразилии. Часто создаёт ягодные или винные оттенки во вкусе.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'мытый', 'Мякоть удаляют сразу после сбора, затем ферментируют и промывают зерна. Даёт чистый, сбалансированный вкус с яркой кислотностью. Стандарт для Колумбии и Кении.', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `roasting` (`roastingID`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'фильтр', 'Более светлая обжарка, которая сохраняет яркую кислотность и фруктовые ноты в кофе. Зерна остаются плотными, с выраженной пористостью, что идеально для альтернативных методов заваривания. Во вкусе преобладают ягодные, цитрусовые и цветочные оттенки, а тело напитка получается лёгким и прозрачным.', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'эспрессо', 'Более тёмная обжарка, которая усиливает тело, сладость и снижает кислотность. Зерна приобретают маслянистый блеск и тёмно-коричневый оттенок. Во вкусе доминируют шоколадные, карамельные и ореховые ноты, что делает кофе идеальным для приготовления в эспрессо-машине и молочных напитках.', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `supplier` (`supplierID`, `name`, `url`, `createdAt`, `updatedAt`) VALUES
(1, 'Tasty Coffee', 'https://shop.tastycoffee.ru/', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'East Brew', 'https://eastbrew.com/', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(3, 'West 4', 'https://west4.coffee/', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `weight` (`weightID`, `value`, `createdAt`, `updatedAt`) VALUES
(1, '250 гр', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, '1 кг', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `coffee_lot` (`lotID`, `name`, `description`, `regionID`, `taste`, `tasteFilter`, `qRate`, `roastingID`, `methodID`, `supplierID`, `height`, `weightID`, `image`, `createdAt`, `updatedAt`, `link`) VALUES
(1, 'Бразилия Суль-де-Минас', 'Сбалансированный вкус с нотами арахиса, какао и лёгкой цитрусовой кислотностью. Хорошо раскрывается при разных способах заваривания. Низкая кислотность делает кофе универсальным. Лот хорошо сочетается с молоком. Чётко читаемые дескрипторы, особенно арахис и цедра лимона, при правильной настройке помола и температуры.\nВыбор для тех, кто ищет классический вкус кофе без экспериментов.', 1, 'Сладкий кофе с нотами арахиса, пудры какао и цедры лимона', 'арахис, какао,  цедра лимона', 82, 1, 1, 1, '850–1100 м', 1, '1.png', '2025-05-25 22:37:49', '2025-05-25 22:37:49', 'https://shop.tastycoffee.ru/coffee/braziliya-sul-de-minas'),
(2, 'Гватемала Сантьяго', 'Сладкий вкус с нотами молочного шоколада, апельсина и сухофруктов. Плотное тело и насыщенный аромат с шоколадными и цитрусовыми нотами. Хорошо раскрывается в турке и при приготовлении фильтр-способами.', 2, 'Сладкий кофе со вкусом апельсина, сухофруктов и молочного шоколада', 'апельсин, сухофрукты, молочный шоколад', 84, 1, 2, 1, '1400 м', 1, '2.png', '2025-05-25 22:37:49', '2025-05-25 22:37:49', 'https://shop.tastycoffee.ru/coffee/guatemala-santiago'),
(3, 'Колумбия Уила', 'Во вкусе умеренная кислотность и лёгкая сладость, с нотами красного яблока и какао. Послевкусие чаще всего с лёгкой горечью и фруктовыми оттенками. Лот универсален и хорошо раскрывается в разных способах приготовления (капельная кофеварка, воронка, френч-пресс).', 3, 'Сочный кофе с нотами красного яблока, тёмного винограда и какао', 'красное яблоко, тёмный виноград, какао', 84, 1, 2, 1, '1500–1900 м', 1, '3.png', '2025-05-25 22:37:49', '2025-05-25 22:37:49', 'https://shop.tastycoffee.ru/coffee/colombia-huila');

INSERT INTO `marker` (`markerID`, `lotID`, `longitude`, `latitude`, `createdAt`, `updatedAt`) VALUES
(1, 1, -45.556900, -22.070250, '2025-05-25 22:38:16', '2025-05-25 22:38:16'),
(2, 2, -90.703000, 14.559250, '2025-05-25 22:38:16', '2025-05-25 22:38:16'),
(3, 3, -75.525000, 2.276500, '2025-05-25 22:38:16', '2025-05-25 22:38:16');

INSERT INTO `taste_tag` (`tagID`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Цветочный', 'жасмин, роза, цветы', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Цитрусовый', 'лимон, цедра лимона, лайм, апельсин, мандарин, лимонный конфитюр, грейпфрут', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(3, 'Ягодный', 'черника, голубика, брусника, красные ягоды, малина, смородина, красная смородина, черная смородина, лист смородины, черешня, шиповник, вишня, садовые ягоды, темные ягоды', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(4, 'Фруктовый', 'красное яблоко, печёное яблоко, персик, слива, абрикос, личи, желтые фрукты, косточковые фрукты, сливовый тарт, манго', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(5, 'Сухофрукты', 'сухофрукты, абрикосовый джем, сливовое варенье, лимонные цукаты', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(6, 'Виноградный', 'белый виноград, тёмный виноград', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(7, 'Ореховый', 'орехи, арахис, фундук, пекан', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(8, 'Шоколадный', 'шоколад, тёмный шоколад, молочный шоколад, какао', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(9, 'Карамельный', 'карамель, ванильное печенье, бисквит', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(10, 'Чайный', 'чёрный чай, ягодный чай, бергамот', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(11, 'Пряный', 'кардамон, специи, анис, пряности, лакрица', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(12, 'Медовый', 'мёд', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(13, 'Овощной', 'вяленые томаты', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

INSERT INTO `coffee_lot_tag` (`lotID`, `tagID`) VALUES
(1, 2),
(2, 2),
(3, 4),
(2, 5),
(3, 6),
(1, 7),
(1, 8),
(2, 8),
(3, 8);