
export enum UserRole {
  PUBLIC = 'PUBLIC',
  ORGANISER = 'ORGANISER',
  ADMIN = 'ADMIN'
}

export enum TicketStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  USED = 'USED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletBalance: number;
  isMobileVerified?: boolean;
  mobile?: string;
}

export interface PricingBreakup {
  finalPrice: number;    // Always 500 for the user
  basePrice: number;     // Organizer's gross
  gstAmount: number;     // Govt. share (18% on fees)
  platformFee: number;   // Platform share
  internetCharge: number; // Handling fee
}

// Updated TicketType to include price and type used in CreateEventPage and mock data
export interface TicketType {
  id: string;
  eventId?: string;
  name: string;
  price?: number;
  pricing?: PricingBreakup;
  quantity: number;
  sold: number;
  type?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Updated Event to include missing properties used in templates and mock data
export interface Event {
  id: string;
  organiserId: string;
  title: string;
  description: string;
  category: string;
  city?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  zipCode?: string;
  location?: string;
  banner: string;
  banner_url?: string;
  date: string;
  event_date?: string;
  time: string;
  start_time?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  isVirtual?: boolean;
  isExclusive?: boolean;
  isSpotlight?: boolean;
  tickets: TicketType[];
  hasSeating?: boolean;
  reviews?: Review[];
  rating?: number;
  refundPolicy?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

export interface Ticket {
  id: string;
  bookingId: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  ticketTypeName: string;
  qrCode: string;
  status: TicketStatus;
  purchaseDate: string;
  pricePaid: number; // Always 500
  seats?: string[];
}

// Added missing interface for Admin Audit Logs
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  module: string;
  targetId: string;
  payload?: any;
  createdAt: string;
}

// Added missing interface for CMS Content management
export interface CMSContent {
  id: string;
  type: 'BANNER' | 'CITY' | 'CATEGORY';
  label: string;
  value: string;
  imageUrl?: string;
  isActive: boolean;
}

// Added missing interface for Organizer management
export interface Organizer {
  id: string;
  userId: string;
  orgName: string;
  bio: string;
  website: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  panNumber: string;
  bankDetails: any;
  walletBalance: number;
}

// NEW: Ecommerce Product interface
export interface Product {
  id: string;
  organiserId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  type: 'PHYSICAL' | 'DIGITAL';
  stock: number;
  status: 'ACTIVE' | 'DEACTIVE';
  isFeatured: boolean;
  createdAt: string;
}

// NEW: Financial Transaction interface
export interface Transaction {
  id: string;
  organiserId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  method: string;
  preBalance: number;
  afterBalance: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
}

// NEW: Withdrawal request interface
export interface Withdrawal {
  id: string;
  organiserId: string;
  amount: number;
  charge: number; // Platform commission
  payable: number; // Final amount to organizer
  method: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// NEW: Blog/CMS interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  author: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
}

export interface AppState {
  user: User | null;
  events: Event[];
  tickets: Ticket[];
  transactions?: any[]; // Added to match usage in App.tsx
}
