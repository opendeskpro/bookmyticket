import { User, UserRole, Event, TicketStatus } from '../types';

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Raja User',
        email: 'user@example.com',
        role: UserRole.USER,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: '+91 9876543210'
    },
    {
        id: 'o1',
        name: 'Event Organizer Pro',
        email: 'organizer@example.com',
        role: UserRole.ORGANISER,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        phone: '+91 9876543211',
        kycStatus: 'VERIFIED',
        organizationName: 'Pro Events Ltd.'
    },
    {
        id: 'a1',
        name: 'Super Admin',
        email: 'admin@bookmyticket.com',
        role: UserRole.ADMIN,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        phone: '+91 9876543212'
    }
];

export const MOCK_EVENTS = [
    {
        id: 'e1',
        title: 'Tech Conference 2026',
        description: 'The biggest tech conference of the year featuring top speakers from around the globe.',
        date: '2026-06-15',
        time: '09:00',
        location: 'Bangalore International Exhibition Centre',
        city: 'Bengaluru',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
        category: 'Technology',
        organizerId: 'o1',
        isSeatBookingEnabled: true,
        totalSeats: 500,
        availableSeats: 120,
        status: 'PUBLISHED'
    },
    {
        id: 'e2',
        title: 'Summer Music Festival',
        description: 'Experience live music under the stars with top bands and artists.',
        date: '2026-07-20',
        time: '18:00',
        location: 'Jawaharlal Nehru Stadium',
        city: 'Chennai',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
        category: 'Music',
        organizerId: 'o1',
        isSeatBookingEnabled: false, // General Admission
        totalTickets: 5000,
        soldTickets: 3500,
        status: 'PUBLISHED'
    },
    {
        id: 'e3',
        title: 'Startup Networking Meetup',
        description: 'Connect with founders, investors, and industry leaders.',
        date: '2026-08-05',
        time: '17:00',
        location: 'WeWork Galaxy',
        city: 'Bengaluru',
        price: 0,
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1000&q=80',
        category: 'Business',
        organizerId: 'o1',
        isSeatBookingEnabled: false,
        totalTickets: 100,
        soldTickets: 85,
        status: 'PUBLISHED'
    }
];

export const MOCK_BOOKINGS = [
    {
        id: 'b1',
        eventId: 'e1',
        userId: 'u1',
        bookingDate: '2026-05-10T10:30:00Z',
        status: TicketStatus.CONFIRMED,
        totalAmount: 4999,
        ticketType: 'VIP',
        seats: ['A1', 'A2'],
        qrCode: 'mock-qr-code-data-1'
    },
    {
        id: 'b2',
        eventId: 'e2',
        userId: 'u1',
        bookingDate: '2026-06-01T14:15:00Z',
        status: TicketStatus.CONFIRMED,
        totalAmount: 3000,
        ticketType: 'General Admission',
        quantity: 2,
        qrCode: 'mock-qr-code-data-2'
    }
];

export const MOCK_KYC_DOCS = {
    aadhaar: 'XXXX-XXXX-1234',
    pan: 'ABCDE1234F',
    gst: '29ABCDE1234F1Z5',
    bankAccount: {
        holderName: 'Pro Events Ltd.',
        accountNumber: '1234567890',
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank'
    },
    status: 'PENDING_VERIFICATION'
};

export const MOCK_ATTENDEES = [
    {
        id: 'at1',
        name: 'John Doe',
        email: 'john@example.com',
        ticketId: 't1',
        eventId: 'e1',
        eventName: 'Tech Conference 2026',
        ticketType: 'VIP',
        checkInStatus: 'CHECKED_IN',
        checkInTime: '2026-06-15T08:45:00Z',
        purchaseDate: '2026-05-10'
    },
    {
        id: 'at2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        ticketId: 't2',
        eventId: 'e1',
        eventName: 'Tech Conference 2026',
        ticketType: 'Standard',
        checkInStatus: 'PENDING',
        checkInTime: null,
        purchaseDate: '2026-05-12'
    },
    {
        id: 'at3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        ticketId: 't3',
        eventId: 'e2',
        eventName: 'Summer Music Festival',
        ticketType: 'General Admission',
        checkInStatus: 'PENDING',
        checkInTime: null,
        purchaseDate: '2026-06-01'
    }
];

export const MOCK_PAYOUTS = [
    {
        id: 'p1',
        amount: 25000,
        date: '2026-06-01',
        status: 'PAID',
        referenceId: 'REF123456789',
        eventId: 'e1' // Payout for Tech Conf
    },
    {
        id: 'p2',
        amount: 15000,
        date: '2026-06-15',
        status: 'PROCESSING',
        referenceId: 'REF987654321',
        eventId: 'e2'
    }
];

export const MOCK_TRANSACTIONS = [
    {
        id: 'tx1',
        user: 'John Doe',
        event: 'Tech Conference 2026',
        amount: 4999,
        date: '2026-05-10',
        status: 'SUCCESS',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'tx2',
        user: 'Jane Smith',
        event: 'Tech Conference 2026',
        amount: 2499,
        date: '2026-05-12',
        status: 'SUCCESS',
        paymentMethod: 'UPI'
    },
    {
        id: 'tx3',
        user: 'Mike Johnson',
        event: 'Summer Music Festival',
        amount: 1500,
        date: '2026-06-01',
        status: 'FAILED',
        paymentMethod: 'Net Banking'
    }
];

export const MOCK_EMAIL_TEMPLATES = [
    { id: 1, type: 'Verify Email', subject: 'Verify Your Email Address' },
    { id: 2, type: 'Reset Password', subject: 'Recover Password of Your Account' },
    { id: 3, type: 'Event Booking', subject: 'Event Confirmation' },
    { id: 4, type: 'Event Booking Approved', subject: 'Approval of Event Booking' },
    { id: 5, type: 'Event Booking Rejected', subject: 'Rejection of Event Booking' },
    { id: 6, type: 'Product Order', subject: 'Order Confirmation' },
    { id: 7, type: 'Withdraw Approve', subject: 'Confirmation of Withdraw Approve' },
    { id: 8, type: 'Withdraw Rejected', subject: 'Withdraw Request Rejected' },
    { id: 9, type: 'Balance Add', subject: 'Balance Add' },
    { id: 10, type: 'Balance Subtract', subject: 'Balance Subtract' },
    { id: 11, type: 'Product Shipping', subject: 'Product Shipping Status' },
];
