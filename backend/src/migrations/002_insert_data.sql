-- Insert continents
INSERT INTO `continent` (`continentID`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Южная Америка', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Северная Америка', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert countries
INSERT INTO `country` (`countryID`, `name`, `iso3`, `continentID`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Бразилия', 'BRA', 1, 'Крупнейший производитель кофе в мире', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Колумбия', 'COL', 1, 'Второй по величине производитель кофе в Южной Америке', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert regions
INSERT INTO `region` (`regionID`, `name`, `countryID`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Минас-Жерайс', 1, 'Крупнейший кофейный регион Бразилии', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Уила', 2, 'Один из основных кофейных регионов Колумбии', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert processing methods
INSERT INTO `processing_method` (`methodID`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Мытая обработка', 'Классический метод обработки кофе', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Натуральная обработка', 'Традиционный метод сушки целых ягод', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert roasting levels
INSERT INTO `roasting` (`roastingID`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Светлая обжарка', 'Подчеркивает кислотность и фруктовые ноты', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Средняя обжарка', 'Сбалансированный профиль', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert suppliers
INSERT INTO `supplier` (`supplierID`, `name`, `url`, `createdAt`, `updatedAt`) VALUES
(1, 'Coffee Import Co', 'https://coffeeimport.co', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, 'Bean Traders', 'https://beantraders.com', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert weights
INSERT INTO `weight` (`weightID`, `value`, `createdAt`, `updatedAt`) VALUES
(1, '250g', '2025-05-25 22:29:38', '2025-05-25 22:29:38'),
(2, '1kg', '2025-05-25 22:29:38', '2025-05-25 22:29:38');

-- Insert coffee lots
INSERT INTO `coffee_lot` (`lotID`, `name`, `description`, `regionID`, `taste`, `tasteFilter`, `qRate`, `roastingID`, `methodID`, `supplierID`, `height`, `weightID`, `image`, `createdAt`, `updatedAt`, `link`) VALUES
(1, 'Бразилия Серрадо', 'Отличный кофе из региона Минас-Жерайс', 1, 'Шоколад, орехи, карамель', 'сладкий, сбалансированный', 85.5, 2, 2, 1, '1200m', 1, 'brazil-cerrado.jpg', '2025-05-25 22:29:38', '2025-05-25 22:29:38', 'https://example.com/coffee/1'),
(2, 'Колумбия Уила', 'Яркий кофе из региона Уила', 2, 'Цитрусовые, яблоко, мед', 'фруктовый, сладкий', 87.0, 1, 1, 2, '1800m', 2, 'colombia-huila.jpg', '2025-05-25 22:29:38', '2025-05-25 22:29:38', 'https://example.com/coffee/2');

-- Insert markers
INSERT INTO `markers` (`id`, `coffee_lot_id`, `longitude`, `latitude`, `createdAt`, `updatedAt`) VALUES
(1, 1, -45.556900, -22.070250, '2025-05-25 22:38:16', '2025-05-25 22:38:16'),
(2, 2, -75.544100, 2.535800, '2025-05-25 22:38:16', '2025-05-25 22:38:16'); 