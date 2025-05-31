-- Drop the old table
DROP TABLE IF EXISTS `markers`;

-- Create the new table with the same structure
CREATE TABLE IF NOT EXISTS `marker` (
  `markerID` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `lotID` int UNSIGNED NOT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`markerID`),
  UNIQUE KEY `lotID` (`lotID`),
  CONSTRAINT `marker_ibfk_1` FOREIGN KEY (`lotID`) REFERENCES `coffee_lot` (`lotID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 