-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Sep 09, 2026 at 04:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL COMMENT 'Brand logo image path',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `metaTitle` varchar(255) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `metaKeywords` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `isActive`, `isFeatured`, `displayOrder`, `metaTitle`, `metaDescription`, `metaKeywords`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Nike', 'nike', 'Just Do It - Premium sportswear and lifestyle brand', '/uploads/brands/nike.jpg', 1, 1, 1, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(2, 'Adidas', 'adidas', 'Impossible is Nothing - Sports and casual wear', '/uploads/brands/adidas.jpg', 1, 1, 2, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(3, 'Zara', 'zara', 'Contemporary fashion for modern lifestyle', '/uploads/brands/zara.jpg', 1, 1, 3, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(4, 'H&M', 'h-and-m', 'Affordable fashion and quality', '/uploads/brands/hm.jpg', 1, 1, 4, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(5, 'Levi\'s', 'levis', 'The original denim brand since 1853', '/uploads/brands/levis.jpg', 1, 1, 5, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(6, 'Puma', 'puma', 'Forever Faster - Athletic and casual wear', '/uploads/brands/puma.jpg', 1, 1, 6, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(7, 'Gap', 'gap', 'American casual wear and accessories', '/uploads/brands/gap.jpg', 1, 0, 7, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(8, 'Forever 21', 'forever-21', 'Trendy fashion for young adults', '/uploads/brands/forever21.jpg', 1, 0, 8, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(9, 'Calvin Klein', 'calvin-klein', 'Minimalist American fashion house', '/uploads/brands/calvinklein.jpg', 1, 1, 9, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(10, 'Tommy Hilfiger', 'tommy-hilfiger', 'Classic American cool style', '/uploads/brands/tommyhilfiger.jpg', 1, 1, 10, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `variantId` int(11) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `userId`, `productId`, `variantId`, `size`, `color`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES
(1, 2, 15, 13, '32', 'Black', 3, 69.99, '2026-09-09 14:25:41', '2026-09-09 14:25:41');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `isFeatured` tinyint(1) DEFAULT 0,
  `parentId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `displayOrder`, `isActive`, `isFeatured`, `parentId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Men\'s Clothing', 'mens-clothing', 'Stylish and comfortable clothing for men', '/uploads/categories/mens-clothing.jpg', 1, 1, 1, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(2, 'Women\'s Clothing', 'womens-clothing', 'Trendy and elegant clothing for women', '/uploads/categories/womens-clothing.jpg', 2, 1, 1, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(3, 'Men\'s Accessories', 'mens-accessories', 'Complete your look with stylish accessories', '/uploads/categories/mens-accessories.jpg', 3, 1, 1, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(4, 'Women\'s Accessories', 'womens-accessories', 'Beautiful accessories for every occasion', '/uploads/categories/womens-accessories.jpg', 4, 1, 1, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(5, 'Footwear', 'footwear', 'Comfortable and stylish footwear for all', '/uploads/categories/footwear.jpg', 5, 1, 1, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(6, 'Mens', 'mens', 'hello this demo categoreys ', NULL, 10, 1, 1, NULL, '2026-09-09 14:42:26', '2026-09-09 14:42:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cmspages`
--

CREATE TABLE `cmspages` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `content` longtext DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `page_type` enum('page','footer_link','header_link','custom') NOT NULL DEFAULT 'page',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `show_in_footer` tinyint(1) NOT NULL DEFAULT 0,
  `show_in_header` tinyint(1) NOT NULL DEFAULT 0,
  `footer_section` enum('quick_links','support','company','legal') DEFAULT NULL,
  `external_url` varchar(500) DEFAULT NULL,
  `open_in_new_tab` tinyint(1) NOT NULL DEFAULT 0,
  `icon_class` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cmspages`
--

INSERT INTO `cmspages` (`id`, `title`, `slug`, `content`, `meta_title`, `meta_description`, `meta_keywords`, `page_type`, `display_order`, `is_active`, `show_in_footer`, `show_in_header`, `footer_section`, `external_url`, `open_in_new_tab`, `icon_class`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'About Us', 'about-us', '<h1>About Us</h1><p>Learn more about our company and mission.</p>', 'About Us - Beestee', 'Learn about Beestee - your premium fashion destination', NULL, 'page', 1, 1, 1, 1, 'quick_links', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(2, 'Shop', 'shop', '', NULL, NULL, NULL, 'page', 2, 1, 1, 1, 'quick_links', '/shop', 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(3, 'Contact Us', 'contact', '', NULL, NULL, NULL, 'page', 3, 1, 1, 1, 'quick_links', '/contact', 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(4, 'New Arrivals', 'new-arrivals', '', NULL, NULL, NULL, 'page', 4, 1, 1, 0, 'quick_links', '/shop?filter=new-arrivals', 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(5, 'Help Center', 'help-center', '<h1>Help Center</h1><p>Find answers to common questions.</p>', NULL, NULL, NULL, 'page', 1, 1, 1, 0, 'support', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(6, 'Shipping & Delivery', 'shipping-delivery', '<h1>Shipping & Delivery</h1><p>Information about our shipping policies.</p>', NULL, NULL, NULL, 'page', 2, 1, 1, 0, 'support', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(7, 'Returns & Exchange', 'returns-exchange', '<h1>Returns & Exchange</h1><p>Our return and exchange policy.</p>', NULL, NULL, NULL, 'page', 3, 1, 1, 0, 'support', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(8, 'FAQ', 'faq', '<h1>Frequently Asked Questions</h1><p>Common questions and answers.</p>', NULL, NULL, NULL, 'page', 4, 1, 1, 0, 'support', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(9, 'Our Story', 'our-story', '<h1>Our Story</h1><p>Discover the journey of Beestee.</p>', NULL, NULL, NULL, 'page', 1, 1, 1, 0, 'company', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(10, 'Careers', 'careers', '<h1>Careers</h1><p>Join our team and grow with us.</p>', NULL, NULL, NULL, 'page', 2, 1, 1, 0, 'company', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(11, 'Blog', 'blog', '', NULL, NULL, NULL, 'page', 3, 1, 1, 0, 'company', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(12, 'Terms of Service', 'terms-of-service', '<h1>Terms of Service</h1><p>Please read these terms carefully before using our service.</p>', NULL, NULL, NULL, 'page', 1, 1, 1, 0, 'legal', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(13, 'Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>', NULL, NULL, NULL, 'page', 2, 1, 1, 0, 'legal', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(14, 'Cookie Policy', 'cookie-policy', '<h1>Cookie Policy</h1><p>Information about how we use cookies.</p>', NULL, NULL, NULL, 'page', 3, 1, 1, 0, 'legal', NULL, 0, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `herosections`
--

CREATE TABLE `herosections` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL COMMENT 'Main hero title text',
  `tagline` varchar(255) DEFAULT NULL COMMENT 'Hero tagline/subtitle text',
  `video_url` varchar(500) DEFAULT NULL COMMENT 'URL for background video',
  `background_image` varchar(500) DEFAULT NULL COMMENT 'Fallback background image URL',
  `primary_button_text` varchar(50) DEFAULT NULL COMMENT 'Text for primary CTA button',
  `primary_button_link` varchar(255) DEFAULT NULL COMMENT 'Link for primary CTA button',
  `secondary_button_text` varchar(50) DEFAULT NULL COMMENT 'Text for secondary button',
  `secondary_button_link` varchar(255) DEFAULT NULL COMMENT 'Link for secondary button',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether this hero section is active',
  `display_order` int(11) NOT NULL DEFAULT 0 COMMENT 'Order for displaying multiple hero sections',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `herosections`
--

INSERT INTO `herosections` (`id`, `title`, `tagline`, `video_url`, `background_image`, `primary_button_text`, `primary_button_link`, `secondary_button_text`, `secondary_button_link`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Beetes', 'Wear the Future. Redefine the Present.', 'https://www.w3schools.com/howto/rain.mp4', NULL, 'Explore Collection', '/shop', 'Discover More', '/about', 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:46:23');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `shippingName` varchar(100) NOT NULL,
  `shippingEmail` varchar(100) NOT NULL,
  `shippingPhone` varchar(20) NOT NULL,
  `shippingAddress` varchar(255) NOT NULL,
  `shippingCity` varchar(100) NOT NULL,
  `shippingState` varchar(100) NOT NULL,
  `shippingZipCode` varchar(20) NOT NULL,
  `shippingCountry` varchar(100) NOT NULL DEFAULT 'India',
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shippingCost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grandTotal` decimal(10,2) NOT NULL,
  `paymentMethod` enum('cod','online','card','upi') NOT NULL DEFAULT 'cod',
  `paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paymentId` varchar(100) DEFAULT NULL,
  `orderStatus` enum('pending','confirmed','processing','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `cancelReason` text DEFAULT NULL,
  `trackingNumber` varchar(100) DEFAULT NULL,
  `deliveredAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `variantId` int(11) DEFAULT NULL,
  `productName` varchar(255) NOT NULL,
  `productSku` varchar(100) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL COMMENT 'SEO-friendly URL slug',
  `sku` varchar(100) NOT NULL COMMENT 'Stock Keeping Unit - unique product identifier',
  `shortDescription` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  `subCategoryId` int(11) DEFAULT NULL,
  `brandId` int(11) DEFAULT NULL,
  `basePrice` decimal(10,2) NOT NULL COMMENT 'Base price before any discounts',
  `salePrice` decimal(10,2) DEFAULT NULL COMMENT 'Discounted price if on sale',
  `costPrice` decimal(10,2) DEFAULT NULL COMMENT 'Cost price for margin calculation',
  `taxRate` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Tax percentage (e.g., 18.00 for 18%)',
  `stockQuantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Total stock across all variants',
  `lowStockThreshold` int(11) NOT NULL DEFAULT 10,
  `weight` decimal(8,2) DEFAULT NULL COMMENT 'Product weight in kg',
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON: {length, width, height} in cm' CHECK (json_valid(`dimensions`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isTrending` tinyint(1) NOT NULL DEFAULT 0,
  `isNewArrival` tinyint(1) NOT NULL DEFAULT 0,
  `isBestseller` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `publishedAt` datetime DEFAULT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `salesCount` int(11) NOT NULL DEFAULT 0,
  `averageRating` decimal(3,2) NOT NULL DEFAULT 0.00 COMMENT 'Average rating from reviews (0.00 to 5.00)',
  `reviewCount` int(11) NOT NULL DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `shortDescription`, `description`, `categoryId`, `subCategoryId`, `brandId`, `basePrice`, `salePrice`, `costPrice`, `taxRate`, `stockQuantity`, `lowStockThreshold`, `weight`, `dimensions`, `isActive`, `isFeatured`, `isTrending`, `isNewArrival`, `isBestseller`, `status`, `publishedAt`, `displayOrder`, `viewCount`, `salesCount`, `averageRating`, `reviewCount`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(11, 'Classic Crew Neck T-Shirt', 'classic-crew-neck-t-shirt', 'MTS-001', 'Comfortable cotton crew neck t-shirt', 'Premium quality 100% cotton crew neck t-shirt. Perfect for casual everyday wear.', 1, 1, 1, 200.00, 24.99, 15.00, 18.00, 140, 10, 0.20, '{\"length\":70,\"width\":50,\"height\":1}', 1, 1, 1, 1, 0, 'published', NULL, 1, 2, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:45:05', NULL),
(12, 'Premium Cotton Polo T-Shirt', 'premium-cotton-polo-t-shirt', 'MTS-002', 'Elegant polo t-shirt for semi-formal occasions', 'Stylish polo t-shirt made from premium cotton blend. Features classic collar and button placket.', 1, 1, 9, 49.99, 39.99, 25.00, 18.00, 0, 10, 0.25, '{\"length\":72,\"width\":52,\"height\":1}', 1, 1, 0, 1, 0, 'published', NULL, 2, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(13, 'Slim Fit Formal Shirt', 'slim-fit-formal-shirt', 'MSH-001', 'Professional slim fit dress shirt', 'Crisp cotton formal shirt with slim fit design. Perfect for office and formal events.', 1, 2, 10, 59.99, NULL, 30.00, 18.00, 0, 8, 0.30, '{\"length\":75,\"width\":55,\"height\":2}', 1, 1, 1, 0, 0, 'published', NULL, 3, 2, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:26:30', NULL),
(14, 'Casual Checkered Shirt', 'casual-checkered-shirt', 'MSH-002', 'Trendy checkered casual shirt', 'Comfortable casual shirt with modern check pattern. Made from soft cotton fabric.', 1, 2, 3, 44.99, 34.99, 22.00, 18.00, 0, 10, 0.28, '{\"length\":74,\"width\":54,\"height\":2}', 1, 0, 1, 1, 0, 'published', NULL, 4, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(15, 'Slim Fit Stretch Jeans', 'slim-fit-stretch-jeans', 'MJN-001', 'Comfortable stretch denim jeans', 'Premium quality slim fit jeans with stretch fabric. Features classic 5-pocket design.', 1, 3, 5, 79.99, 69.99, 40.00, 18.00, 0, 12, 0.65, '{\"length\":100,\"width\":40,\"height\":3}', 1, 1, 1, 0, 0, 'published', NULL, 5, 4, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:44:02', NULL),
(16, 'Regular Fit Classic Denim', 'regular-fit-classic-denim', 'MJN-002', 'Timeless regular fit jeans', 'Classic regular fit jeans in authentic denim. Durable construction with traditional styling.', 1, 3, 5, 69.99, NULL, 35.00, 18.00, 0, 10, 0.70, '{\"length\":102,\"width\":42,\"height\":3}', 1, 1, 0, 0, 0, 'published', NULL, 6, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(17, 'Floral Print Casual Top', 'floral-print-casual-top', 'WTP-001', 'Beautiful floral printed top', 'Elegant floral print top made from soft, breathable fabric. Perfect for casual outings.', 2, 6, 3, 34.99, 27.99, 18.00, 18.00, 0, 15, 0.18, '{\"length\":60,\"width\":45,\"height\":1}', 1, 1, 1, 1, 0, 'published', NULL, 7, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(18, 'Elegant Silk Blend Blouse', 'elegant-silk-blend-blouse', 'WTP-002', 'Luxurious silk blend blouse', 'Premium silk blend blouse with elegant drape. Perfect for formal occasions.', 2, 6, 9, 64.99, NULL, 32.00, 18.00, 0, 8, 0.15, '{\"length\":62,\"width\":46,\"height\":1}', 1, 1, 1, 1, 0, 'published', NULL, 8, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(19, 'Summer Maxi Dress', 'summer-maxi-dress', 'WDR-001', 'Flowing maxi dress for summer', 'Beautiful flowing maxi dress perfect for summer occasions. Lightweight fabric with elegant print.', 2, 7, 8, 89.99, 74.99, 45.00, 18.00, 0, 10, 0.35, '{\"length\":140,\"width\":50,\"height\":2}', 1, 1, 1, 1, 0, 'published', NULL, 9, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(20, 'Little Black Dress', 'little-black-dress', 'WDR-002', 'Classic little black dress', 'Timeless little black dress suitable for any occasion. Flattering fit with elegant design.', 2, 7, 3, 99.99, 84.99, 50.00, 18.00, 0, 8, 0.30, '{\"length\":90,\"width\":45,\"height\":2}', 1, 1, 1, 0, 0, 'published', NULL, 10, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(21, 'Air Max Running Sneakers', 'air-max-running-sneakers', 'SNK-001', 'Premium running sneakers', 'High-performance running sneakers with advanced cushioning. Breathable mesh upper.', 5, 21, 1, 129.99, 109.99, 65.00, 18.00, 0, 10, 0.80, '{\"length\":30,\"width\":20,\"height\":12}', 1, 1, 1, 1, 0, 'published', NULL, 11, 2, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:22:01', NULL),
(22, 'Classic White Sneakers', 'classic-white-sneakers', 'SNK-002', 'Versatile white sneakers', 'Clean and minimal white sneakers. Perfect for casual everyday wear. Comfortable leather construction.', 5, 21, 2, 89.99, NULL, 45.00, 18.00, 0, 15, 0.75, '{\"length\":29,\"width\":19,\"height\":11}', 1, 1, 1, 1, 0, 'published', NULL, 12, 0, 0, 0.00, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `attributeName` varchar(100) NOT NULL COMMENT 'Attribute name: fit, fabric, pattern, occasion, etc.',
  `attributeValue` varchar(255) NOT NULL COMMENT 'Attribute value',
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `variantId` int(11) DEFAULT NULL COMMENT 'Link image to specific variant (null = product image)',
  `imagePath` varchar(500) NOT NULL COMMENT 'Image file path',
  `altText` varchar(255) DEFAULT NULL COMMENT 'SEO alt text for image',
  `title` varchar(255) DEFAULT NULL COMMENT 'Image title',
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Is this the primary/featured image',
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `imageType` enum('product','variant','gallery','thumbnail') NOT NULL DEFAULT 'product',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_meta`
--

CREATE TABLE `product_meta` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `metaTitle` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `metaDescription` text DEFAULT NULL COMMENT 'SEO meta description',
  `metaKeywords` text DEFAULT NULL COMMENT 'SEO keywords (comma-separated)',
  `canonicalUrl` varchar(500) DEFAULT NULL COMMENT 'Canonical URL for SEO',
  `ogTitle` varchar(255) DEFAULT NULL COMMENT 'Open Graph title for social sharing',
  `ogDescription` text DEFAULT NULL COMMENT 'Open Graph description',
  `ogImage` varchar(500) DEFAULT NULL COMMENT 'Open Graph image URL',
  `twitterCard` varchar(50) DEFAULT NULL COMMENT 'Twitter card type',
  `focusKeyphrase` varchar(255) DEFAULT NULL COMMENT 'Primary focus keyphrase for SEO',
  `schemaMarkup` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON-LD schema markup for rich snippets' CHECK (json_valid(`schemaMarkup`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL COMMENT 'Variant-specific SKU',
  `size` varchar(20) DEFAULT NULL COMMENT 'Size: XS, S, M, L, XL, XXL, XXXL, etc.',
  `color` varchar(50) DEFAULT NULL COMMENT 'Color name: Red, Blue, Black, etc.',
  `colorCode` varchar(20) DEFAULT NULL COMMENT 'Hex color code: #FF0000, #0000FF, etc.',
  `material` varchar(100) DEFAULT NULL COMMENT 'Material/Fabric: Cotton, Polyester, etc.',
  `style` varchar(100) DEFAULT NULL COMMENT 'Style variant: Slim Fit, Regular Fit, etc.',
  `price` decimal(10,2) DEFAULT NULL COMMENT 'Variant-specific price (overrides base price if set)',
  `salePrice` decimal(10,2) DEFAULT NULL COMMENT 'Variant-specific sale price',
  `stockQuantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Stock for this specific variant',
  `weight` decimal(8,2) DEFAULT NULL COMMENT 'Variant-specific weight in kg',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Is this the default variant to display',
  `displayOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `productId`, `sku`, `size`, `color`, `colorCode`, `material`, `style`, `price`, `salePrice`, `stockQuantity`, `weight`, `isActive`, `isDefault`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
(1, 11, 'MTS-001-BLK-S', 'S', 'Black', '#000000', NULL, NULL, 24.99, NULL, 25, NULL, 1, 0, 1, '2026-09-09 14:13:53', '2026-09-09 14:45:05'),
(2, 11, 'MTS-001-BLK-M', 'M', 'Black', '#000000', NULL, NULL, 24.99, NULL, 30, NULL, 1, 1, 2, '2026-09-09 14:13:53', '2026-09-09 14:45:05'),
(3, 11, 'MTS-001-BLK-L', 'L', 'Black', '#000000', NULL, NULL, 24.99, NULL, 28, NULL, 1, 0, 3, '2026-09-09 14:13:53', '2026-09-09 14:45:05'),
(4, 11, 'MTS-001-WHT-S', 'S', 'White', '#FFFFFF', NULL, NULL, 24.99, NULL, 22, NULL, 1, 0, 4, '2026-09-09 14:13:53', '2026-09-09 14:45:05'),
(5, 11, 'MTS-001-WHT-M', 'M', 'White', '#FFFFFF', NULL, NULL, 24.99, NULL, 35, NULL, 1, 0, 5, '2026-09-09 14:13:53', '2026-09-09 14:45:05'),
(6, 12, 'MTS-002-BLK-M', 'M', 'Black', '#000000', NULL, NULL, 39.99, NULL, 20, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(7, 12, 'MTS-002-WHT-M', 'M', 'White', '#FFFFFF', NULL, NULL, 39.99, NULL, 22, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(8, 12, 'MTS-002-GRY-L', 'L', 'Grey', '#808080', NULL, NULL, 39.99, NULL, 15, NULL, 1, 0, 3, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(9, 13, 'MSH-001-WHT-40', '40', 'White', '#FFFFFF', NULL, NULL, 59.99, NULL, 20, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(10, 13, 'MSH-001-BLU-40', '40', 'Light Blue', '#ADD8E6', NULL, NULL, 59.99, NULL, 15, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(11, 14, 'MSH-002-RED-M', 'M', 'Red Check', '#DC143C', NULL, NULL, 34.99, NULL, 18, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(12, 14, 'MSH-002-BLU-L', 'L', 'Blue Check', '#4169E1', NULL, NULL, 34.99, NULL, 18, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(13, 15, 'MJN-001-BLK-32', '32', 'Black', '#000000', NULL, NULL, 69.99, NULL, 15, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(14, 15, 'MJN-001-BLU-32', '32', 'Dark Blue', '#00008B', NULL, NULL, 69.99, NULL, 20, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(15, 16, 'MJN-002-BLU-32', '32', 'Blue Denim', '#1560BD', NULL, NULL, 69.99, NULL, 22, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(16, 16, 'MJN-002-BLU-34', '34', 'Blue Denim', '#1560BD', NULL, NULL, 69.99, NULL, 20, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(17, 17, 'WTP-001-PNK-M', 'M', 'Pink Floral', '#FF69B4', NULL, NULL, 27.99, NULL, 25, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(18, 17, 'WTP-001-BLU-M', 'M', 'Blue Floral', '#4682B4', NULL, NULL, 27.99, NULL, 22, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(19, 18, 'WTP-002-WHT-M', 'M', 'White', '#FFFFFF', NULL, NULL, 64.99, NULL, 15, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(20, 18, 'WTP-002-BLK-M', 'M', 'Black', '#000000', NULL, NULL, 64.99, NULL, 18, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(21, 19, 'WDR-001-FLR-M', 'M', 'Floral Multi', '#FF6347', NULL, NULL, 74.99, NULL, 15, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(22, 20, 'WDR-002-BLK-S', 'S', 'Black', '#000000', NULL, NULL, 84.99, NULL, 12, NULL, 1, 0, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(23, 20, 'WDR-002-BLK-M', 'M', 'Black', '#000000', NULL, NULL, 84.99, NULL, 15, NULL, 1, 1, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(24, 21, 'SNK-001-BLK-9', '9', 'Black/Red', '#000000', NULL, NULL, 109.99, NULL, 15, NULL, 1, 1, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(25, 21, 'SNK-001-WHT-9', '9', 'White/Blue', '#FFFFFF', NULL, NULL, 109.99, NULL, 10, NULL, 1, 0, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(26, 22, 'SNK-002-WHT-8', '8', 'White', '#FFFFFF', NULL, NULL, 89.99, NULL, 20, NULL, 1, 0, 1, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(27, 22, 'SNK-002-WHT-9', '9', 'White', '#FFFFFF', NULL, NULL, 89.99, NULL, 25, NULL, 1, 1, 2, '2026-09-09 14:13:53', '2026-09-09 14:13:53');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `isVerifiedPurchase` tinyint(1) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `helpfulCount` int(11) DEFAULT 0,
  `adminResponse` text DEFAULT NULL,
  `adminRespondedAt` datetime DEFAULT NULL,
  `adminRespondedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'ADMIN', '2026-09-09 14:09:14', '2026-09-09 14:09:14'),
(2, 'CUSTOMER', '2026-09-09 14:09:14', '2026-09-09 14:09:14');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251008000001-create-roles.js'),
('20251008000002-create-users.js'),
('20251031163136-create-category.js'),
('20251101072039-create-sub-category.js'),
('20251106000001-create-brands.js'),
('20251106000002-create-products.js'),
('20251106000003-create-product-variants.js'),
('20251106000004-create-product-images.js'),
('20251106000005-create-product-attributes.js'),
('20251106000006-create-product-meta.js'),
('20251108000001-fix-category-slug-unique-constraint.js'),
('20251108000002-fix-subcategory-slug-unique-constraint.js'),
('20251108000003-fix-brand-slug-unique-constraint.js'),
('20251108000004-fix-product-slug-sku-unique-constraint.js'),
('20251110000001-create-site-settings.js'),
('20251110000002-add-customer-fields.js'),
('20251125000001-create-cart.js'),
('20251125000002-create-wishlist.js'),
('20251126000001-create-orders.js'),
('20251126000002-create-order-items.js'),
('20251127000001-create-reviews.js'),
('20251127191438-create-contacts.js'),
('20251129000001-create-cms-pages.js'),
('20251129000001-create-hero-sections.js'),
('20251129105405-add-social-media-fields-to-site-settings.js');

-- --------------------------------------------------------

--
-- Table structure for table `sitesettings`
--

CREATE TABLE `sitesettings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(100) NOT NULL DEFAULT 'Beestee',
  `site_tagline` varchar(200) DEFAULT NULL,
  `site_description` text DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `whatsapp_number` varchar(20) DEFAULT NULL,
  `contact_address` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `favicon_url` varchar(500) DEFAULT NULL,
  `facebook_url` varchar(200) DEFAULT NULL,
  `twitter_url` varchar(200) DEFAULT NULL,
  `instagram_url` varchar(200) DEFAULT NULL,
  `linkedin_url` varchar(200) DEFAULT NULL,
  `youtube_url` varchar(200) DEFAULT NULL,
  `pinterest_url` varchar(200) DEFAULT NULL,
  `tiktok_url` varchar(200) DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `currency_symbol` varchar(5) NOT NULL DEFAULT '$',
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `date_format` varchar(20) NOT NULL DEFAULT 'YYYY-MM-DD',
  `time_format` varchar(20) NOT NULL DEFAULT 'HH:mm:ss',
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT 0,
  `maintenance_message` text DEFAULT NULL,
  `allow_registration` tinyint(1) NOT NULL DEFAULT 1,
  `terms_conditions_url` varchar(500) DEFAULT NULL,
  `privacy_policy_url` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sitesettings`
--

INSERT INTO `sitesettings` (`id`, `site_name`, `site_tagline`, `site_description`, `contact_email`, `contact_phone`, `whatsapp_number`, `contact_address`, `logo_url`, `favicon_url`, `facebook_url`, `twitter_url`, `instagram_url`, `linkedin_url`, `youtube_url`, `pinterest_url`, `tiktok_url`, `meta_title`, `meta_description`, `meta_keywords`, `currency`, `currency_symbol`, `timezone`, `date_format`, `time_format`, `maintenance_mode`, `maintenance_message`, `allow_registration`, `terms_conditions_url`, `privacy_policy_url`, `createdAt`, `updatedAt`) VALUES
(1, 'Beestee', 'Your Premium E-Commerce Store', 'Shop the best products at amazing prices', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', '$', 'UTC', 'YYYY-MM-DD', 'HH:mm:ss', 0, NULL, 1, NULL, NULL, '2026-09-09 14:09:15', '2026-09-09 14:09:15');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `isFeatured` tinyint(1) DEFAULT 0,
  `createdBy` varchar(255) DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `categoryId`, `name`, `slug`, `description`, `image`, `displayOrder`, `isActive`, `isFeatured`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'T-Shirts', 'mens-t-shirts', 'Casual and formal t-shirts', NULL, 1, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(2, 1, 'Shirts', 'mens-shirts', 'Formal and casual shirts', NULL, 2, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(3, 1, 'Jeans', 'mens-jeans', 'Denim jeans in various styles', NULL, 3, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(4, 1, 'Trousers', 'mens-trousers', 'Formal and casual trousers', NULL, 4, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(5, 1, 'Jackets', 'mens-jackets', 'Stylish jackets and blazers', NULL, 5, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(6, 2, 'Tops', 'womens-tops', 'Trendy tops and blouses', NULL, 1, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(7, 2, 'Dresses', 'womens-dresses', 'Beautiful dresses for every occasion', NULL, 2, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(8, 2, 'Jeans', 'womens-jeans', 'Stylish denim jeans', NULL, 3, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(9, 2, 'Skirts', 'womens-skirts', 'Elegant skirts in various styles', NULL, 4, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(10, 2, 'Jackets', 'womens-jackets', 'Fashionable jackets and coats', NULL, 5, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(11, 3, 'Watches', 'mens-watches', 'Stylish watches for men', NULL, 1, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(12, 3, 'Belts', 'mens-belts', 'Leather and fabric belts', NULL, 2, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(13, 3, 'Wallets', 'mens-wallets', 'Premium leather wallets', NULL, 3, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(14, 3, 'Sunglasses', 'mens-sunglasses', 'Fashionable sunglasses', NULL, 4, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(15, 3, 'Bags', 'mens-bags', 'Backpacks and messenger bags', NULL, 5, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(16, 4, 'Handbags', 'womens-handbags', 'Elegant handbags and purses', NULL, 1, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(17, 4, 'Jewelry', 'womens-jewelry', 'Beautiful jewelry collections', NULL, 2, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(18, 4, 'Scarves', 'womens-scarves', 'Fashionable scarves and stoles', NULL, 3, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(19, 4, 'Sunglasses', 'womens-sunglasses', 'Trendy sunglasses', NULL, 4, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(20, 4, 'Watches', 'womens-watches', 'Elegant watches for women', NULL, 5, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(21, 5, 'Sneakers', 'sneakers', 'Comfortable sneakers for all', NULL, 1, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(22, 5, 'Formal Shoes', 'formal-shoes', 'Elegant formal footwear', NULL, 2, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(23, 5, 'Sandals', 'sandals', 'Casual and comfortable sandals', NULL, 3, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(24, 5, 'Boots', 'boots', 'Stylish boots for all seasons', NULL, 4, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(25, 5, 'Sports Shoes', 'sports-shoes', 'Performance sports footwear', NULL, 5, 1, 0, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53', NULL),
(26, 1, 'oversized tshirt', 'oversized-tshirt', 'hell this is demo ', NULL, 10, 1, 0, NULL, NULL, '2026-09-09 14:43:23', '2026-09-09 14:43:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `status` enum('active','inactive','blocked') NOT NULL DEFAULT 'active',
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `zipCode` varchar(20) DEFAULT NULL,
  `profileImage` varchar(500) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `lastLoginAt` datetime DEFAULT NULL,
  `otpSecret` varchar(255) DEFAULT NULL,
  `otpExpiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `roleId`, `status`, `address`, `city`, `state`, `country`, `zipCode`, `profileImage`, `dateOfBirth`, `gender`, `lastLoginAt`, `otpSecret`, `otpExpiry`, `createdAt`, `updatedAt`) VALUES
(1, 'Beetes Admin', 'beetes-admin@yopmail.com', 'admin', '$2b$10$nw.V9VmPGIxfve9ccfY/e.GhjSQxfV1O0Lzl3WxT0.9yyAWKFZhXG', 1, 'active', NULL, NULL, NULL, 'India', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-09 14:13:53', '2026-09-09 14:13:53'),
(2, 'OMGIRI GOSWAMI', 'omg60963@gmail.com', '9427734998', NULL, 2, 'active', NULL, NULL, NULL, 'India', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-09 14:25:09', '2026-09-09 14:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `brands_slug_deleted_at_unique` (`slug`,`deletedAt`),
  ADD KEY `idx_brand_active_featured` (`isActive`,`isFeatured`),
  ADD KEY `brands_is_active_is_featured` (`isActive`,`isFeatured`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_variant_cart` (`userId`,`productId`,`variantId`),
  ADD KEY `variantId` (`variantId`),
  ADD KEY `idx_cart_user` (`userId`),
  ADD KEY `idx_cart_product` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_deleted_at_unique` (`slug`,`deletedAt`),
  ADD KEY `parentId` (`parentId`),
  ADD KEY `categories_slug` (`slug`),
  ADD KEY `categories_is_active` (`isActive`),
  ADD KEY `categories_is_featured` (`isFeatured`);

--
-- Indexes for table `cmspages`
--
ALTER TABLE `cmspages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `cms_pages_slug` (`slug`),
  ADD KEY `cms_pages_is_active` (`is_active`),
  ADD KEY `cms_pages_page_type` (`page_type`),
  ADD KEY `cms_pages_show_in_footer` (`show_in_footer`),
  ADD KEY `cms_pages_show_in_header` (`show_in_header`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacts_email` (`email`),
  ADD KEY `contacts_status` (`status`),
  ADD KEY `contacts_created_at` (`created_at`);

--
-- Indexes for table `herosections`
--
ALTER TABLE `herosections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_sections_is_active` (`is_active`),
  ADD KEY `hero_sections_display_order` (`display_order`),
  ADD KEY `hero_sections_is_active_display_order` (`is_active`,`display_order`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderNumber` (`orderNumber`),
  ADD KEY `idx_orders_user` (`userId`),
  ADD KEY `idx_orders_number` (`orderNumber`),
  ADD KEY `idx_orders_status` (`orderStatus`),
  ADD KEY `idx_orders_created` (`createdAt`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `variantId` (`variantId`),
  ADD KEY `idx_order_items_order` (`orderId`),
  ADD KEY `idx_order_items_product` (`productId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_deleted_at_unique` (`slug`,`deletedAt`),
  ADD UNIQUE KEY `products_sku_deleted_at_unique` (`sku`,`deletedAt`),
  ADD KEY `subCategoryId` (`subCategoryId`),
  ADD KEY `createdBy` (`createdBy`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `idx_product_category` (`categoryId`,`subCategoryId`),
  ADD KEY `idx_product_brand` (`brandId`),
  ADD KEY `idx_product_status` (`status`,`isActive`),
  ADD KEY `idx_product_flags` (`isFeatured`,`isTrending`,`isNewArrival`,`isBestseller`),
  ADD KEY `idx_product_price` (`basePrice`,`salePrice`),
  ADD KEY `products_category_id_sub_category_id` (`categoryId`,`subCategoryId`),
  ADD KEY `products_brand_id` (`brandId`),
  ADD KEY `products_status_is_active` (`status`,`isActive`),
  ADD KEY `products_is_featured_is_trending_is_new_arrival_is_bestseller` (`isFeatured`,`isTrending`,`isNewArrival`,`isBestseller`),
  ADD KEY `products_base_price_sale_price` (`basePrice`,`salePrice`);

--
-- Indexes for table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_attribute_product` (`productId`),
  ADD KEY `idx_attribute_name_value` (`attributeName`,`attributeValue`),
  ADD KEY `product_attributes_product_id` (`productId`),
  ADD KEY `product_attributes_attribute_name_attribute_value` (`attributeName`,`attributeValue`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_image_product` (`productId`),
  ADD KEY `idx_image_variant` (`variantId`),
  ADD KEY `idx_image_primary_order` (`isPrimary`,`displayOrder`),
  ADD KEY `product_images_product_id` (`productId`),
  ADD KEY `product_images_variant_id` (`variantId`),
  ADD KEY `product_images_is_primary_display_order` (`isPrimary`,`displayOrder`);

--
-- Indexes for table `product_meta`
--
ALTER TABLE `product_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productId` (`productId`),
  ADD UNIQUE KEY `idx_meta_product` (`productId`),
  ADD UNIQUE KEY `product_meta_product_id` (`productId`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `idx_variant_sku` (`sku`),
  ADD UNIQUE KEY `product_variants_sku` (`sku`),
  ADD KEY `idx_variant_product` (`productId`),
  ADD KEY `idx_variant_size_color` (`size`,`color`),
  ADD KEY `idx_variant_availability` (`isActive`,`stockQuantity`),
  ADD KEY `product_variants_product_id` (`productId`),
  ADD KEY `product_variants_size_color` (`size`,`color`),
  ADD KEY `product_variants_is_active_stock_quantity` (`isActive`,`stockQuantity`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_review` (`productId`,`userId`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `adminRespondedBy` (`adminRespondedBy`),
  ADD KEY `idx_product_status` (`productId`,`status`),
  ADD KEY `idx_user_id` (`userId`),
  ADD KEY `reviews_product_id` (`productId`),
  ADD KEY `reviews_user_id` (`userId`),
  ADD KEY `reviews_rating_status` (`rating`,`status`),
  ADD KEY `reviews_is_verified_purchase` (`isVerifiedPurchase`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sitesettings`
--
ALTER TABLE `sitesettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sub_categories_slug_deleted_at_unique` (`slug`,`deletedAt`),
  ADD KEY `sub_categories_slug` (`slug`),
  ADD KEY `sub_categories_category_id` (`categoryId`),
  ADD KEY `sub_categories_is_active` (`isActive`),
  ADD KEY `sub_categories_is_featured` (`isFeatured`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_wishlist` (`userId`,`productId`),
  ADD KEY `idx_wishlist_user` (`userId`),
  ADD KEY `idx_wishlist_product` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cmspages`
--
ALTER TABLE `cmspages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `herosections`
--
ALTER TABLE `herosections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_meta`
--
ALTER TABLE `product_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sitesettings`
--
ALTER TABLE `sitesettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_meta`
--
ALTER TABLE `product_meta`
  ADD CONSTRAINT `product_meta_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`adminRespondedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
