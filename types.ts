
export enum UserRole {
  PUBLIC = 'PUBLIC', // Added Public role
  USER = 'USER', // Added USER role
  ORGANISER = 'ORGANISER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  THEATRE_ADMIN = 'THEATRE_ADMIN'
}

export enum TicketStatus {
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED', // Added CONFIRMED status
  CANCELLED = 'CANCELLED',
  USED = 'USED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string; // New: matches backend 'full_name' column
  role: UserRole;
  walletBalance?: number; // Made optional as it wasn't in mock data
  isMobileVerified?: boolean;
  mobile?: string;
  avatar?: string; // New
  phone?: string; // New
  kycStatus?: string; // New for Organizer
  organizationName?: string; // New for Organizer
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

// NEW: Ticket Tier interface for multi-type tickets
export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  available?: number;
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
  state?: string;
  district?: string;
  pincode?: string;
  zipCode?: string; // Kept for compat
  location?: string;
  banner: string;
  banner_url?: string;
  date: string;
  event_date?: string;
  time: string;
  start_time?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  isVirtual?: boolean;
  is_virtual?: boolean; // Snake case for partial Supabase compat
  meeting_id?: string;
  isExclusive?: boolean;
  isSpotlight?: boolean;
  tickets: TicketType[];
  ticketTiers?: TicketTier[]; // New field for multi-tier support
  showtimes?: string[]; // New field for multi-show support (e.g. ["10:00", "14:00"])
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
  bookingTime?: string; // New field for selected show time
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


// --- Movie Ticket Booking System Interfaces ---

export interface Movie {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  cover_url?: string;
  trailer_url?: string;
  language: string[];
  genre: string[];
  duration_minutes: number;
  release_date: string;
  rating?: number;
  is_active: boolean;
}

export interface Theater {
  id: string;
  owner_id: string;
  city_id: string;
  name: string;
  address: string;
  facilities: string[];
  is_active: boolean;
}

export interface Screen {
  id: string;
  theater_id: string;
  name: string;
  type: string;
}

export interface SeatTier {
  id: string;
  screen_id: string;
  name: string;
  price: number;
  display_order: number;
}

export interface Seat {
  id: string;
  screen_id: string;
  tier_id: string;
  row_label: string;
  seat_number: number;
  grid_row: number;
  grid_col: number;
  is_aisle: boolean;
  status?: 'available' | 'booked' | 'locked' | 'selected'; // Frontend state
  price?: number; // Joined from tier
  tier_name?: string; // Joined from tier
}

export interface Show {
  id: string;
  screen_id: string;
  movie_id: string;
  start_time: string;
  end_time: string;
  language: string;
  format: string;
  is_active: boolean;
  screen?: Screen; // Joined
  theater?: Theater; // Joined
}

export interface Booking {
  id: string;
  user_id: string;
  show_id: string;
  total_amount: number;
  tax_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  payment_intent_id?: string;
  booking_code?: string;
  created_at: string;
  expires_at?: string;
  seats?: BookingSeat[];
  show?: Show;
  movie?: Movie;
}

export interface BookingSeat {
  id: string;
  booking_id: string;
  seat_id: string;
  price: number;
  seat?: Seat;
}

export interface AppState {
  user: User | null;
  events: Event[];
  tickets: Ticket[];
  transactions?: any[];
}

