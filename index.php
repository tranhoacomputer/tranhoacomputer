<?php
/**
 * WEBSITE DỊCH VỤ MÁY TÍNH & BÁN LẺ LINH PHỤ KIỆN
 * Tệp duy nhất: index.php - Chạy ngay trên cPanel public_html với SQLite & PDO
 * Tài khoản Admin mặc định: admin / admin123
 */

// Hỗ trợ PHP CLI server phục vụ file tĩnh nếu có
if (php_sapi_name() === 'cli-server') {
    $requested_file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($requested_file) && pathinfo($requested_file, PATHINFO_EXTENSION) !== 'php') {
        return false;
    }
}

session_start();

// -------------------------------------------------------------
// 1. KẾT NỐI VÀ KHỞI TẠO CƠ SỞ DỮ LIỆU SQLITE
// -------------------------------------------------------------
$db_file = __DIR__ . '/shop_data.sqlite';
$init_db = !file_exists($db_file);

try {
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Lỗi kết nối SQLite: " . $e->getMessage());
}

if ($init_db || filesize($db_file) === 0) {
    // Tạo bảng Cài đặt
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_name TEXT UNIQUE,
        key_value TEXT
    )");

    // Tạo bảng Người dùng (Admin)
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Tạo bảng Dịch vụ
    $pdo->exec("CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price TEXT,
        description TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Tạo bảng Sản phẩm
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price INTEGER,
        image_url TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Tạo bảng Đơn hàng & Lịch hẹn
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        phone TEXT,
        address TEXT,
        note TEXT,
        order_type TEXT, -- 'product' hoặc 'service'
        items_detail TEXT,
        total_amount INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Mới tiếp nhận', -- 'Mới tiếp nhận', 'Đang xử lý', 'Hoàn thành', 'Hủy'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Nạp tài khoản Admin mặc định: admin / admin123
    $default_pass = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)");
    $stmt->execute(['admin', $default_pass]);

    // Nạp cấu hình mẫu
    $default_settings = [
        'store_name' => 'IT Pro Computer - Sửa Chữa & Linh Kiện PC',
        'hotline' => '0988.123.456',
        'address' => '123 Đường Công Nghệ, Phường Bách Khoa, TP. Hà Nội',
        'email' => 'support@itprocomputer.vn',
        'banner_title' => 'Chuyên Gia Cứu Hộ PC & Build Máy Gaming',
        'banner_subtitle' => 'Sửa chữa lấy liền trong 30 phút • Linh kiện chính hãng bảo hành 36 tháng • Tư vấn build PC tối ưu theo ngân sách',
        'bank_info' => 'Vietcombank: 1029384756 - NGUYEN VAN QUAN TRI'
    ];
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO settings (key_name, key_value) VALUES (?, ?)");
    foreach ($default_settings as $k => $v) {
        $stmt->execute([$k, $v]);
    }

    // Nạp dịch vụ mẫu
    $sample_services = [
        [
            'Sửa Laptop / PC Lấy Ngay',
            'Từ 100.000 đ',
            'Khắc phục máy không lên hình, sập nguồn, thay bàn phím, màn hình, bản lề laptop bảo hành 12 tháng.',
            'fa-solid fa-screwdriver-wrench'
        ],
        [
            'Cài Win & Phần Mềm Trọn Gói',
            '150.000 đ',
            'Cài đặt Windows 10/11 Pro bản quyền, Office, Adobe, Autocad, diệt virus và tối ưu tốc độ máy.',
            'fa-brands fa-windows'
        ],
        [
            'Vệ Sinh Máy & Tra Keo Tản Nhiệt',
            '120.000 đ',
            'Vệ sinh chi tiết quạt, tản nhiệt, tra keo gốm tản nhiệt Arctic MX-4 chính hãng giúp giảm 15-20 độ C.',
            'fa-solid fa-fan'
        ],
        [
            'Tư Vấn & Lắp Ráp PC Gaming / Đồ Họa',
            'Miễn phí công ráp',
            'Thiết kế cấu hình tối ưu hiệu năng/giá tiền từ 7 triệu đến 100 triệu, đi dây gọn gàng, test stress test 100%.',
            'fa-solid fa-microchip'
        ]
    ];
    $stmt = $pdo->prepare("INSERT INTO services (name, price, description, icon) VALUES (?, ?, ?, ?)");
    foreach ($sample_services as $s) {
        $stmt->execute($s);
    }

    // Nạp sản phẩm mẫu
    $sample_products = [
        [
            'PC Gaming Dragon i5 13400F | RTX 4060 8GB | RAM 16GB | SSD 512GB',
            'PC Lắp Sẵn',
            17990000,
            'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
            'Cấu hình chiến mượt mọi game AAA Ultra setting và render video 4K sắc nét.'
        ],
        [
            'Laptop Gaming ASUS ROG Strix G16 (Core i7-13650HX / RTX 4060)',
            'Laptop',
            32500000,
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
            'Màn hình 16 inch 165Hz chuẩn màu đồ họa, tản nhiệt kim loại lỏng thế hệ mới.'
        ],
        [
            'Bàn Phím Cơ Không Dây AKKO 5075B Plus Multi-Modes RGB',
            'Bàn Phím',
            1850000,
            'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80',
            'Gasket mount êm ái, switch Akko V3 Cream Yellow, hotswap 5 pin tùy biến.'
        ],
        [
            'Chuột Gaming Không Dây Logitech G Pro X Superlight 2',
            'Chuột',
            3190000,
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
            'Trọng lượng siêu nhẹ chỉ 60g, mắt đọc cảm biến HERO 2 độ nhạy 32.000 DPI.'
        ],
        [
            'Ổ Cứng SSD Kingston NV2 1TB PCIe 4.0 NVMe M.2 2280',
            'Linh Kiện',
            1650000,
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
            'Tốc độ đọc ghi cực nhanh 3500/2100 MB/s, khởi động Windows và tải game tức thì.'
        ],
        [
            'Card Đồ Họa VGA ASUS Dual GeForce RTX 4060 EVO OC 8GB',
            'Linh Kiện',
            8490000,
            'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80',
            'Công nghệ DLSS 3 và Ray Tracing tiên tiến, quạt Axial-tech mát mẻ bền bỉ.'
        ]
    ];
    $stmt = $pdo->prepare("INSERT INTO products (name, category, price, image_url, description) VALUES (?, ?, ?, ?, ?)");
    foreach ($sample_products as $p) {
        $stmt->execute($p);
    }
}

// -------------------------------------------------------------
// 2. CÁC HÀM TIỆN ÍCH DÙNG CHUNG
// -------------------------------------------------------------
function get_settings($pdo) {
    $stmt = $pdo->query("SELECT key_name, key_value FROM settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['key_name']] = $row['key_value'];
    }
    return $settings;
}

function format_vnd($num) {
    return number_format($num, 0, ',', '.') . ' đ';
}

$settings = get_settings($pdo);

// -------------------------------------------------------------
// 3. XỬ LÝ CÁC HÀNH ĐỘNG POST (YÊU CẦU & QUẢN TRỊ)
// -------------------------------------------------------------
$message = '';
$message_type = 'success';

// Đăng nhập Admin
if (isset($_POST['action_login'])) {
    $u = trim($_POST['username'] ?? '');
    $p = trim($_POST['password'] ?? '');
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$u]);
    $user = $stmt->fetch();

    if ($user && password_verify($p, $user['password'])) {
        $_SESSION['admin_user'] = $user['username'];
        header("Location: index.php?page=admin");
        exit;
    } else {
        $message = "Tên đăng nhập hoặc mật khẩu không chính xác!";
        $message_type = "danger";
    }
}

// Đăng xuất Admin
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['admin_user']);
    session_destroy();
    header("Location: index.php");
    exit;
}

// Khách đặt hàng sản phẩm từ Giỏ hàng
if (isset($_POST['action_checkout'])) {
    $name = htmlspecialchars(trim($_POST['customer_name'] ?? ''));
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $address = htmlspecialchars(trim($_POST['address'] ?? ''));
    $note = htmlspecialchars(trim($_POST['note'] ?? ''));
    $cart_json = $_POST['cart_data'] ?? '[]';
    $total_amount = (int)($_POST['total_amount'] ?? 0);

    $items = json_decode($cart_json, true);
    $item_text_arr = [];
    if (is_array($items)) {
        foreach ($items as $it) {
            $item_text_arr[] = $it['name'] . " (SL: " . $it['qty'] . " x " . format_vnd($it['price']) . ")";
        }
    }
    $details = implode("\n", $item_text_arr);

    if ($name && $phone && !empty($item_text_arr)) {
        $stmt = $pdo->prepare("INSERT INTO orders (customer_name, phone, address, note, order_type, items_detail, total_amount, status) VALUES (?, ?, ?, ?, 'product', ?, ?, 'Mới tiếp nhận')");
        $stmt->execute([$name, $phone, $address, $note, $details, $total_amount]);
        $order_id = $pdo->lastInsertId();
        $message = "Đặt hàng thành công! Mã đơn: #" . $order_id . ". Nhân viên sẽ gọi lại cho bạn theo số " . $phone . " ngay lập tức.";
        $message_type = "order_success";
    } else {
        $message = "Vui lòng kiểm tra lại thông tin người nhận và giỏ hàng!";
        $message_type = "danger";
    }
}

// Khách đặt lịch hẹn dịch vụ
if (isset($_POST['action_book_service'])) {
    $name = htmlspecialchars(trim($_POST['customer_name'] ?? ''));
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $address = htmlspecialchars(trim($_POST['address'] ?? ''));
    $service_name = htmlspecialchars(trim($_POST['service_name'] ?? ''));
    $issue_desc = htmlspecialchars(trim($_POST['issue_desc'] ?? ''));
    $note = "Yêu cầu: " . $service_name . "\nTình trạng máy: " . $issue_desc;

    if ($name && $phone) {
        $stmt = $pdo->prepare("INSERT INTO orders (customer_name, phone, address, note, order_type, items_detail, total_amount, status) VALUES (?, ?, ?, ?, 'service', ?, 0, 'Mới tiếp nhận')");
        $stmt->execute([$name, $phone, $address, $note, $service_name]);
        $message = "Gửi yêu cầu dịch vụ thành công! Đội ngũ kỹ thuật sẽ liên hệ qua số " . $phone . " trong 15 phút.";
        $message_type = "service_success";
    } else {
        $message = "Vui lòng nhập họ tên và số điện thoại!";
        $message_type = "danger";
    }
}

// Xử lý các thao tác Admin (Yêu cầu đăng nhập)
$is_admin = !empty($_SESSION['admin_user']);

if ($is_admin && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Cập nhật trạng thái đơn hàng
    if (isset($_POST['action_update_order_status'])) {
        $oid = (int)$_POST['order_id'];
        $new_status = $_POST['status'];
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $oid]);
        header("Location: index.php?page=admin&tab=orders&msg=status_updated");
        exit;
    }

    // 2. Xóa đơn hàng
    if (isset($_POST['action_delete_order'])) {
        $oid = (int)$_POST['order_id'];
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$oid]);
        header("Location: index.php?page=admin&tab=orders&msg=deleted");
        exit;
    }

    // 3. Thêm hoặc Sửa sản phẩm
    if (isset($_POST['action_save_product'])) {
        $pid = (int)($_POST['product_id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $cat = trim($_POST['category'] ?? '');
        $price = (int)($_POST['price'] ?? 0);
        $img = trim($_POST['image_url'] ?? '');
        $desc = trim($_POST['description'] ?? '');

        if ($pid > 0) {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, image_url = ?, description = ? WHERE id = ?");
            $stmt->execute([$name, $cat, $price, $img, $desc, $pid]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO products (name, category, price, image_url, description) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $cat, $price, $img, $desc]);
        }
        header("Location: index.php?page=admin&tab=products&msg=saved");
        exit;
    }

    // 4. Xóa sản phẩm
    if (isset($_POST['action_delete_product'])) {
        $pid = (int)$_POST['product_id'];
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$pid]);
        header("Location: index.php?page=admin&tab=products&msg=deleted");
        exit;
    }

    // 5. Thêm hoặc Sửa dịch vụ
    if (isset($_POST['action_save_service'])) {
        $sid = (int)($_POST['service_id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $price = trim($_POST['price'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $icon = trim($_POST['icon'] ?? 'fa-solid fa-gear');

        if ($sid > 0) {
            $stmt = $pdo->prepare("UPDATE services SET name = ?, price = ?, description = ?, icon = ? WHERE id = ?");
            $stmt->execute([$name, $price, $desc, $icon, $sid]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO services (name, price, description, icon) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $price, $desc, $icon]);
        }
        header("Location: index.php?page=admin&tab=services&msg=saved");
        exit;
    }

    // 6. Xóa dịch vụ
    if (isset($_POST['action_delete_service'])) {
        $sid = (int)$_POST['service_id'];
        $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$sid]);
        header("Location: index.php?page=admin&tab=services&msg=deleted");
        exit;
    }

    // 7. Lưu Cấu hình chung
    if (isset($_POST['action_save_settings'])) {
        $fields = ['store_name', 'hotline', 'address', 'email', 'banner_title', 'banner_subtitle', 'bank_info'];
        $stmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON CONFLICT(key_name) DO UPDATE SET key_value = excluded.key_value");
        foreach ($fields as $f) {
            if (isset($_POST[$f])) {
                $stmt->execute([$f, trim($_POST[$f])]);
            }
        }
        header("Location: index.php?page=admin&tab=settings&msg=saved");
        exit;
    }
}

// Xác định trang hiển thị
$page = $_GET['page'] ?? 'home';
$admin_tab = $_GET['tab'] ?? 'orders';
?>
<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($settings['store_name'] ?? 'Cửa hàng Máy tính & Dịch vụ PC') ?></title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            900: '#1e3a8a',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col justify-between">

<?php if ($page === 'login'): ?>
    <!-- ============================================================= -->
    <!-- GIAO DIỆN ĐĂNG NHẬP ADMIN                                      -->
    <!-- ============================================================= -->
    <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white text-2xl shadow-lg mb-3">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-900">Quản Trị Hệ Thống</h2>
                <p class="text-sm text-slate-500 mt-1">Đăng nhập để quản lý đơn hàng, dịch vụ và sản phẩm</p>
            </div>

            <?php if ($message): ?>
                <div class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
                    <?= htmlspecialchars($message) ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="index.php?page=login" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Tài khoản</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <i class="fa-regular fa-user"></i>
                        </span>
                        <input type="text" name="username" required value="admin"
                               class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <i class="fa-solid fa-key"></i>
                        </span>
                        <input type="password" name="password" required value="admin123"
                               class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    </div>
                    <p class="text-xs text-slate-400 mt-1.5">Mặc định: <code class="text-brand-600 font-semibold">admin</code> / <code class="text-brand-600 font-semibold">admin123</code></p>
                </div>

                <button type="submit" name="action_login"
                        class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg">
                    Đăng Nhập Ngay
                </button>
            </form>

            <div class="text-center pt-2">
                <a href="index.php" class="text-xs text-slate-500 hover:text-brand-600 transition">
                    <i class="fa-solid fa-arrow-left mr-1"></i> Quay về trang chủ cửa hàng
                </a>
            </div>
        </div>
    </div>

<?php elseif ($page === 'admin'): ?>
    <?php
    if (!$is_admin) {
        header("Location: index.php?page=login");
        exit;
    }

    // Đếm dữ liệu tổng quan
    $count_orders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $count_products = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $count_services = $pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
    $sum_revenue = $pdo->query("SELECT SUM(total_amount) FROM orders WHERE status = 'Hoàn thành'")->fetchColumn() ?: 0;
    ?>
    <!-- ============================================================= -->
    <!-- BẢNG ĐIỀU KHIỂN QUẢN TRỊ (ADMIN PANEL)                         -->
    <!-- ============================================================= -->
    <div class="min-h-screen flex flex-col bg-slate-100">
        <!-- Topbar Admin -->
        <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        <i class="fa-solid fa-screwdriver-wrench"></i>
                    </div>
                    <div>
                        <h1 class="text-lg font-bold text-slate-900 leading-tight">Admin Control Panel</h1>
                        <p class="text-xs text-slate-500"><?= htmlspecialchars($settings['store_name'] ?? 'IT Pro') ?></p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <a href="index.php" target="_blank" class="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                        <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> Xem Website
                    </a>
                    <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border">
                        <i class="fa-solid fa-user-shield text-brand-600 mr-1"></i> <?= htmlspecialchars($_SESSION['admin_user']) ?>
                    </span>
                    <a href="index.php?action=logout" class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200">
                        <i class="fa-solid fa-right-from-bracket mr-1"></i> Thoát
                    </a>
                </div>
            </div>
        </header>

        <!-- Main Body Admin -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
            <!-- Thống kê nhanh với Thanh Tiến Trình (Progress Bar) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <!-- Progress Bar ở đầu card -->
                    <div class="mb-3 pb-2 border-b border-slate-100 space-y-1">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-[11px] font-medium text-slate-500">Tiến độ tiếp nhận</span>
                            <span class="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">85%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-blue-600 h-full rounded-full transition-all duration-500" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Tổng đơn & lịch hẹn</p>
                            <h3 class="text-2xl font-bold text-slate-900"><?= $count_orders ?></h3>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <!-- Progress Bar ở đầu card -->
                    <div class="mb-3 pb-2 border-b border-slate-100 space-y-1">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-[11px] font-medium text-slate-500">Chỉ tiêu doanh thu</span>
                            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">72%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: 72%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                            <i class="fa-solid fa-sack-dollar"></i>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Doanh thu hoàn thành</p>
                            <h3 class="text-2xl font-bold text-emerald-600"><?= format_vnd($sum_revenue) ?></h3>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <!-- Progress Bar ở đầu card -->
                    <div class="mb-3 pb-2 border-b border-slate-100 space-y-1">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-[11px] font-medium text-slate-500">Mức độ phủ kho hàng</span>
                            <span class="text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">90%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-purple-600 h-full rounded-full transition-all duration-500" style="width: 90%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                            <i class="fa-solid fa-box-open"></i>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Sản phẩm hiện có</p>
                            <h3 class="text-2xl font-bold text-slate-900"><?= $count_products ?></h3>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <!-- Progress Bar ở đầu card -->
                    <div class="mb-3 pb-2 border-b border-slate-100 space-y-1">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-[11px] font-medium text-slate-500">Tỷ lệ dịch vụ kích hoạt</span>
                            <span class="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">100%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-amber-500 h-full rounded-full transition-all duration-500" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                            <i class="fa-solid fa-microchip"></i>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Gói dịch vụ kỹ thuật</p>
                            <h3 class="text-2xl font-bold text-slate-900"><?= $count_services ?></h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Menu -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 mb-6 flex flex-wrap gap-2">
                <a href="index.php?page=admin&tab=orders"
                   class="px-5 py-2.5 rounded-xl text-sm font-semibold transition <?= $admin_tab === 'orders' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100' ?>">
                    <i class="fa-solid fa-list-check mr-2"></i> Đơn Hàng & Lịch Hẹn
                </a>
                <a href="index.php?page=admin&tab=products"
                   class="px-5 py-2.5 rounded-xl text-sm font-semibold transition <?= $admin_tab === 'products' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100' ?>">
                    <i class="fa-solid fa-laptop mr-2"></i> Quản Lý Sản Phẩm
                </a>
                <a href="index.php?page=admin&tab=services"
                   class="px-5 py-2.5 rounded-xl text-sm font-semibold transition <?= $admin_tab === 'services' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100' ?>">
                    <i class="fa-solid fa-tools mr-2"></i> Quản Lý Dịch Vụ
                </a>
                <a href="index.php?page=admin&tab=settings"
                   class="px-5 py-2.5 rounded-xl text-sm font-semibold transition <?= $admin_tab === 'settings' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100' ?>">
                    <i class="fa-solid fa-sliders mr-2"></i> Cấu Hình Website
                </a>
            </div>

            <?php if (isset($_GET['msg'])): ?>
                <div class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center justify-between">
                    <span><i class="fa-solid fa-circle-check mr-2"></i> Cập nhật dữ liệu thành công!</span>
                    <a href="index.php?page=admin&tab=<?= $admin_tab ?>" class="text-xs underline text-emerald-800">Đóng</a>
                </div>
            <?php endif; ?>

            <!-- NỘI DUNG TỪNG TAB -->

            <?php if ($admin_tab === 'orders'): ?>
                <!-- ================= TAB: ĐƠN HÀNG & LỊCH HẸN ================= -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 class="text-base font-bold text-slate-900">Danh sách Khách Hàng Đặt Mua & Hẹn Sửa Máy</h2>
                            <p class="text-xs text-slate-500">Tự động đồng bộ theo thời gian thực từ trang chủ</p>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-slate-600">
                            <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th class="px-5 py-3.5">Mã / Ngày</th>
                                    <th class="px-5 py-3.5">Khách hàng</th>
                                    <th class="px-5 py-3.5">Loại yêu cầu</th>
                                    <th class="px-5 py-3.5">Chi tiết sản phẩm / Dịch vụ</th>
                                    <th class="px-5 py-3.5">Tổng tiền</th>
                                    <th class="px-5 py-3.5">Trạng thái</th>
                                    <th class="px-5 py-3.5 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <?php
                                $orders = $pdo->query("SELECT * FROM orders ORDER BY id DESC")->fetchAll();
                                if (empty($orders)):
                                ?>
                                    <tr>
                                        <td colspan="7" class="px-5 py-8 text-center text-slate-400">Chưa có đơn hàng hoặc lịch hẹn nào.</td>
                                    </tr>
                                <?php else: ?>
                                    <?php foreach ($orders as $o): ?>
                                        <tr class="hover:bg-slate-50 transition">
                                            <td class="px-5 py-4 whitespace-nowrap">
                                                <span class="font-bold text-slate-900">#<?= $o['id'] ?></span>
                                                <div class="text-xs text-slate-400"><?= date('H:i d/m/Y', strtotime($o['created_at'])) ?></div>
                                            </td>
                                            <td class="px-5 py-4">
                                                <div class="font-semibold text-slate-900"><?= htmlspecialchars($o['customer_name']) ?></div>
                                                <div class="text-xs text-brand-600 font-medium"><i class="fa-solid fa-phone mr-1"></i><?= htmlspecialchars($o['phone']) ?></div>
                                                <?php if ($o['address']): ?>
                                                    <div class="text-xs text-slate-500 truncate max-w-xs" title="<?= htmlspecialchars($o['address']) ?>">
                                                        <i class="fa-solid fa-location-dot mr-1"></i><?= htmlspecialchars($o['address']) ?>
                                                    </div>
                                                <?php endif; ?>
                                            </td>
                                            <td class="px-5 py-4 whitespace-nowrap">
                                                <?php if ($o['order_type'] === 'service'): ?>
                                                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                        <i class="fa-solid fa-screwdriver-wrench mr-1"></i> Đặt lịch sửa
                                                    </span>
                                                <?php else: ?>
                                                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                        <i class="fa-solid fa-bag-shopping mr-1"></i> Mua linh kiện
                                                    </span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="px-5 py-4">
                                                <div class="text-xs whitespace-pre-line text-slate-700 max-w-md bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <?= htmlspecialchars($o['items_detail']) ?>
                                                    <?php if ($o['note']): ?>
                                                        <div class="text-slate-500 italic mt-1 border-t border-slate-200/60 pt-1">
                                                            <strong>Ghi chú:</strong> <?= htmlspecialchars($o['note']) ?>
                                                        </div>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                            <td class="px-5 py-4 whitespace-nowrap font-bold text-slate-900">
                                                <?= $o['total_amount'] > 0 ? format_vnd($o['total_amount']) : 'Báo giá sau' ?>
                                            </td>
                                            <td class="px-5 py-4 whitespace-nowrap">
                                                <form method="POST" action="index.php?page=admin&tab=orders" class="inline-block">
                                                    <input type="hidden" name="action_update_order_status" value="1">
                                                    <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                                                    <select name="status" onchange="this.form.submit()"
                                                            class="text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none transition
                                                            <?php
                                                            switch ($o['status']) {
                                                                case 'Hoàn thành': echo 'bg-emerald-50 text-emerald-700 border-emerald-300'; break;
                                                                case 'Đang xử lý': echo 'bg-blue-50 text-blue-700 border-blue-300'; break;
                                                                case 'Hủy': echo 'bg-red-50 text-red-700 border-red-300'; break;
                                                                default: echo 'bg-amber-50 text-amber-700 border-amber-300'; break;
                                                            }
                                                            ?>">
                                                        <option value="Mới tiếp nhận" <?= $o['status'] === 'Mới tiếp nhận' ? 'selected' : '' ?>>Mới tiếp nhận</option>
                                                        <option value="Đang xử lý" <?= $o['status'] === 'Đang xử lý' ? 'selected' : '' ?>>Đang xử lý</option>
                                                        <option value="Hoàn thành" <?= $o['status'] === 'Hoàn thành' ? 'selected' : '' ?>>Hoàn thành</option>
                                                        <option value="Hủy" <?= $o['status'] === 'Hủy' ? 'selected' : '' ?>>Hủy bỏ</option>
                                                    </select>
                                                </form>
                                            </td>
                                            <td class="px-5 py-4 text-right whitespace-nowrap">
                                                <form method="POST" action="index.php?page=admin&tab=orders" onsubmit="return confirm('Bạn có chắc muốn xóa vĩnh viễn đơn hàng này?');" class="inline">
                                                    <input type="hidden" name="action_delete_order" value="1">
                                                    <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                                                    <button type="submit" class="p-2 text-slate-400 hover:text-red-600 transition" title="Xóa đơn hàng">
                                                        <i class="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            <?php elseif ($admin_tab === 'products'): ?>
                <!-- ================= TAB: QUẢN LÝ SẢN PHẨM ================= -->
                <div class="space-y-6">
                    <!-- Form Thêm / Sửa Sản Phẩm -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h2 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-plus-circle text-brand-600"></i> Thêm Hoặc Chỉnh Sửa Sản Phẩm
                        </h2>
                        <form method="POST" action="index.php?page=admin&tab=products" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="hidden" name="action_save_product" value="1">
                            <input type="hidden" name="product_id" id="prod_id" value="0">

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                                <input type="text" name="name" id="prod_name" required placeholder="VD: Laptop Gaming ASUS ROG..."
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Phân loại *</label>
                                <select name="category" id="prod_category" required
                                        class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                                    <option value="Laptop">Laptop</option>
                                    <option value="PC Lắp Sẵn">PC Lắp Sẵn</option>
                                    <option value="Bàn Phím">Bàn Phím</option>
                                    <option value="Chuột">Chuột</option>
                                    <option value="Tai Nghe">Tai Nghe</option>
                                    <option value="Linh Kiện">Linh Kiện (RAM, SSD, VGA...)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Giá bán (VNĐ) *</label>
                                <input type="number" name="price" id="prod_price" required placeholder="VD: 15500000"
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Link Ảnh Sản Phẩm (URL) *</label>
                                <input type="url" name="image_url" id="prod_img" required placeholder="https://example.com/image.jpg"
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Thao tác</label>
                                <div class="flex gap-2">
                                    <button type="submit" class="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition">
                                        <i class="fa-solid fa-save mr-1"></i> Lưu Sản Phẩm
                                    </button>
                                    <button type="button" onclick="resetProductForm()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition">
                                        Hủy
                                    </button>
                                </div>
                            </div>

                            <div class="md:col-span-3">
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Mô tả cấu hình tóm tắt</label>
                                <textarea name="description" id="prod_desc" rows="2" placeholder="CPU Core i5, RAM 16GB, bảo hành 36 tháng..."
                                          class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>
                            </div>
                        </form>
                    </div>

                    <!-- Bảng Danh Sách Sản Phẩm -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 class="text-base font-bold text-slate-900">Danh Mục Toàn Bộ Sản Phẩm</h2>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm text-slate-600">
                                <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th class="px-5 py-3.5">Hình ảnh</th>
                                        <th class="px-5 py-3.5">Tên sản phẩm</th>
                                        <th class="px-5 py-3.5">Danh mục</th>
                                        <th class="px-5 py-3.5">Giá bán</th>
                                        <th class="px-5 py-3.5">Mô tả</th>
                                        <th class="px-5 py-3.5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <?php
                                    $products = $pdo->query("SELECT * FROM products ORDER BY id DESC")->fetchAll();
                                    foreach ($products as $p):
                                    ?>
                                        <tr class="hover:bg-slate-50 transition">
                                            <td class="px-5 py-3">
                                                <img src="<?= htmlspecialchars($p['image_url']) ?>" alt="thumb"
                                                     class="w-14 h-14 object-cover rounded-lg border border-slate-200">
                                            </td>
                                            <td class="px-5 py-3 font-semibold text-slate-900 max-w-xs">
                                                <?= htmlspecialchars($p['name']) ?>
                                            </td>
                                            <td class="px-5 py-3 whitespace-nowrap">
                                                <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                    <?= htmlspecialchars($p['category']) ?>
                                                </span>
                                            </td>
                                            <td class="px-5 py-3 font-bold text-brand-600 whitespace-nowrap">
                                                <?= format_vnd($p['price']) ?>
                                            </td>
                                            <td class="px-5 py-3 text-xs text-slate-500 max-w-sm truncate" title="<?= htmlspecialchars($p['description']) ?>">
                                                <?= htmlspecialchars($p['description']) ?>
                                            </td>
                                            <td class="px-5 py-3 text-right whitespace-nowrap">
                                                <button type="button"
                                                        onclick='editProduct(<?= json_encode($p) ?>)'
                                                        class="px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition mr-1">
                                                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                                                </button>
                                                <form method="POST" action="index.php?page=admin&tab=products" onsubmit="return confirm('Chắc chắn muốn xóa sản phẩm này?');" class="inline">
                                                    <input type="hidden" name="action_delete_product" value="1">
                                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                                    <button type="submit" class="p-1.5 text-slate-400 hover:text-red-600 transition">
                                                        <i class="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <script>
                    function editProduct(p) {
                        document.getElementById('prod_id').value = p.id;
                        document.getElementById('prod_name').value = p.name;
                        document.getElementById('prod_category').value = p.category;
                        document.getElementById('prod_price').value = p.price;
                        document.getElementById('prod_img').value = p.image_url;
                        document.getElementById('prod_desc').value = p.description;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    function resetProductForm() {
                        document.getElementById('prod_id').value = 0;
                        document.getElementById('prod_name').value = '';
                        document.getElementById('prod_price').value = '';
                        document.getElementById('prod_img').value = '';
                        document.getElementById('prod_desc').value = '';
                    }
                </script>

            <?php elseif ($admin_tab === 'services'): ?>
                <!-- ================= TAB: QUẢN LÝ DỊCH VỤ ================= -->
                <div class="space-y-6">
                    <!-- Form Thêm / Sửa Dịch Vụ -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h2 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-gear text-brand-600"></i> Thêm Hoặc Chỉnh Sửa Gói Dịch Vụ
                        </h2>
                        <form method="POST" action="index.php?page=admin&tab=services" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="hidden" name="action_save_service" value="1">
                            <input type="hidden" name="service_id" id="serv_id" value="0">

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Tên dịch vụ *</label>
                                <input type="text" name="name" id="serv_name" required placeholder="VD: Vệ sinh máy tính..."
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Báo giá tham khảo *</label>
                                <input type="text" name="price" id="serv_price" required placeholder="VD: Từ 150.000 đ hoặc Miễn phí"
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Icon FontAwesome (Class) *</label>
                                <input type="text" name="icon" id="serv_icon" required placeholder="fa-solid fa-screwdriver-wrench"
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Thao tác</label>
                                <div class="flex gap-2">
                                    <button type="submit" class="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition">
                                        <i class="fa-solid fa-save mr-1"></i> Lưu Dịch Vụ
                                    </button>
                                    <button type="button" onclick="resetServiceForm()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition">
                                        Hủy
                                    </button>
                                </div>
                            </div>

                            <div class="md:col-span-4">
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Mô tả cam kết dịch vụ</label>
                                <textarea name="description" id="serv_desc" rows="2" placeholder="Cam kết sửa lấy liền trong ngày, bảo hành dài hạn..."
                                          class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>
                            </div>
                        </form>
                    </div>

                    <!-- Bảng Danh Sách Dịch Vụ -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        <div class="p-5 border-b border-slate-100">
                            <h2 class="text-base font-bold text-slate-900">Danh Mục Các Gói Dịch Vụ Kỹ Thuật</h2>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm text-slate-600">
                                <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th class="px-5 py-3.5">Icon</th>
                                        <th class="px-5 py-3.5">Tên dịch vụ</th>
                                        <th class="px-5 py-3.5">Mức giá tham khảo</th>
                                        <th class="px-5 py-3.5">Mô tả nội dung</th>
                                        <th class="px-5 py-3.5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <?php
                                    $services = $pdo->query("SELECT * FROM services ORDER BY id ASC")->fetchAll();
                                    foreach ($services as $s):
                                    ?>
                                        <tr class="hover:bg-slate-50 transition">
                                            <td class="px-5 py-3">
                                                <div class="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center text-lg">
                                                    <i class="<?= htmlspecialchars($s['icon']) ?>"></i>
                                                </div>
                                            </td>
                                            <td class="px-5 py-3 font-semibold text-slate-900">
                                                <?= htmlspecialchars($s['name']) ?>
                                            </td>
                                            <td class="px-5 py-3 font-bold text-emerald-600 whitespace-nowrap">
                                                <?= htmlspecialchars($s['price']) ?>
                                            </td>
                                            <td class="px-5 py-3 text-xs text-slate-500 max-w-md truncate" title="<?= htmlspecialchars($s['description']) ?>">
                                                <?= htmlspecialchars($s['description']) ?>
                                            </td>
                                            <td class="px-5 py-3 text-right whitespace-nowrap">
                                                <button type="button"
                                                        onclick='editService(<?= json_encode($s) ?>)'
                                                        class="px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition mr-1">
                                                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                                                </button>
                                                <form method="POST" action="index.php?page=admin&tab=services" onsubmit="return confirm('Chắc chắn muốn xóa dịch vụ này?');" class="inline">
                                                    <input type="hidden" name="action_delete_service" value="1">
                                                    <input type="hidden" name="service_id" value="<?= $s['id'] ?>">
                                                    <button type="submit" class="p-1.5 text-slate-400 hover:text-red-600 transition">
                                                        <i class="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <script>
                    function editService(s) {
                        document.getElementById('serv_id').value = s.id;
                        document.getElementById('serv_name').value = s.name;
                        document.getElementById('serv_price').value = s.price;
                        document.getElementById('serv_icon').value = s.icon;
                        document.getElementById('serv_desc').value = s.description;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    function resetServiceForm() {
                        document.getElementById('serv_id').value = 0;
                        document.getElementById('serv_name').value = '';
                        document.getElementById('serv_price').value = '';
                        document.getElementById('serv_icon').value = 'fa-solid fa-screwdriver-wrench';
                        document.getElementById('serv_desc').value = '';
                    }
                </script>

            <?php elseif ($admin_tab === 'settings'): ?>
                <!-- ================= TAB: CẤU HÌNH WEBSITE ================= -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl">
                    <h2 class="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <i class="fa-solid fa-sliders text-brand-600"></i> Cài Đặt Thông Tin Doanh Nghiệp
                    </h2>
                    <p class="text-xs text-slate-500 mb-6">Các thông tin dưới đây sẽ hiển thị trực tiếp trên toàn bộ giao diện khách hàng</p>

                    <form method="POST" action="index.php?page=admin&tab=settings" class="space-y-4">
                        <input type="hidden" name="action_save_settings" value="1">

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Tên Thương Hiệu / Cửa Hàng</label>
                                <input type="text" name="store_name" value="<?= htmlspecialchars($settings['store_name'] ?? '') ?>" required
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Hotline Hỗ Trợ 24/7</label>
                                <input type="text" name="hotline" value="<?= htmlspecialchars($settings['hotline'] ?? '') ?>" required
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ Showroom / Cửa Hàng</label>
                                <input type="text" name="address" value="<?= htmlspecialchars($settings['address'] ?? '') ?>" required
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Email Tiếp Nhận</label>
                                <input type="email" name="email" value="<?= htmlspecialchars($settings['email'] ?? '') ?>"
                                       class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Lớn Trên Banner Trang Chủ</label>
                            <input type="text" name="banner_title" value="<?= htmlspecialchars($settings['banner_title'] ?? '') ?>" required
                                   class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Phụ / Khẩu Hiệu Banner</label>
                            <textarea name="banner_subtitle" rows="2" required
                                      class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"><?= htmlspecialchars($settings['banner_subtitle'] ?? '') ?></textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Thông Tin Tài Khoản Ngân Hàng Nhận Thanh Toán</label>
                            <input type="text" name="bank_info" value="<?= htmlspecialchars($settings['bank_info'] ?? '') ?>"
                                   class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                            <p class="text-xs text-slate-400 mt-1">VD: Vietcombank: 1029384756 - NGUYEN VAN A</p>
                        </div>

                        <div class="pt-4 border-t border-slate-100">
                            <button type="submit" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition shadow-sm">
                                <i class="fa-solid fa-floppy-disk mr-1.5"></i> Lưu Lại Cấu Hình
                            </button>
                        </div>
                    </form>
                </div>
            <?php endif; ?>

        </div>
    </div>

<?php else: ?>
    <!-- ============================================================= -->
    <!-- GIAO DIỆN PHÍA KHÁCH HÀNG (FRONTEND E-COMMERCE & SERVICES)     -->
    <!-- ============================================================= -->

    <!-- Topbar Thông tin -->
    <div class="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div class="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <span><i class="fa-solid fa-phone text-brand-500 mr-1.5"></i> Hotline: <strong class="text-white"><?= htmlspecialchars($settings['hotline'] ?? '') ?></strong></span>
                <span class="hidden md:inline text-slate-600">•</span>
                <span class="truncate max-w-sm"><i class="fa-solid fa-location-dot text-brand-500 mr-1.5"></i> <?= htmlspecialchars($settings['address'] ?? '') ?></span>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i> Mở cửa: 08:00 - 20:30 mỗi ngày</span>
                <span class="text-slate-600">|</span>
                <a href="index.php?page=login" class="text-slate-400 hover:text-white transition flex items-center gap-1">
                    <i class="fa-solid fa-user-gear"></i> Admin
                </a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center text-2xl shadow-md">
                    <i class="fa-solid fa-microchip"></i>
                </div>
                <div>
                    <span class="text-xl font-extrabold text-slate-900 tracking-tight block">
                        <?= htmlspecialchars($settings['store_name'] ?? 'IT Pro') ?>
                    </span>
                    <span class="text-xs font-semibold text-brand-600 uppercase tracking-wider block">
                        Dịch Vụ Máy Tính & Linh Kiện Chính Hãng
                    </span>
                </div>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                <a href="#services" class="hover:text-brand-600 transition flex items-center gap-1.5">
                    <i class="fa-solid fa-screwdriver-wrench text-brand-500"></i> Dịch Vụ Sửa Chữa
                </a>
                <a href="#products" class="hover:text-brand-600 transition flex items-center gap-1.5">
                    <i class="fa-solid fa-store text-brand-500"></i> Linh Kiện & PC
                </a>
                <a href="#contact" class="hover:text-brand-600 transition flex items-center gap-1.5">
                    <i class="fa-solid fa-headset text-brand-500"></i> Liên Hệ
                </a>
            </nav>

            <!-- Actions: Đặt lịch & Giỏ hàng -->
            <div class="flex items-center gap-3">
                <button type="button" onclick="openBookingModal()"
                        class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition">
                    <i class="fa-solid fa-calendar-check"></i> Đặt Lịch Sửa Chữa
                </button>

                <button type="button" onclick="openCartModal()"
                        class="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                        title="Xem giỏ hàng">
                    <i class="fa-solid fa-cart-shopping text-base"></i>
                    <span id="cart-badge"
                          class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                        0
                    </span>
                </button>
            </div>
        </div>
    </header>

    <!-- Thông báo nếu có hành động -->
    <?php if ($message): ?>
        <div class="max-w-7xl mx-auto px-4 mt-6">
            <div class="p-4 rounded-2xl shadow-sm <?= $message_type === 'danger' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200' ?> flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i class="fa-solid <?= $message_type === 'danger' ? 'fa-triangle-exclamation text-red-500' : 'fa-circle-check text-emerald-500' ?> text-xl"></i>
                    <span class="text-sm font-semibold"><?= htmlspecialchars($message) ?></span>
                </div>
                <a href="index.php" class="text-xs font-bold uppercase underline">Đóng</a>
            </div>
        </div>
    <?php endif; ?>

    <!-- HERO BANNER -->
    <section class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white py-16 lg:py-24 overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tiếp nhận sửa chữa & giao hàng toàn quốc
                </div>
                <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    <?= htmlspecialchars($settings['banner_title'] ?? '') ?>
                </h1>
                <p class="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
                    <?= htmlspecialchars($settings['banner_subtitle'] ?? '') ?>
                </p>
                <div class="pt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <a href="#services"
                       class="px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition">
                        <i class="fa-solid fa-wrench mr-2"></i> Khám Phá Gói Dịch Vụ
                    </a>
                    <a href="#products"
                       class="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">
                        <i class="fa-solid fa-basket-shopping mr-2"></i> Mua Sắm Linh Kiện
                    </a>
                    <button type="button" onclick="openBookingModal()"
                            class="px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-white shadow-lg transition">
                        <i class="fa-solid fa-headset mr-2"></i> Đặt Lịch Ngay
                    </button>
                </div>
            </div>

            <!-- Box cam kết bên phải -->
            <div class="lg:col-span-5">
                <div class="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl">
                    <h3 class="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-4">
                        <i class="fa-solid fa-shield-halved text-brand-400"></i> Cam Kết Chất Lượng Vàng
                    </h3>
                    <div class="space-y-4 text-sm">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-clock"></i>
                            </div>
                            <div>
                                <h4 class="font-bold">Sửa Lấy Liền - Xem Trực Tiếp</h4>
                                <p class="text-xs text-slate-300">Minh bạch linh kiện, khách hàng trực tiếp xem kỹ thuật viên thao tác.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-certificate"></i>
                            </div>
                            <div>
                                <h4 class="font-bold">Linh Kiện Chính Hãng 100%</h4>
                                <p class="text-xs text-slate-300">Nguồn gốc rõ ràng từ ASUS, MSI, Gigabyte, Kingston... lỗi 1 đổi 1.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-truck-fast"></i>
                            </div>
                            <div>
                                <h4 class="font-bold">Hỗ Trợ Tận Nơi Nhanh Chóng</h4>
                                <p class="text-xs text-slate-300">Có mặt trong 30-45 phút khu vực nội thành, hỗ trợ từ xa qua Ultraviewer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: DỊCH VỤ SỬA CHỮA & KỸ THUẬT -->
    <section id="services" class="py-16 bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
                <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                    Kỹ Thuật Chuyên Sâu
                </span>
                <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Dịch Vụ Sửa Chữa & Cài Đặt PC / Laptop</h2>
                <p class="text-slate-500 text-sm">
                    Khắc phục triệt để mọi sự cố phần cứng, phần mềm với mức giá cạnh tranh và chế độ bảo hành chu đáo nhất.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php
                $services = $pdo->query("SELECT * FROM services ORDER BY id ASC")->fetchAll();
                foreach ($services as $srv):
                ?>
                    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-brand-500/50 transition group">
                        <div class="space-y-4">
                            <div class="w-14 h-14 rounded-2xl bg-white text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition flex items-center justify-center text-2xl shadow-xs border border-slate-200">
                                <i class="<?= htmlspecialchars($srv['icon']) ?>"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">
                                <?= htmlspecialchars($srv['name']) ?>
                            </h3>
                            <p class="text-xs text-slate-500 leading-relaxed">
                                <?= htmlspecialchars($srv['description']) ?>
                            </p>
                        </div>

                        <div class="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between">
                            <div>
                                <span class="text-[11px] text-slate-400 font-semibold uppercase block">Chi phí</span>
                                <span class="text-sm font-bold text-emerald-600"><?= htmlspecialchars($srv['price']) ?></span>
                            </div>
                            <button type="button"
                                    onclick="openBookingModal('<?= htmlspecialchars(addslashes($srv['name'])) ?>')"
                                    class="px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition shadow-xs">
                                Đặt Lịch
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- SECTION: CỬA HÀNG SẢN PHẨM & LINH PHỤ KIỆN -->
    <section id="products" class="py-16 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                        Sản Phẩm & Phụ Kiện
                    </span>
                    <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Gian Hàng Công Nghệ Chính Hãng</h2>
                </div>

                <!-- Bộ lọc Category -->
                <div class="flex flex-wrap gap-2" id="category-filter">
                    <button type="button" onclick="filterCategory('all')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-xs transition" data-cat="all">
                        Tất Cả
                    </button>
                    <button type="button" onclick="filterCategory('Laptop')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition" data-cat="Laptop">
                        Laptop
                    </button>
                    <button type="button" onclick="filterCategory('PC Lắp Sẵn')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition" data-cat="PC Lắp Sẵn">
                        PC Lắp Sẵn
                    </button>
                    <button type="button" onclick="filterCategory('Bàn Phím')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition" data-cat="Bàn Phím">
                        Bàn Phím
                    </button>
                    <button type="button" onclick="filterCategory('Chuột')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition" data-cat="Chuột">
                        Chuột
                    </button>
                    <button type="button" onclick="filterCategory('Linh Kiện')"
                            class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition" data-cat="Linh Kiện">
                        Linh Kiện
                    </button>
                </div>
            </div>

            <!-- Grid Danh sách Sản phẩm -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="product-list">
                <?php
                $products = $pdo->query("SELECT * FROM products ORDER BY id DESC")->fetchAll();
                foreach ($products as $pr):
                ?>
                    <div class="product-item bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
                         data-category="<?= htmlspecialchars($pr['category']) ?>">
                        <div class="relative overflow-hidden aspect-video bg-slate-100 group">
                            <img src="<?= htmlspecialchars($pr['image_url']) ?>" alt="<?= htmlspecialchars($pr['name']) ?>"
                                 class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                                <?= htmlspecialchars($pr['category']) ?>
                            </span>
                        </div>

                        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 class="font-bold text-slate-900 text-base leading-snug line-clamp-2" title="<?= htmlspecialchars($pr['name']) ?>">
                                    <?= htmlspecialchars($pr['name']) ?>
                                </h3>
                                <p class="text-xs text-slate-500 mt-2 line-clamp-2">
                                    <?= htmlspecialchars($pr['description']) ?>
                                </p>
                            </div>

                            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span class="text-[11px] text-slate-400 font-semibold block">Giá ưu đãi</span>
                                    <span class="text-lg font-extrabold text-brand-600"><?= format_vnd($pr['price']) ?></span>
                                </div>
                                <button type="button"
                                        onclick="addToCart(<?= $pr['id'] ?>, '<?= htmlspecialchars(addslashes($pr['name'])) ?>', <?= $pr['price'] ?>, '<?= htmlspecialchars(addslashes($pr['image_url'])) ?>')"
                                        class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                    <i class="fa-solid fa-cart-plus"></i> Thêm Giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- SECTION: LIÊN HỆ & THÔNG TIN THANH TOÁN -->
    <section id="contact" class="py-16 bg-white border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-headset"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900">Tư Vấn Trực Tiếp</h3>
                <p class="text-xs text-slate-500">Đội ngũ kỹ thuật viên luôn sẵn sàng giải đáp thắc mắc và kiểm tra lỗi online.</p>
                <p class="text-sm font-bold text-brand-600">Hotline: <?= htmlspecialchars($settings['hotline'] ?? '') ?></p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-building-columns"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900">Thanh Toán & Chuyển Khoản</h3>
                <p class="text-xs text-slate-500">Chấp nhận tiền mặt, quẹt thẻ và chuyển khoản ngân hàng 24/7 tiện lợi.</p>
                <p class="text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                    <?= htmlspecialchars($settings['bank_info'] ?? 'Liên hệ hotline') ?>
                </p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900">Địa Chỉ Cửa Hàng</h3>
                <p class="text-xs text-slate-500">Trực tiếp mang máy tới để được kiểm tra và tư vấn kỹ thuật hoàn toàn miễn phí.</p>
                <p class="text-xs font-bold text-slate-800"><?= htmlspecialchars($settings['address'] ?? '') ?></p>
            </div>
        </div>
    </section>

    <!-- FOOTER CHÍNH -->
    <footer class="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; <?= date('Y') ?> <strong><?= htmlspecialchars($settings['store_name'] ?? 'IT Pro') ?></strong>. All rights reserved.</p>
            <div class="flex items-center gap-4">
                <span>Hệ thống quản lý dữ liệu tự động với PHP & SQLite</span>
                <a href="index.php?page=login" class="text-slate-500 hover:text-white transition">Khu Vực Quản Trị</a>
            </div>
        </div>
    </footer>

    <!-- ============================================================= -->
    <!-- MODAL: GIỎ HÀNG & FORM ĐẶT HÀNG                              -->
    <!-- ============================================================= -->
    <div id="cart-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            <!-- Header Modal -->
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-cart-shopping text-brand-600"></i> Giỏ Hàng Mua Sắm
                </h3>
                <button type="button" onclick="closeCartModal()" class="text-slate-400 hover:text-slate-600 p-1">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <!-- Danh sách sản phẩm -->
            <div class="p-6 overflow-y-auto flex-1 space-y-4" id="cart-items-container">
                <!-- JS sẽ render tại đây -->
            </div>

            <!-- Footer: Tổng tiền & Form Đặt Hàng -->
            <div class="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-slate-600">Tổng thanh toán:</span>
                    <span class="text-2xl font-extrabold text-brand-600" id="cart-total-amount">0 đ</span>
                </div>

                <!-- Form Gửi Thông Tin Khách Hàng -->
                <form method="POST" action="index.php" id="checkout-form" class="space-y-3 pt-2 border-t border-slate-200">
                    <input type="hidden" name="action_checkout" value="1">
                    <input type="hidden" name="cart_data" id="hidden_cart_data" value="[]">
                    <input type="hidden" name="total_amount" id="hidden_total_amount" value="0">

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" name="customer_name" required placeholder="Họ và tên của bạn *"
                               class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                        <input type="tel" name="phone" required placeholder="Số điện thoại nhận hàng *"
                               class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    </div>

                    <input type="text" name="address" required placeholder="Địa chỉ giao hàng chi tiết *"
                           class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">

                    <textarea name="note" rows="2" placeholder="Ghi chú thêm về thời gian giao hàng hoặc xuất hóa đơn (nếu có)..."
                              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>

                    <button type="submit" id="submit-order-btn"
                            class="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition shadow-lg text-sm">
                        Xác Nhận Đặt Hàng Ngay
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: ĐẶT LỊCH HẸN SỬA CHỮA / TƯ VẤN DỊCH VỤ                -->
    <!-- ============================================================= -->
    <div id="booking-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <i class="fa-solid fa-calendar-check text-amber-500"></i> Đặt Lịch Sửa Chữa / Tư Vấn PC
                </h3>
                <button type="button" onclick="closeBookingModal()" class="text-slate-400 hover:text-slate-600 p-1">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <form method="POST" action="index.php" class="p-6 space-y-4 overflow-y-auto">
                <input type="hidden" name="action_book_service" value="1">

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Gói dịch vụ quan tâm</label>
                    <select name="service_name" id="book_service_select"
                            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                        <?php foreach ($services as $srv): ?>
                            <option value="<?= htmlspecialchars($srv['name']) ?>"><?= htmlspecialchars($srv['name']) ?> (<?= htmlspecialchars($srv['price']) ?>)</option>
                        <?php endforeach; ?>
                        <option value="Khác (Sẽ mô tả trong phần lỗi)">Khác / Cần tư vấn thêm</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Họ tên của bạn *</label>
                        <input type="text" name="customer_name" required placeholder="Nguyễn Văn A"
                               class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                        <input type="tel" name="phone" required placeholder="0987..."
                               class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ (Nếu cần hỗ trợ tận nơi)</label>
                    <input type="text" name="address" placeholder="Để trống nếu bạn mang máy tới cửa hàng"
                           class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Mô tả tình trạng máy / Lỗi gặp phải</label>
                    <textarea name="issue_desc" rows="3" placeholder="Ví dụ: Máy bật quạt quay nhưng không lên màn hình, máy đơ giật..."
                              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>
                </div>

                <button type="submit"
                        class="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-lg text-sm">
                    Gửi Yêu Cầu Lịch Hẹn
                </button>
            </form>
        </div>
    </div>

    <!-- ============================================================= -->
    <!-- LOGIC JAVASCRIPT: GIỎ HÀNG, BỘ LỌC, MODAL                      -->
    <!-- ============================================================= -->
    <script>
        // Quản lý Giỏ hàng qua LocalStorage
        const CART_KEY = 'it_pro_cart_data';

        function getCart() {
            try {
                return JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch (e) {
                return [];
            }
        }

        function saveCart(cart) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            updateCartBadge();
        }

        function addToCart(id, name, price, image) {
            let cart = getCart();
            let found = cart.find(item => item.id === id);
            if (found) {
                found.qty += 1;
            } else {
                cart.push({ id, name, price, image, qty: 1 });
            }
            saveCart(cart);

            // Hiệu ứng thông báo
            const badge = document.getElementById('cart-badge');
            if (badge) {
                badge.classList.add('scale-125');
                setTimeout(() => badge.classList.remove('scale-125'), 200);
            }

            alert('Đã thêm "' + name + '" vào giỏ hàng!');
        }

        function updateQuantity(id, delta) {
            let cart = getCart();
            let item = cart.find(i => i.id === id);
            if (item) {
                item.qty += delta;
                if (item.qty <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
            }
            saveCart(cart);
            renderCart();
        }

        function removeFromCart(id) {
            let cart = getCart().filter(i => i.id !== id);
            saveCart(cart);
            renderCart();
        }

        function updateCartBadge() {
            const cart = getCart();
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            const badge = document.getElementById('cart-badge');
            if (badge) {
                badge.innerText = totalQty;
            }
        }

        function formatCurrency(number) {
            return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
        }

        function renderCart() {
            const container = document.getElementById('cart-items-container');
            const totalEl = document.getElementById('cart-total-amount');
            const hiddenCart = document.getElementById('hidden_cart_data');
            const hiddenTotal = document.getElementById('hidden_total_amount');
            const submitBtn = document.getElementById('submit-order-btn');

            const cart = getCart();
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="py-12 text-center text-slate-400 space-y-3">
                        <i class="fa-solid fa-basket-shopping text-4xl"></i>
                        <p class="text-sm font-medium">Giỏ hàng của bạn đang trống</p>
                    </div>
                `;
                totalEl.innerText = '0 đ';
                hiddenCart.value = '[]';
                hiddenTotal.value = 0;
                if (submitBtn) submitBtn.disabled = true;
                return;
            }

            if (submitBtn) submitBtn.disabled = false;
            let total = 0;
            let html = '';

            cart.forEach(item => {
                const subtotal = item.price * item.qty;
                total += subtotal;
                html += `
                    <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-slate-900 truncate">${item.name}</h4>
                            <p class="text-xs font-semibold text-brand-600 mt-0.5">${formatCurrency(item.price)}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 text-xs">-</button>
                            <span class="text-xs font-bold text-slate-900 w-5 text-center">${item.qty}</span>
                            <button type="button" onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 text-xs">+</button>
                        </div>
                        <button type="button" onclick="removeFromCart(${item.id})" class="p-2 text-slate-400 hover:text-red-500 transition">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `;
            });

            container.innerHTML = html;
            totalEl.innerText = formatCurrency(total);
            hiddenCart.value = JSON.stringify(cart);
            hiddenTotal.value = total;
        }

        function openCartModal() {
            renderCart();
            document.getElementById('cart-modal').classList.remove('hidden');
        }

        function closeCartModal() {
            document.getElementById('cart-modal').classList.add('hidden');
        }

        function openBookingModal(serviceName = '') {
            const select = document.getElementById('book_service_select');
            if (serviceName && select) {
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === serviceName) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }
            document.getElementById('booking-modal').classList.remove('hidden');
        }

        function closeBookingModal() {
            document.getElementById('booking-modal').classList.add('hidden');
        }

        // Bộ lọc danh mục sản phẩm
        function filterCategory(cat) {
            const buttons = document.querySelectorAll('.cat-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-cat') === cat) {
                    btn.classList.add('bg-brand-600', 'text-white', 'shadow-xs');
                    btn.classList.remove('bg-white', 'text-slate-600');
                } else {
                    btn.classList.remove('bg-brand-600', 'text-white', 'shadow-xs');
                    btn.classList.add('bg-white', 'text-slate-600');
                }
            });

            const items = document.querySelectorAll('.product-item');
            items.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (cat === 'all' || itemCat === cat) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Khởi động khi tải xong trang
        document.addEventListener('DOMContentLoaded', () => {
            updateCartBadge();

            // Nếu đơn hàng thành công thì tự động làm sạch giỏ hàng LocalStorage
            <?php if (isset($message_type) && $message_type === 'order_success'): ?>
                localStorage.removeItem(CART_KEY);
                updateCartBadge();
            <?php endif; ?>
        });
    </script>
<?php endif; ?>

</body>
</html>
