export type ProductCategory = 'pc_gaming' | 'laptop' | 'component' | 'accessory';

export interface ProductSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  mainboard?: string;
  psu?: string;
  screen?: string;
  warranty?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: string;
  installmentZero?: boolean;
  isFlashSale?: boolean;
  flashSaleSold?: number;
  flashSaleTotal?: number;
  giftPromotion?: string;
  specs: ProductSpecs;
  description: string;
  isFeatured?: boolean;
}

export type ServiceCategory = 'repair' | 'maintenance' | 'software' | 'upgrade' | 'custom_build';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  priceEstimate: string;
  rawPrice: number;
  turnaroundTime: string;
  warrantyMonths: number;
  iconName: string;
  description: string;
  highlights: string[];
  isPopular?: boolean;
}

export type OrderType = 'product_order' | 'repair_appointment';
export type OrderStatus = 'pending' | 'processing' | 'repairing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'vietqr' | 'in_store' | 'installment_0';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type FulfillmentType = 'in_store' | 'local_express' | 'nationwide_cod';

export interface InstallmentDetails {
  method: 'credit_card' | 'id_card'; // Thẻ tín dụng hoặc CCCD
  provider: string; // VD: "Home Credit", "FE Credit", "HD Saison", "Thẻ Tín Dụng Quốc Tế 0%"
  termMonths: number; // 3, 6, 9, 12 tháng
  downPaymentPercent: number; // 0, 10, 20, 30, 50%
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPayment: number;
  interestRate: number; // 0%
  idCardNumber?: string;
  monthlyIncome?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  district?: string;
  avatarUrl?: string;
  provider: 'google' | 'phone' | 'email';
  rank: 'Thành viên' | 'VIP Bạc' | 'VIP Vàng' | 'VIP Kim Cương';
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  specsSnippet?: string;
}

export interface RepairDetails {
  serviceId: string;
  serviceName: string;
  deviceType: string; // e.g. "Laptop ASUS ROG", "PC Desktop Gaming"
  issueDescription: string;
  serviceLocation: 'at_shop' | 'on_site';
  appointmentDate: string;
  appointmentTime: string;
}

export interface TrackingStep {
  time: string;
  title: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderCode: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerEmail?: string;
  customerId?: string;
  type: OrderType;
  items?: CartItem[];
  repairDetails?: RepairDetails;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  technicianNotes?: string;
  trackingTimeline: TrackingStep[];
  fulfillmentType?: FulfillmentType;
  pickupBranchId?: string;
  pickupBranchName?: string;
  installmentDetails?: InstallmentDetails;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalSpent: number;
  orderCount: number;
  registeredAt: string;
  rank: 'Thành viên' | 'VIP Bạc' | 'VIP Vàng' | 'VIP Kim Cương';
  notes?: string;
}

export interface HeroBanner {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: 'flash_sale' | 'category' | 'booking' | 'pc_builder' | 'trade_in';
  targetCategory?: ProductCategory;
  bgGradientDark?: string;
  bgGradientLight?: string;
  accentColor?: string;
  imageUrl?: string;
  isActive: boolean;
  active?: boolean;
  actionLink?: string;
  order?: number;
}

export interface StoreBranch {
  id: string;
  name: string;
  city: 'thainguyen' | 'hcm' | 'hn' | 'danang' | 'cantho' | 'other' | (string & {});
  cityName: string;
  address: string;
  hotline: string;
  hours: string;
  features: string[];
  isMain: boolean;
}

export interface PCBuildPackage {
  id: string;
  name: string;
  target: string;
  price: number;
  originalPrice: number;
  specs: {
    cpu: string;
    mainboard: string;
    ram: string;
    gpu: string;
    storage: string;
    psu: string;
    case: string;
    cooling: string;
  };
}

export interface TrustPledge {
  id: string;
  title: string;
  description: string;
  iconType: 'shield' | 'clock' | 'card' | 'award';
}

export interface DiscountVoucher {
  id: string;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface TechArticleCMS {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  author: string;
  imageUrl: string;
  publishedDate: string;
}

export interface SectionVisibilityCMS {
  showMarquee?: boolean;
  showHeroSlider?: boolean;
  showShowroomsStrip?: boolean;
  showFlashSale?: boolean;
  showCatalog?: boolean;
  showPCBuilder?: boolean;
  showServices?: boolean;
  showTechArticles?: boolean;
  showShowroomsMap?: boolean;
  showTrustPledges?: boolean;
}

export interface WebsiteContent {
  showAnnouncement: boolean;
  announcementText: string;
  flashSaleActive: boolean;
  flashSaleTitle: string;
  flashSaleSubtitle: string;
  flashSaleHours: number;
  catalogBadge: string;
  catalogTitle: string;
  catalogSubtitle: string;
  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  showroomsBadge: string;
  showroomsTitle: string;
  showroomsSubtitle: string;
  trustPledges: TrustPledge[];
  footerDescription: string;
  footerCopyright: string;

  // Deep CMS customizations
  sectionVisibility?: SectionVisibilityCMS;
  vouchers?: DiscountVoucher[];
  articles?: TechArticleCMS[];
  taxNumber?: string;
  businessLicense?: string;
  bctCertificateNumber?: string;
  facebookFanpage?: string;
  tiktokShop?: string;
  youtubeChannel?: string;
  complaintHotline?: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  tagline: string;
  hotline: string;
  zalo: string;
  email: string;
  address: string;
  workingHours: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;

  // Định vị bán hàng tại một tỉnh thành (Local Province/City Focus)
  targetProvince: string; // VD: "Hải Phòng", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Bình Dương"...
  provinceDeliveryNotice: string; // Thông điệp giao nhanh trong tỉnh
  provinceExpressHours: string; // Thời gian hỏa tốc, VD: "1 - 2 giờ"
  provinceFreeShipThreshold: number; // Mức đơn hàng miễn phí giao hàng tại tỉnh

  // Bật/tắt các phương thức mua hàng & thanh toán
  enableInStorePickup: boolean;
  enableLocalExpress: boolean;
  enableCodDelivery: boolean;
  enableCodPayment?: boolean;
  enableVietQR: boolean;
  enableInstallment: boolean;
  installmentHotline: string;
}

export interface ShopDatabase {
  products: Product[];
  services: ServiceItem[];
  orders: Order[];
  customers: Customer[];
  settings: StoreSettings;
  banners: HeroBanner[];
  branches: StoreBranch[];
  pcBuildPackages: PCBuildPackage[];
  websiteContent: WebsiteContent;
  users?: UserAccount[];
  currentUser?: UserAccount | null;
  version: string;
  lastUpdated: string;
}
