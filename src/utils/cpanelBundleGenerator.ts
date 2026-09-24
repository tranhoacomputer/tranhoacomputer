import JSZip from 'jszip';
import { ShopDatabase } from '../types/shop';

/**
 * Generate full SQL Dump script compatible with MySQL 5.7, 8.0, MariaDB and phpMyAdmin.
 * Automatically creates all tables and seeds current data.
 */
export function generateSqlDump(db: ShopDatabase): string {
  const timestamp = new Date().toISOString();
  
  return `-- ==========================================================
-- TRẦN HOA COMPUTER & NEXUS TECH LAB - cPanel MySQL Database
-- Tự động khởi tạo cấu trúc bảng & nhập dữ liệu
-- Thời gian tạo: ${timestamp}
-- Máy chủ hỗ trợ: cPanel / phpMyAdmin / MySQL 5.7+ / MariaDB 10.3+
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- 1. BẢNG CÀI ĐẶT CỬA HÀNG (shop_settings)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`shop_settings\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`store_name\` VARCHAR(255) NOT NULL,
  \`tagline\` VARCHAR(500) DEFAULT NULL,
  \`hotline\` VARCHAR(50) DEFAULT NULL,
  \`zalo\` VARCHAR(50) DEFAULT NULL,
  \`email\` VARCHAR(150) DEFAULT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`working_hours\` VARCHAR(255) DEFAULT NULL,
  \`bank_name\` VARCHAR(100) DEFAULT NULL,
  \`bank_account\` VARCHAR(100) DEFAULT NULL,
  \`bank_account_name\` VARCHAR(150) DEFAULT NULL,
  \`target_province\` VARCHAR(100) DEFAULT 'Hải Phòng',
  \`province_delivery_notice\` TEXT DEFAULT NULL,
  \`province_express_hours\` VARCHAR(50) DEFAULT '1 - 2 giờ',
  \`province_free_ship_threshold\` INT(11) DEFAULT 500000,
  \`enable_cod\` TINYINT(1) DEFAULT 1,
  \`enable_vietqr\` TINYINT(1) DEFAULT 1,
  \`enable_installment\` TINYINT(1) DEFAULT 1,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. BẢNG SẢN PHẨM (products)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`price\` BIGINT(20) NOT NULL,
  \`original_price\` BIGINT(20) DEFAULT NULL,
  \`brand\` VARCHAR(100) DEFAULT NULL,
  \`image_url\` TEXT DEFAULT NULL,
  \`in_stock\` TINYINT(1) DEFAULT 1,
  \`stock_quantity\` INT(11) DEFAULT 10,
  \`is_flash_sale\` TINYINT(1) DEFAULT 0,
  \`flash_sale_discount_percent\` INT(11) DEFAULT 0,
  \`warranty_months\` INT(11) DEFAULT 24,
  \`description\` TEXT DEFAULT NULL,
  \`specs_json\` LONGTEXT DEFAULT NULL,
  \`tags_json\` LONGTEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_category\` (\`category\`),
  KEY \`idx_brand\` (\`brand\`),
  KEY \`idx_flash_sale\` (\`is_flash_sale\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. BẢNG DỊCH VỤ SỬA CHỮA PHÒNG LAB (services)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`services\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`price_estimate\` VARCHAR(150) DEFAULT NULL,
  \`raw_price\` BIGINT(20) DEFAULT 0,
  \`turnaround_time\` VARCHAR(100) DEFAULT '30 - 60 Phút',
  \`warranty_months\` INT(11) DEFAULT 6,
  \`icon_name\` VARCHAR(50) DEFAULT 'Wrench',
  \`is_popular\` TINYINT(1) DEFAULT 0,
  \`description\` TEXT DEFAULT NULL,
  \`highlights_json\` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. BẢNG ĐƠN HÀNG & LỊCH KHÁM MÁY (orders)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`order_code\` VARCHAR(50) NOT NULL,
  \`order_type\` ENUM('product_order','repair_appointment') DEFAULT 'product_order',
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(50) NOT NULL,
  \`customer_address\` TEXT DEFAULT NULL,
  \`total_amount\` BIGINT(20) NOT NULL DEFAULT 0,
  \`payment_method\` VARCHAR(50) DEFAULT 'cod',
  \`payment_status\` VARCHAR(50) DEFAULT 'pending',
  \`status\` VARCHAR(50) DEFAULT 'pending',
  \`device_issue\` TEXT DEFAULT NULL,
  \`appointment_time\` VARCHAR(100) DEFAULT NULL,
  \`items_json\` LONGTEXT DEFAULT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`order_code\` (\`order_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. BẢNG CHI NHÁNH SIÊU THỊ TOÀN QUỐC (branches)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`branches\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT NULL,
  \`working_hours\` VARCHAR(150) DEFAULT '8:00 - 21:30',
  \`has_lab\` TINYINT(1) DEFAULT 1,
  \`is_flagship\` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (\`id\`),
  KEY \`idx_city\` (\`city\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. BẢNG NỘI DUNG CMS & BỐ CỤC (website_cms)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`website_cms\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`cms_key\` VARCHAR(100) NOT NULL,
  \`cms_value\` LONGTEXT DEFAULT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`cms_key\` (\`cms_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. BẢNG MÃ GIẢM GIÁ (vouchers)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`vouchers\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`code\` VARCHAR(50) NOT NULL,
  \`discount_type\` ENUM('fixed','percent') DEFAULT 'fixed',
  \`discount_value\` BIGINT(20) NOT NULL,
  \`min_order_value\` BIGINT(20) DEFAULT 0,
  \`usage_limit\` INT(11) DEFAULT 100,
  \`used_count\` INT(11) DEFAULT 0,
  \`expires_at\` VARCHAR(50) DEFAULT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- NHẬP DỮ LIỆU KHỞI TẠO TỰ ĐỘNG (SEED DATA)
-- ==========================================================

-- Nhập cài đặt
INSERT INTO \`shop_settings\` (\`store_name\`, \`tagline\`, \`hotline\`, \`zalo\`, \`email\`, \`address\`, \`working_hours\`, \`bank_name\`, \`bank_account\`, \`bank_account_name\`, \`target_province\`)
VALUES (
  ${escapeSql(db.settings.storeName || 'TRẦN HOA COMPUTER')},
  ${escapeSql(db.settings.tagline || 'Cửa Hàng Máy Tính & Trung Tâm Kỹ Thuật Duy Nhất Tại Phú Thịnh - Thái Nguyên')},
  ${escapeSql(db.settings.hotline || '0963284044')},
  ${escapeSql(db.settings.zalo || '0963284044')},
  ${escapeSql(db.settings.email || 'hotrokhachhang@tranhoacomputer.site')},
  ${escapeSql(db.settings.address || 'Phú Thịnh - Thái Nguyên')},
  ${escapeSql(db.settings.workingHours || '08:00 - 21:30 (Mở cửa tất cả các ngày trong tuần & ngày lễ)')},
  ${escapeSql(db.settings.bankName || 'MB Bank - Ngân Hàng Quân Đội')},
  ${escapeSql(db.settings.bankAccount || '0963284044')},
  ${escapeSql(db.settings.bankAccountName || 'TRAN HOA COMPUTER')},
  ${escapeSql(db.settings.targetProvince || 'Thái Nguyên')}
) ON DUPLICATE KEY UPDATE \`store_name\` = VALUES(\`store_name\`);

-- Nhập toàn bộ sản phẩm
${db.products
  .map(
    (p) => `INSERT INTO \`products\` (\`id\`, \`name\`, \`category\`, \`price\`, \`original_price\`, \`brand\`, \`image_url\`, \`in_stock\`, \`stock_quantity\`, \`is_flash_sale\`, \`flash_sale_discount_percent\`, \`warranty_months\`, \`description\`, \`specs_json\`, \`tags_json\`)
VALUES (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.category)}, ${p.price}, ${p.originalPrice || p.price}, ${escapeSql(p.brand || 'Chính hãng')}, ${escapeSql(p.imageUrl)}, ${p.inStock ? 1 : 0}, ${p.stockCount || 10}, ${p.isFlashSale ? 1 : 0}, ${p.discountPercent || 0}, ${escapeSql(p.specs?.warranty || '24 tháng')}, ${escapeSql(p.description)}, ${escapeSql(JSON.stringify(p.specs || {}))}, ${escapeSql(JSON.stringify(p.badge ? [p.badge] : []))})
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`price\` = VALUES(\`price\`);`
  )
  .join('\n')}

-- Nhập dịch vụ kỹ thuật
${db.services
  .map(
    (s) => `INSERT INTO \`services\` (\`id\`, \`name\`, \`category\`, \`price_estimate\`, \`raw_price\`, \`turnaround_time\`, \`warranty_months\`, \`icon_name\`, \`is_popular\`, \`description\`, \`highlights_json\`)
VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.category)}, ${escapeSql(s.priceEstimate)}, ${s.rawPrice || 0}, ${escapeSql(s.turnaroundTime)}, ${s.warrantyMonths || 6}, ${escapeSql(s.iconName)}, ${s.isPopular ? 1 : 0}, ${escapeSql(s.description)}, ${escapeSql(JSON.stringify(s.highlights || []))})
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`price_estimate\` = VALUES(\`price_estimate\`);`
  )
  .join('\n')}

-- Nhập các chi nhánh
${(db.branches || [])
  .map(
    (b) => `INSERT INTO \`branches\` (\`id\`, \`name\`, \`city\`, \`address\`, \`phone\`, \`working_hours\`, \`has_lab\`, \`is_flagship\`)
VALUES (${escapeSql(b.id)}, ${escapeSql(b.name)}, ${escapeSql(b.cityName || b.city)}, ${escapeSql(b.address)}, ${escapeSql(b.hotline || '0963284044')}, ${escapeSql(b.hours || '8:00 - 21:30')}, ${b.features?.includes('lab') ? 1 : 0}, ${b.isMain ? 1 : 0})
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);`
  )
  .join('\n')}

-- Lưu cấu hình CMS
INSERT INTO \`website_cms\` (\`cms_key\`, \`cms_value\`)
VALUES ('full_content_json', ${escapeSql(JSON.stringify(db.websiteContent))})
ON DUPLICATE KEY UPDATE \`cms_value\` = VALUES(\`cms_value\`);

COMMIT;
`;
}

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  const str = String(val);
  return `'${str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  })}'`;
}

/**
 * Generate PHP cPanel Auto-Installer script (install.php)
 * User can open https://domain.com/install.php to auto-create MySQL tables with 1 click.
 */
export function generateInstallPhp(): string {
  return `<?php
/**
 * TRẦN HOA COMPUTER - CPANEL ONE-CLICK DATABASE AUTO-INSTALLER
 * Script tự động tạo bảng cơ sở dữ liệu và nhập dữ liệu ban đầu
 */
header('Content-Type: text/html; charset=utf-8');

$configFile = __DIR__ . '/config.php';
$sqlFile = __DIR__ . '/database.sql';
$jsonBackup = __DIR__ . '/data.json';

$message = '';
$isSuccess = false;

// Xử lý gửi form cài đặt MySQL
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['install_db'])) {
    $dbHost = trim($_POST['db_host'] ?? 'localhost');
    $dbName = trim($_POST['db_name'] ?? '');
    $dbUser = trim($_POST['db_user'] ?? '');
    $dbPass = $_POST['db_pass'] ?? '';

    if (empty($dbName) || empty($dbUser)) {
        $message = 'Vui lòng nhập đầy đủ Tên CSDL (DB Name) và Tên Người Dùng (DB User)!';
    } else {
        try {
            // Thử kết nối PDO MySQL
            $pdo = new PDO("mysql:host={$dbHost};charset=utf8mb4", $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            // Tự động tạo CSDL nếu chưa tồn tại
            $pdo->exec("CREATE DATABASE IF NOT EXISTS \`{$dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $pdo->exec("USE \`{$dbName}\`;");

            // Đọc và chạy tệp database.sql
            if (file_exists($sqlFile)) {
                $sqlContent = file_get_contents($sqlFile);
                
                // Tách từng câu lệnh SQL
                $statements = array_filter(array_map('trim', explode(";\n", $sqlContent)));
                foreach ($statements as $stmt) {
                    if (!empty($stmt) && !str_starts_with($stmt, '--')) {
                        $pdo->exec($stmt);
                    }
                }
            }

            // Ghi tệp config.php tự động
            $configContent = "<?php\\n" .
                "// Tự động tạo bởi TRẦN HOA COMPUTER Installer\\n" .
                "define('DB_HOST', " . var_export($dbHost, true) . ");\\n" .
                "define('DB_NAME', " . var_export($dbName, true) . ");\\n" .
                "define('DB_USER', " . var_export($dbUser, true) . ");\\n" .
                "define('DB_PASS', " . var_export($dbPass, true) . ");\\n" .
                "define('INSTALLED_AT', " . var_export(date('Y-m-d H:i:s'), true) . ");\\n";

            file_put_contents($configFile, $configContent);

            $isSuccess = true;
            $message = "Chúc mừng! Đã kết nối MySQL và tự động tạo tất cả các bảng dữ liệu thành công!";
        } catch (Exception $e) {
            $message = "Lỗi kết nối MySQL: " . $e->getMessage() . ". Vui lòng kiểm tra lại thông số trong cPanel MySQL Database.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cài Đặt CSDL Tự Động - TRẦN HOA COMPUTER (cPanel)</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0b0f19; color: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .card { background: #111827; border: 1px solid #1e293b; border-radius: 24px; padding: 36px; max-width: 580px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: rgba(14,165,233,0.15); color: #38bdf8; border: 1px solid rgba(14,165,233,0.3); margin-bottom: 12px; }
        h1 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        p.sub { font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; text-align: left; }
        label { display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px; }
        input[type="text"], input[type="password"] { width: 100%; background: #030712; border: 1px solid #334155; border-radius: 12px; padding: 12px 16px; color: #fff; font-size: 13px; outline: none; transition: border 0.2s; }
        input:focus { border-color: #0284c7; }
        .btn { width: 100%; background: #0284c7; hover: #0369a1; color: #fff; font-weight: 700; font-size: 14px; padding: 14px; border: none; border-radius: 14px; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
        .btn:hover { background: #0369a1; }
        .alert { padding: 14px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; font-weight: 600; }
        .alert-success { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
        .alert-error { background: rgba(244,63,94,0.15); color: #fb7185; border: 1px solid rgba(244,63,94,0.3); }
        .help-box { background: #030712; border: 1px dashed #334155; border-radius: 14px; padding: 16px; margin-top: 24px; font-size: 12px; color: #94a3b8; line-height: 1.6; text-align: left; }
        .help-box b { color: #f8fafc; }
        .btn-home { display: inline-block; background: #10b981; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; margin-top: 16px; font-size: 13px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">⚡ cPanel One-Click Auto-Installer</div>
        <h1>TRẦN HOA COMPUTER</h1>
        <p class="sub">Tự động khởi tạo cấu trúc bảng MySQL và đồng bộ 38 siêu thị, kho hàng linh kiện, cấu hình PC & dịch vụ kỹ thuật.</p>

        <?php if (!empty($message)): ?>
            <div class="alert <?php echo $isSuccess ? 'alert-success' : 'alert-error'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ($isSuccess): ?>
            <div style="text-align: center; padding: 10px 0;">
                <p style="font-size: 14px; color: #94a3b8;">Hệ thống đã sẵn sàng hoạt động hoàn toàn trên cPanel của bạn.</p>
                <a href="./" class="btn-home">🚀 Mở Website Cửa Hàng Ngay</a>
            </div>
        <?php else: ?>
            <form method="POST">
                <div class="form-group">
                    <label>Máy chủ CSDL (Database Host):</label>
                    <input type="text" name="db_host" value="localhost" required>
                </div>

                <div class="form-group">
                    <label>Tên Cơ Sở Dữ Liệu (cPanel Database Name):</label>
                    <input type="text" name="db_name" placeholder="Ví dụ: username_shop" required>
                </div>

                <div class="form-group">
                    <label>Người Dùng CSDL (cPanel Database User):</label>
                    <input type="text" name="db_user" placeholder="Ví dụ: username_user" required>
                </div>

                <div class="form-group">
                    <label>Mật Khẩu CSDL (Database Password):</label>
                    <input type="password" name="db_pass" placeholder="Nhập mật khẩu CSDL cPanel">
                </div>

                <button type="submit" name="install_db" class="btn">⚡ Tự Động Tạo Bảng & Nhập Dữ Liệu</button>
            </form>
        <?php endif; ?>

        <div class="help-box">
            <b>💡 Hướng dẫn nhanh cho cPanel:</b><br>
            1. Vào cPanel -> mục <b>MySQL® Databases</b> -> Tạo 1 CSDL mới và 1 Người dùng.<br>
            2. Gán người dùng vào CSDL với quyền <b>ALL PRIVILEGES</b>.<br>
            3. Nhập thông tin vào các ô trên rồi nhấn nút xanh.<br>
            4. <i>Nếu bạn không dùng MySQL:</i> Trang web vẫn chạy mượt mà ngay trên cPanel với cơ chế lưu trữ tự động của trình duyệt!
        </div>
    </div>
</body>
</html>
`;
}

/**
 * Generate PHP REST API Bridge for cPanel (api.php)
 * Handles receiving orders, getting/saving database state to MySQL or JSON file.
 */
export function generateApiPhp(): string {
  return `<?php
/**
 * TRẦN HOA COMPUTER - CPANEL BACKEND REST API
 * Hỗ trợ lưu trữ MySQL hoặc tự động fallback sang data.json khi chưa cấu hình MySQL
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$configFile = __DIR__ . '/config.php';
$jsonFile = __DIR__ . '/data.json';

// Kiểm tra kết nối PDO MySQL nếu đã có config.php
$pdo = null;
if (file_exists($configFile)) {
    require_once $configFile;
    if (defined('DB_HOST') && defined('DB_NAME') && defined('DB_USER') && defined('DB_PASS')) {
        try {
            $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (Exception $e) {
            $pdo = null;
        }
    }
}

$action = $_GET['action'] ?? 'health';

// 1. Health check
if ($action === 'health') {
    echo json_encode([
        'status' => 'ok',
        'server_time' => date('Y-m-d H:i:s'),
        'database_type' => $pdo ? 'MySQL (Live)' : 'JSON File Storage',
        'cpanel_ready' => true,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// 2. Lấy dữ liệu toàn bộ cửa hàng (GET /api.php?action=get_all)
if ($action === 'get_all') {
    if (file_exists($jsonFile)) {
        echo file_get_contents($jsonFile);
    } else {
        echo json_encode(['error' => 'Database file not found'], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// 3. Nhận đơn hàng mới từ khách (POST /api.php?action=create_order)
if ($action === 'create_order') {
    $rawInput = file_get_contents('php://input');
    $orderData = json_decode($rawInput, true);

    if (!$orderData || !isset($orderData['customerName']) || !isset($orderData['customerPhone'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dữ liệu đơn hàng không hợp lệ!'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $orderCode = $orderData['orderCode'] ?? ('ORD-' . rand(1000, 9999));

    // Nếu có kết nối MySQL
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO \`orders\` (\`id\`, \`order_code\`, \`order_type\`, \`customer_name\`, \`customer_phone\`, \`customer_address\`, \`total_amount\`, \`payment_method\`, \`payment_status\`, \`status\`, \`items_json\`, \`notes\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $orderData['id'] ?? ('ord-' . time()),
                $orderCode,
                $orderData['orderType'] ?? 'product_order',
                $orderData['customerName'],
                $orderData['customerPhone'],
                $orderData['shippingAddress'] ?? $orderData['customerAddress'] ?? '',
                $orderData['totalAmount'] ?? 0,
                $orderData['paymentMethod'] ?? 'cod',
                $orderData['paymentStatus'] ?? 'pending',
                'pending',
                json_encode($orderData['items'] ?? [], JSON_UNESCAPED_UNICODE),
                $orderData['notes'] ?? ''
            ]);
        } catch (Exception $e) {
            // Fallback lưu file
        }
    }

    // Luôn ghi thêm vào file log / json để đảm bảo an toàn
    $ordersLogFile = __DIR__ . '/orders_received.json';
    $existingOrders = file_exists($ordersLogFile) ? json_decode(file_get_contents($ordersLogFile), true) : [];
    if (!is_array($existingOrders)) $existingOrders = [];
    $existingOrders[] = array_merge($orderData, ['received_at' => date('Y-m-d H:i:s')]);
    file_put_contents($ordersLogFile, json_encode($existingOrders, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'orderCode' => $orderCode,
        'message' => 'Đã lưu đơn hàng thành công vào hệ thống cPanel!',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Lưu toàn bộ DB từ Admin (POST /api.php?action=save_all)
if ($action === 'save_all') {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        file_put_contents($jsonFile, $rawInput);
        echo json_encode(['success' => true, 'message' => 'Đã cập nhật cơ sở dữ liệu cPanel thành công!'], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dữ liệu trống'], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

echo json_encode(['error' => 'Action không hợp lệ'], JSON_UNESCAPED_UNICODE);
`;
}

/**
 * Generate Apache .htaccess file for cPanel
 * Enables Gzip, browser caching, and Single Page Application rewrite rules.
 */
export function generateHtaccess(): string {
  return `# ==========================================================
# TRẦN HOA COMPUTER - TỐI ƯU HÓA TỐC ĐỘ & ĐIỀU HƯỚNG CPANEL
# ==========================================================

# 1. Bật nén Gzip / Deflate để website tải trong nháy mắt
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml
</IfModule>

# 2. Bộ nhớ đệm trình duyệt (Browser Caching)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresDefault "access plus 2 days"
</IfModule>

# 3. Điều hướng Single Page Application (SPA) & Bảo vệ tệp
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Cho phép truy cập trực tiếp install.php, api.php và database.sql
    RewriteRule ^(install\\.php|api\\.php|database\\.sql|data\\.json) - [L]

    # Nếu tệp hoặc thư mục có thật thì phục vụ trực tiếp
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Còn lại chuyển hướng về index.html
    RewriteRule ^ index.html [L]
</IfModule>

# 4. Bảo vệ tệp nhạy cảm
<FilesMatch "^(config\\.php|\\.env)">
    Order allow,deny
    Deny from all
</FilesMatch>
`;
}

/**
 * Generate Vietnamese README for cPanel
 */
export function generateReadme(storeName: string): string {
  return `========================================================================
   HƯỚNG DẪN ĐƯA DỰ ÁN LÊN CPANEL VÀO THƯ MỤC public_html GIẢI NÉN CHẠY NGAY
   HỆ THỐNG BÁN HÀNG & PHÒNG LAB KỸ THUẬT: ${storeName.toUpperCase()}
========================================================================

CHỈ CẦN 3 BƯỚC ĐỂ WEBSITE HOẠT ĐỘNG TRỰC TIẾP TRÊN CPANEL:

👉 BƯỚC 1: TẢI TỆP ZIP LÊN CPANEL
1. Đăng nhập vào bảng điều khiển cPanel của tên miền bạn.
2. Tìm và mở mục "File Manager" (Trình quản lý tệp).
3. Nhấp đúp vào thư mục: public_html
4. Nhấn nút "Upload" (Tải lên) ở thanh trên cùng.
5. Kéo thả tệp "cpanel_public_html_deployment.zip" vừa tải về vào ô tải lên.

👉 BƯỚC 2: GIẢI NÉN TỆP (EXTRACT)
1. Sau khi tải lên hoàn tất (thanh xanh 100%), quay lại thư mục public_html.
2. Nhấp chuột phải vào tệp "cpanel_public_html_deployment.zip".
3. Chọn "Extract" (Giải nén) -> bấm "Extract File(s)".
4. Bạn có thể xóa tệp zip sau khi giải nén để tiết kiệm dung lượng.

👉 BƯỚC 3: MỞ TRANG WEB HOẶC TỰ TẠO CSDL
- CÁCH 1 (CHẠY NGAY TỨC THÌ KHÔNG CẦN CẤU HÌNH):
  Mở trình duyệt gõ tên miền của bạn (ví dụ: https://yourdomain.com).
  Website sẽ tự động khởi động đầy đủ 38 siêu thị, kho hàng linh kiện,
  PC Builder và lưu trữ trực tiếp trên trình duyệt của bạn!

- CÁCH 2 (TỰ TẠO CƠ SỞ DỮ LIỆU MYSQL TRÊN CPANEL):
  1. Trong cPanel, tạo 1 Database và 1 User trong "MySQL® Databases".
  2. Mở trình duyệt truy cập: https://yourdomain.com/install.php
  3. Nhập Tên CSDL và Mật khẩu -> Bấm "⚡ Tự Động Tạo Bảng & Nhập Dữ Liệu".
  4. Trình cài đặt sẽ tự động nạp bảng products, orders, services,
     settings và branches vào MySQL của bạn!

========================================================================
DANH SÁCH CÁC TỆP TRONG GÓI:
- index.html        : Trang giao diện chính của cửa hàng
- install.php       : Trình cài đặt tự tạo bảng CSDL 1 click
- api.php           : Cổng API nhận đơn hàng và đồng bộ dữ liệu
- database.sql      : Kịch bản SQL đầy đủ cấu trúc & dữ liệu mẫu
- data.json         : Bản sao lưu dữ liệu toàn hệ thống
- .htaccess         : Tệp cấu hình máy chủ Apache/LiteSpeed tối ưu tốc độ
- assets/           : Thư mục chứa mã nguồn CSS/JS và biểu tượng
========================================================================
`;
}

/**
 * Generate full deployment ZIP bundle for cPanel
 */
export async function createCpanelZipBundle(db: ShopDatabase): Promise<Blob> {
  const zip = new JSZip();

  // 1. Core deployment files
  zip.file('install.php', generateInstallPhp());
  zip.file('api.php', generateApiPhp());
  zip.file('.htaccess', generateHtaccess());
  zip.file('database.sql', generateSqlDump(db));
  zip.file('data.json', JSON.stringify(db, null, 2));
  zip.file('README_cPanel.txt', generateReadme(db.settings.storeName || 'Trần Hoa Computer'));

  // 2. Fetch the current index.html so the client app is fully bundled
  try {
    const htmlResp = await fetch(window.location.href);
    if (htmlResp.ok) {
      const htmlText = await htmlResp.text();
      zip.file('index.html', htmlText);
    } else {
      zip.file('index.html', createFallbackHtml(db));
    }
  } catch (e) {
    zip.file('index.html', createFallbackHtml(db));
  }

  // Generate the binary ZIP blob
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

function createFallbackHtml(db: ShopDatabase): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${db.settings.storeName || 'TRẦN HOA COMPUTER'} - Hệ Thống Siêu Thị & Phòng Lab</title>
  <meta http-equiv="refresh" content="0; url=./install.php">
</head>
<body style="background: #0f172a; color: #fff; font-family: sans-serif; text-align: center; padding-top: 50px;">
  <h2>Đang chuyển hướng tới trình cài đặt cPanel...</h2>
  <p><a href="./install.php" style="color: #38bdf8;">Bấm vào đây nếu trang không tự chuyển</a></p>
</body>
</html>`;
}
