import {
  ShopDatabase,
  Product,
  ServiceItem,
  Order,
  Customer,
  StoreSettings,
  CartItem,
  RepairDetails,
  HeroBanner,
  StoreBranch,
  PCBuildPackage,
  WebsiteContent,
  TrackingStep,
  UserAccount,
  PaymentMethod,
  FulfillmentType,
  InstallmentDetails,
} from '../types/shop';
import { initialSeedDatabase } from './seedData';

const STORAGE_KEY = 'nexus_shop_database_v2';
const DB_CHANGE_EVENT = 'nexus_db_updated';

// Format VND currency helper
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate human-friendly random order code
export function generateOrderCode(prefix = 'NEX'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export function loadDatabase(): ShopDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(initialSeedDatabase);
      return initialSeedDatabase;
    }
    const parsed = JSON.parse(raw) as ShopDatabase;
    if (!parsed.products || !parsed.services || !parsed.orders) {
      saveDatabase(initialSeedDatabase);
      return initialSeedDatabase;
    }

    // Auto-migrate new dynamic sections if missing from older local storage
    let needsResave = false;
    if (!parsed.banners || parsed.banners.length === 0) {
      parsed.banners = initialSeedDatabase.banners;
      needsResave = true;
    }
    if (!parsed.branches || parsed.branches.length === 0) {
      parsed.branches = initialSeedDatabase.branches;
      needsResave = true;
    }
    if (!parsed.pcBuildPackages || parsed.pcBuildPackages.length === 0) {
      parsed.pcBuildPackages = initialSeedDatabase.pcBuildPackages;
      needsResave = true;
    }
    if (!parsed.websiteContent) {
      parsed.websiteContent = initialSeedDatabase.websiteContent;
      needsResave = true;
    }
    if (!parsed.users) {
      parsed.users = initialSeedDatabase.users || [];
      needsResave = true;
    }
    if (parsed.currentUser === undefined) {
      parsed.currentUser = null;
      needsResave = true;
    }

    // Ensure settings has all new fields and updated single-store Thai Nguyen branding
    if (parsed.settings) {
      if (!parsed.settings.hotline || parsed.settings.hotline.includes('1800') || parsed.settings.hotline.includes('0908888999')) {
        parsed.settings.hotline = '0963284044';
        needsResave = true;
      }
      if (!parsed.settings.email || parsed.settings.email.includes('nexuscomputers')) {
        parsed.settings.email = 'hotrokhachhang@tranhoacomputer.site';
        needsResave = true;
      }
      if (!parsed.settings.zalo || parsed.settings.zalo.includes('0908888999') || parsed.settings.zalo.includes('0988888888')) {
        parsed.settings.zalo = '84963284044';
        needsResave = true;
      }
      if (!parsed.settings.address || parsed.settings.address.includes('182 Đường 3/2') || parsed.settings.address.includes('38 siêu thị')) {
        parsed.settings.address = 'Phú Thịnh - Thái Nguyên (Cửa hàng duy nhất, không có chi nhánh trên toàn quốc)';
        needsResave = true;
      }
      if (parsed.settings.storeName === 'NEXUS COMPUTERS & TECH LAB') {
        parsed.settings.storeName = 'TRẦN HOA COMPUTER';
        needsResave = true;
      }
      if (!parsed.settings.targetProvince || parsed.settings.targetProvince === 'Hải Phòng') {
        parsed.settings.targetProvince = 'Thái Nguyên';
        parsed.settings.provinceDeliveryNotice = 'Giao siêu tốc tại Thái Nguyên & Vận chuyển bảo hiểm bọc chống sốc 63 tỉnh thành';
        needsResave = true;
      }
      if (!parsed.settings.provinceDeliveryNotice) {
        parsed.settings.provinceDeliveryNotice = initialSeedDatabase.settings.provinceDeliveryNotice;
        needsResave = true;
      }
      if (!parsed.settings.provinceExpressHours) {
        parsed.settings.provinceExpressHours = '1 - 2 giờ';
        needsResave = true;
      }
      if (parsed.settings.provinceFreeShipThreshold === undefined) {
        parsed.settings.provinceFreeShipThreshold = 500000;
        needsResave = true;
      }
      if (parsed.settings.logoUrl === undefined) {
        parsed.settings.logoUrl = '';
        needsResave = true;
      }
      if (parsed.settings.enableInStorePickup === undefined) {
        parsed.settings.enableInStorePickup = true;
        needsResave = true;
      }
      if (parsed.settings.enableLocalExpress === undefined) {
        parsed.settings.enableLocalExpress = true;
        needsResave = true;
      }
      if (parsed.settings.enableCodDelivery === undefined) {
        parsed.settings.enableCodDelivery = true;
        needsResave = true;
      }
      if (parsed.settings.enableVietQR === undefined) {
        parsed.settings.enableVietQR = true;
        needsResave = true;
      }
      if (parsed.settings.enableInstallment === undefined) {
        parsed.settings.enableInstallment = true;
        needsResave = true;
      }
      if (!parsed.settings.installmentHotline || parsed.settings.installmentHotline.includes('1800')) {
        parsed.settings.installmentHotline = '0963284044';
        needsResave = true;
      }
    }

    // Harmonize single branch to reflect sole store at Phu Thinh - Thai Nguyen
    if (parsed.branches && (parsed.branches.length > 1 || parsed.branches[0]?.address?.includes('182 Đường 3/2'))) {
      parsed.branches = initialSeedDatabase.branches;
      needsResave = true;
    }

    if (parsed.websiteContent?.footerDescription?.includes('38 siêu thị') || !parsed.websiteContent?.footerDescription?.includes('Phú Thịnh')) {
      parsed.websiteContent = {
        ...parsed.websiteContent,
        footerDescription: initialSeedDatabase.websiteContent.footerDescription,
        footerCopyright: initialSeedDatabase.websiteContent.footerCopyright,
        showroomsTitle: initialSeedDatabase.websiteContent.showroomsTitle,
        showroomsSubtitle: initialSeedDatabase.websiteContent.showroomsSubtitle,
        showroomsBadge: initialSeedDatabase.websiteContent.showroomsBadge,
        complaintHotline: '0963284044 (Trần Hoa Computer CSKH)',
      };
      needsResave = true;
    }

    if (needsResave) {
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load database from localStorage, using initial seed:', err);
    return initialSeedDatabase;
  }
}

export function saveDatabase(db: ShopDatabase): void {
  try {
    db.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: db }));
  } catch (err) {
    console.error('Failed to save database to localStorage:', err);
  }
}

export function subscribeToDatabaseChanges(callback: (db: ShopDatabase) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ShopDatabase>;
    callback(customEvent.detail || loadDatabase());
  };
  window.addEventListener(DB_CHANGE_EVENT, handler);
  return () => window.removeEventListener(DB_CHANGE_EVENT, handler);
}

// ======================== PRODUCT OPERATIONS ========================
export function upsertProduct(product: Product): void {
  const db = loadDatabase();
  const index = db.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    db.products[index] = { ...product };
  } else {
    db.products.unshift(product);
  }
  saveDatabase(db);
}

export function deleteProduct(productId: string): void {
  const db = loadDatabase();
  db.products = db.products.filter((p) => p.id !== productId);
  saveDatabase(db);
}

// ======================== SERVICE OPERATIONS ========================
export function upsertService(service: ServiceItem): void {
  const db = loadDatabase();
  const index = db.services.findIndex((s) => s.id === service.id);
  if (index >= 0) {
    db.services[index] = { ...service };
  } else {
    db.services.push(service);
  }
  saveDatabase(db);
}

export function deleteService(serviceId: string): void {
  const db = loadDatabase();
  db.services = db.services.filter((s) => s.id !== serviceId);
  saveDatabase(db);
}

// ======================== ORDER & BOOKING OPERATIONS ========================
export function createProductOrder(params: {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerEmail?: string;
  customerId?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  fulfillmentType?: FulfillmentType;
  pickupBranchId?: string;
  pickupBranchName?: string;
  installmentDetails?: InstallmentDetails;
  notes?: string;
}): Order {
  const db = loadDatabase();
  const code = generateOrderCode(params.paymentMethod === 'installment_0' ? 'TRAGOP' : 'NEX');
  const now = new Date();
  const dateFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  const isInstallment = params.paymentMethod === 'installment_0';
  const initialTimeline: TrackingStep[] = isInstallment
    ? [
        {
          time: dateFormatted,
          title: 'Hồ sơ trả góp 0% đã tiếp nhận',
          note: `Đơn hàng trả góp ${code} qua ${params.installmentDetails?.provider || 'Đối tác tài chính'}. Kỳ hạn ${params.installmentDetails?.termMonths || 6} tháng. Chuyên viên đang thẩm định online.`,
          completed: true,
        },
        {
          time: 'Dự kiến 5 - 15 phút',
          title: 'Thẩm định & Duyệt hồ sơ 0% Lãi Suất',
          note: 'Chuyên viên gọi điện xác nhận thông tin hoặc duyệt tự động qua thẻ.',
          completed: false,
        },
        {
          time: 'Dự kiến trong ngày',
          title: 'Chuẩn bị máy & Bàn giao',
          note: params.fulfillmentType === 'in_store'
            ? `Sẵn sàng bàn giao tại ${params.pickupBranchName || 'chi nhánh đã chọn'}.`
            : 'Đóng gói niêm phong và giao tận nơi miễn phí.',
          completed: false,
        },
      ]
    : [
        {
          time: dateFormatted,
          title: 'Đơn hàng đã được tiếp nhận',
          note: `Đơn hàng ${code} với ${params.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm. Kỹ thuật viên đang kiểm tra tồn kho.`,
          completed: true,
        },
        {
          time: params.fulfillmentType === 'local_express' ? 'Trong 30 phút' : 'Dự kiến trong 2 giờ',
          title: params.fulfillmentType === 'in_store' ? 'Soạn hàng tại quầy chờ khách ghé' : 'Kiểm tra & Đóng gói linh kiện',
          note: params.fulfillmentType === 'in_store'
            ? `Đã giữ máy tại showroom: ${params.pickupBranchName || 'Chi nhánh gần nhất'}.`
            : 'Dán tem bảo hành và đóng hộp chống sốc chuyên dụng.',
          completed: false,
        },
        {
          time: params.fulfillmentType === 'local_express' ? `Hỏa tốc ${db.settings.provinceExpressHours || '1-2h'}` : 'Dự kiến 24h',
          title: params.fulfillmentType === 'in_store' ? 'Khách ghé trải nghiệm & nhận máy' : 'Bàn giao vận chuyển',
          note: params.fulfillmentType === 'local_express'
            ? `Shipper kỹ thuật viên đang giao hỏa tốc nội thành ${db.settings.targetProvince || 'tỉnh thành'}. Hỗ trợ lắp đặt tận nơi.`
            : 'Giao hàng tận nơi có đồng kiểm trước khi nhận.',
          completed: false,
        },
      ];

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderCode: code,
    createdAt: now.toISOString(),
    customerName: params.customerName.trim(),
    customerPhone: params.customerPhone.trim(),
    customerAddress: params.customerAddress?.trim() || (params.fulfillmentType === 'in_store' ? `Nhận tại: ${params.pickupBranchName || 'Showroom'}` : ''),
    customerEmail: params.customerEmail?.trim(),
    customerId: params.customerId,
    type: 'product_order',
    items: params.items,
    totalAmount: params.totalAmount,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === 'vietqr' ? 'paid' : 'unpaid',
    status: 'pending',
    technicianNotes: params.notes || (isInstallment ? `Đơn trả góp 0%: Trả trước ${formatVND(params.installmentDetails?.downPaymentAmount || 0)}, góp ${formatVND(params.installmentDetails?.monthlyPayment || 0)}/tháng.` : 'Khách đặt đơn online qua hệ thống.'),
    trackingTimeline: initialTimeline,
    fulfillmentType: params.fulfillmentType || 'nationwide_cod',
    pickupBranchId: params.pickupBranchId,
    pickupBranchName: params.pickupBranchName,
    installmentDetails: params.installmentDetails,
    notes: params.notes,
  };

  db.orders.unshift(newOrder);

  // Update or insert customer
  upsertCustomerFromOrder(db, newOrder);

  // If user is logged in, update user's totalSpent and orderCount
  if (db.currentUser && (params.customerId === db.currentUser.id || params.customerPhone === db.currentUser.phone)) {
    db.currentUser.orderCount = (db.currentUser.orderCount || 0) + 1;
    db.currentUser.totalSpent = (db.currentUser.totalSpent || 0) + newOrder.totalAmount;
    if (db.currentUser.totalSpent >= 50000000) db.currentUser.rank = 'VIP Kim Cương';
    else if (db.currentUser.totalSpent >= 20000000) db.currentUser.rank = 'VIP Vàng';
    else if (db.currentUser.totalSpent >= 5000000) db.currentUser.rank = 'VIP Bạc';

    if (db.users) {
      const uIdx = db.users.findIndex((u) => u.id === db.currentUser?.id);
      if (uIdx >= 0) db.users[uIdx] = { ...db.currentUser };
    }
  }

  saveDatabase(db);
  return newOrder;
}

export function createRepairBooking(params: {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  deviceType: string;
  issueDescription: string;
  serviceLocation: 'at_shop' | 'on_site';
  appointmentDate: string;
  appointmentTime: string;
  estimatedPrice: number;
}): Order {
  const db = loadDatabase();
  const code = generateOrderCode('FIX');
  const now = new Date();
  const dateFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  const repairDetails: RepairDetails = {
    serviceId: params.serviceId,
    serviceName: params.serviceName,
    deviceType: params.deviceType,
    issueDescription: params.issueDescription,
    serviceLocation: params.serviceLocation,
    appointmentDate: params.appointmentDate,
    appointmentTime: params.appointmentTime,
  };

  const newOrder: Order = {
    id: `fix-${Date.now()}`,
    orderCode: code,
    createdAt: now.toISOString(),
    customerName: params.customerName.trim(),
    customerPhone: params.customerPhone.trim(),
    customerAddress: params.customerAddress?.trim(),
    customerEmail: params.customerEmail?.trim(),
    type: 'repair_appointment',
    repairDetails,
    totalAmount: params.estimatedPrice,
    paymentMethod: 'in_store',
    paymentStatus: 'unpaid',
    status: 'pending',
    technicianNotes: `Triệu chứng khách báo: ${params.issueDescription}`,
    trackingTimeline: [
      {
        time: dateFormatted,
        title: 'Lịch hẹn sửa chữa đã ghi nhận',
        note: `Thiết bị: ${params.deviceType}. Hẹn vào lúc ${params.appointmentTime} ngày ${params.appointmentDate}.`,
        completed: true,
      },
      {
        time: 'Bước 2',
        title: 'Chẩn đoán sơ bộ & Báo giá chi tiết',
        note: 'Kỹ thuật viên bung máy kiểm tra bo mạch, báo giá chính xác cho khách trước khi xử lý.',
        completed: false,
      },
      {
        time: 'Bước 3',
        title: 'Tiến hành sửa chữa & Thay thế linh kiện',
        note: 'Sử dụng linh kiện chính hãng, khách hàng có thể giám sát trực tiếp.',
        completed: false,
      },
      {
        time: 'Bước 4',
        title: 'Kiểm thử hoàn thiện & Bàn giao',
        note: 'Test nhiệt độ, chạy thử tải nặng và bàn giao phiếu bảo hành.',
        completed: false,
      },
    ],
  };

  db.orders.unshift(newOrder);

  // Update customer record
  upsertCustomerFromOrder(db, newOrder);

  saveDatabase(db);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status'], technicianNote?: string): void {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;

  order.status = status;
  if (technicianNote) {
    order.technicianNotes = technicianNote;
  }

  // Update timeline milestone
  const now = new Date();
  const dateFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  if (status === 'processing') {
    order.trackingTimeline.push({
      time: dateFormatted,
      title: 'Đang xử lý / Kiểm tra kỹ thuật',
      note: technicianNote || 'Kỹ thuật viên đang kiểm tra phần cứng chi tiết.',
      completed: true,
    });
  } else if (status === 'repairing') {
    order.trackingTimeline.push({
      time: dateFormatted,
      title: 'Kỹ thuật viên đang tiến hành sửa chữa',
      note: technicianNote || 'Đang thay thế linh kiện và làm sạch bo mạch.',
      completed: true,
    });
  } else if (status === 'completed') {
    order.paymentStatus = 'paid';
    order.trackingTimeline.push({
      time: dateFormatted,
      title: 'Đã hoàn tất & Bàn giao thành công',
      note: technicianNote || 'Thiết bị hoạt động hoàn hảo, đã xuất hóa đơn bảo hành.',
      completed: true,
    });
  } else if (status === 'cancelled') {
    order.trackingTimeline.push({
      time: dateFormatted,
      title: 'Đơn hàng / Lịch hẹn đã hủy',
      note: technicianNote || 'Hủy theo yêu cầu của khách hàng hoặc không liên lạc được.',
      completed: true,
    });
  }

  saveDatabase(db);
}

export function addOrderTrackingStep(
  orderId: string,
  step: { title: string; note?: string; time?: string; completed?: boolean }
): void {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;

  const now = new Date();
  const dateFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  if (!order.trackingTimeline) {
    order.trackingTimeline = [];
  }

  order.trackingTimeline.push({
    time: step.time || dateFormatted,
    title: step.title,
    note: step.note || '',
    completed: step.completed !== undefined ? step.completed : true,
  });

  saveDatabase(db);
}

export function updateOrderPaymentStatus(orderId: string, paymentStatus: 'unpaid' | 'paid' | 'refunded'): void {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.paymentStatus = paymentStatus;
  saveDatabase(db);
}

export function deleteOrder(orderId: string): void {
  const db = loadDatabase();
  db.orders = db.orders.filter((o) => o.id !== orderId);
  saveDatabase(db);
}

// Customer sync
function upsertCustomerFromOrder(db: ShopDatabase, order: Order) {
  let cust = db.customers.find((c) => c.phone === order.customerPhone);
  if (cust) {
    cust.name = order.customerName || cust.name;
    cust.orderCount += 1;
    cust.totalSpent += order.totalAmount;
    if (order.customerAddress) cust.address = order.customerAddress;
    if (order.customerEmail) cust.email = order.customerEmail;
    // Calculate rank
    if (cust.totalSpent >= 50000000) cust.rank = 'VIP Kim Cương';
    else if (cust.totalSpent >= 20000000) cust.rank = 'VIP Vàng';
    else if (cust.totalSpent >= 5000000) cust.rank = 'VIP Bạc';
    else cust.rank = 'Thành viên';
  } else {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
      address: order.customerAddress,
      totalSpent: order.totalAmount,
      orderCount: 1,
      registeredAt: new Date().toISOString().split('T')[0],
      rank: order.totalAmount >= 20000000 ? 'VIP Vàng' : order.totalAmount >= 5000000 ? 'VIP Bạc' : 'Thành viên',
    };
    db.customers.unshift(newCust);
  }
}

export function updateCustomer(customer: Customer): void {
  const db = loadDatabase();
  const index = db.customers.findIndex((c) => c.id === customer.id);
  if (index >= 0) {
    db.customers[index] = { ...customer };
    saveDatabase(db);
  }
}

// ======================== SETTINGS & BACKUP ========================
export function updateSettings(settings: StoreSettings): void {
  const db = loadDatabase();
  db.settings = { ...settings };
  saveDatabase(db);
}

export function exportDatabaseToJson(): void {
  const db = loadDatabase();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `nexus_computer_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDatabaseFromJson(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString) as ShopDatabase;
    if (!parsed.products || !parsed.services || !parsed.orders || !parsed.settings) {
      return { success: false, message: 'Tệp JSON không đúng định dạng cơ sở dữ liệu Nexus Shop.' };
    }
    saveDatabase(parsed);
    return { success: true, message: 'Nhập cơ sở dữ liệu thành công! Tất cả sản phẩm, dịch vụ và đơn hàng đã được cập nhật.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Lỗi đọc tệp JSON: ${errorMsg}` };
  }
}

// ======================== WEBSITE CONTENT OPERATIONS ========================
export function updateWebsiteContent(content: Partial<WebsiteContent>): void {
  const db = loadDatabase();
  db.websiteContent = {
    ...db.websiteContent,
    ...content,
  };
  saveDatabase(db);
}

// ======================== HERO BANNER OPERATIONS ========================
export function upsertBanner(banner: HeroBanner): void {
  const db = loadDatabase();
  if (!db.banners) db.banners = [];
  const index = db.banners.findIndex((b) => b.id === banner.id);
  if (index >= 0) {
    db.banners[index] = { ...banner };
  } else {
    db.banners.push(banner);
  }
  saveDatabase(db);
}

export function deleteBanner(bannerId: string): void {
  const db = loadDatabase();
  if (!db.banners) return;
  db.banners = db.banners.filter((b) => b.id !== bannerId);
  saveDatabase(db);
}

// ======================== STORE BRANCH OPERATIONS ========================
export function upsertBranch(branch: StoreBranch): void {
  const db = loadDatabase();
  if (!db.branches) db.branches = [];
  const index = db.branches.findIndex((b) => b.id === branch.id);
  if (index >= 0) {
    db.branches[index] = { ...branch };
  } else {
    db.branches.push(branch);
  }
  saveDatabase(db);
}

export function deleteBranch(branchId: string): void {
  const db = loadDatabase();
  if (!db.branches) return;
  db.branches = db.branches.filter((b) => b.id !== branchId);
  saveDatabase(db);
}

// ======================== PC BUILD PACKAGE OPERATIONS ========================
export function upsertPCBuildPackage(pkg: PCBuildPackage): void {
  const db = loadDatabase();
  if (!db.pcBuildPackages) db.pcBuildPackages = [];
  const index = db.pcBuildPackages.findIndex((p) => p.id === pkg.id);
  if (index >= 0) {
    db.pcBuildPackages[index] = { ...pkg };
  } else {
    db.pcBuildPackages.push(pkg);
  }
  saveDatabase(db);
}

export function deletePCBuildPackage(pkgId: string): void {
  const db = loadDatabase();
  if (!db.pcBuildPackages) return;
  db.pcBuildPackages = db.pcBuildPackages.filter((p) => p.id !== pkgId);
  saveDatabase(db);
}

// ======================== ORDER TIMELINE OPERATIONS ========================
export function addOrderTimelineStep(orderId: string, step: TrackingStep): void {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (order) {
    if (!order.trackingTimeline) order.trackingTimeline = [];
    order.trackingTimeline.push(step);
    saveDatabase(db);
  }
}

// ======================== USER ACCOUNT OPERATIONS ========================
export function getCurrentUser(): UserAccount | null {
  const db = loadDatabase();
  return db.currentUser || null;
}

export function loginQuickGoogle(customEmail?: string, customName?: string): UserAccount {
  const db = loadDatabase();
  const email = (customEmail || 'hoaptdt2005@gmail.com').trim();
  const name = (customName || 'Nguyễn Thành Nam (Google VIP)').trim();
  if (!db.users) db.users = [];

  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `usr-gg-${Date.now()}`,
      name,
      email,
      phone: '0988123456',
      address: `Số 120 Đường Lạch Tray, Quận Ngô Quyền, ${db.settings?.targetProvince || 'Hải Phòng'}`,
      city: db.settings?.targetProvince || 'Hải Phòng',
      district: 'Quận Ngô Quyền',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      provider: 'google',
      rank: 'VIP Vàng',
      totalSpent: 28500000,
      orderCount: 3,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  }

  db.currentUser = user;
  saveDatabase(db);
  return user;
}

export function loginQuickPhone(phone: string, customName?: string): UserAccount {
  const db = loadDatabase();
  const cleanPhone = phone.trim();
  if (!db.users) db.users = [];

  let user = db.users.find((u) => u.phone === cleanPhone);

  if (!user) {
    user = {
      id: `usr-ph-${Date.now()}`,
      name: customName || `Khách hàng ${cleanPhone.slice(-4)}`,
      email: `${cleanPhone}@khachhang.nexus.vn`,
      phone: cleanPhone,
      address: `Nội thành ${db.settings?.targetProvince || 'Hải Phòng'}`,
      city: db.settings?.targetProvince || 'Hải Phòng',
      provider: 'phone',
      rank: 'Thành viên',
      totalSpent: 0,
      orderCount: 0,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  }

  db.currentUser = user;
  saveDatabase(db);
  return user;
}

export function loginWithEmail(email: string, name: string): UserAccount {
  const db = loadDatabase();
  const cleanEmail = email.trim().toLowerCase();
  if (!db.users) db.users = [];

  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    user = {
      id: `usr-em-${Date.now()}`,
      name: name.trim() || 'Khách hàng',
      email: cleanEmail,
      phone: '0912345678',
      address: `Nội thành ${db.settings?.targetProvince || 'Hải Phòng'}`,
      city: db.settings?.targetProvince || 'Hải Phòng',
      provider: 'email',
      rank: 'Thành viên',
      totalSpent: 0,
      orderCount: 0,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else if (name.trim()) {
    user.name = name.trim();
  }

  db.currentUser = user;
  saveDatabase(db);
  return user;
}

export function logoutUser(): void {
  const db = loadDatabase();
  db.currentUser = null;
  saveDatabase(db);
}

export function updateUserProfile(updates: Partial<UserAccount>): UserAccount | null {
  const db = loadDatabase();
  if (!db.currentUser) return null;

  const updatedUser: UserAccount = {
    ...db.currentUser,
    ...updates,
  };

  db.currentUser = updatedUser;
  if (db.users) {
    const idx = db.users.findIndex((u) => u.id === updatedUser.id);
    if (idx >= 0) db.users[idx] = updatedUser;
  }

  saveDatabase(db);
  return updatedUser;
}

export function resetDatabaseToDefault(): void {
  saveDatabase(initialSeedDatabase);
}
