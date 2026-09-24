export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string | number;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export interface ActivityItem {
  id: string;
  name: string;
  category: 'Kho mã nguồn' | 'Tài liệu' | 'Tích hợp' | 'Thiết kế' | 'Cấu hình';
  status: 'Hoạt động' | 'Chờ duyệt' | 'Đang xử lý' | 'Đã lưu trữ';
  dateModified: string;
  iconType: 'folder' | 'file' | 'layers';
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  iconName: 'FolderGit2' | 'Clock' | 'Users' | 'CheckCircle2';
  iconColor: string;
  changeText: string;
  changeColor: string;
  progressPercent: number;
  progressStatus: string;
  progressColor: string;
  trackColor?: string;
}
