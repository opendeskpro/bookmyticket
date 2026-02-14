
// localStorage-based data persistence (no external database)

// Helper functions for localStorage
const getFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setInStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Initialize storage structure
const initStorage = () => {
  if (!getFromStorage('users')) setInStorage('users', {});
  if (!getFromStorage('profiles')) setInStorage('profiles', {});
  if (!getFromStorage('organizers')) setInStorage('organizers', {});
  if (!getFromStorage('events')) setInStorage('events', {});
  if (!getFromStorage('bookings')) setInStorage('bookings', {});
  if (!getFromStorage('tickets')) setInStorage('tickets', {});
};

initStorage();

// Mock Supabase client for compatibility
export const supabase = {
  auth: {
    getSession: async () => {
      const sessionId = localStorage.getItem('session_user_id');
      if (!sessionId) return { data: { session: null }, error: null };

      const users = getFromStorage('users') || {};
      const user = users[sessionId];

      if (!user) return { data: { session: null }, error: null };

      return {
        data: {
          session: {
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone,
              user_metadata: { name: user.name, role: user.role }
            }
          }
        },
        error: null
      };
    },

    onAuthStateChange: (callback: any) => {
      // Simple polling for session changes
      const checkSession = async () => {
        const result = await supabase.auth.getSession();
        callback('SIGNED_IN', result.data.session);
      };

      checkSession();
      const interval = setInterval(checkSession, 1000);

      return {
        data: {
          subscription: {
            unsubscribe: () => clearInterval(interval)
          }
        }
      };
    },

    signUp: async ({ email, password, options }: any) => {
      const users = getFromStorage('users') || {};
      const userId = 'user-' + Date.now();

      const newUser = {
        id: userId,
        email,
        password, // In production, this should be hashed!
        name: options?.data?.name || 'User',
        role: options?.data?.role || 'PUBLIC',
        phone: null,
        created_at: new Date().toISOString()
      };

      users[userId] = newUser;
      setInStorage('users', users);

      // Create profile
      const profiles = getFromStorage('profiles') || {};
      profiles[userId] = {
        id: userId,
        email,
        full_name: newUser.name,
        role: newUser.role
      };
      setInStorage('profiles', profiles);

      return {
        data: {
          user: {
            id: userId,
            email,
            user_metadata: { name: newUser.name, role: newUser.role }
          }
        },
        error: null
      };
    },

    signInWithPassword: async ({ email, password }: any) => {
      const users = getFromStorage('users') || {};
      const user = Object.values(users).find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return {
          data: { user: null },
          error: { message: 'Invalid credentials' }
        };
      }

      localStorage.setItem('session_user_id', (user as any).id);

      return {
        data: {
          user: {
            id: (user as any).id,
            email: (user as any).email,
            user_metadata: { name: (user as any).name, role: (user as any).role }
          }
        },
        error: null
      };
    },

    signInWithOtp: async ({ phone, options }: any) => {
      // Mock OTP - just store the phone number
      localStorage.setItem('pending_otp_phone', phone);
      localStorage.setItem('pending_otp_data', JSON.stringify(options?.data || {}));
      return { error: null };
    },

    verifyOtp: async ({ phone, token, type }: any) => {
      const pendingPhone = localStorage.getItem('pending_otp_phone');
      const pendingData = JSON.parse(localStorage.getItem('pending_otp_data') || '{}');

      if (pendingPhone !== phone) {
        return { data: { user: null }, error: { message: 'Invalid phone' } };
      }

      // Accept any 6-digit code for demo
      if (token.length !== 6) {
        return { data: { user: null }, error: { message: 'Invalid code' } };
      }

      const users = getFromStorage('users') || {};
      const userId = 'user-' + Date.now();

      const newUser = {
        id: userId,
        email: pendingData.email || `${phone}@mobile.com`,
        phone,
        name: pendingData.name || 'User',
        role: pendingData.role || 'PUBLIC',
        created_at: new Date().toISOString()
      };

      users[userId] = newUser;
      setInStorage('users', users);

      localStorage.setItem('session_user_id', userId);
      localStorage.removeItem('pending_otp_phone');
      localStorage.removeItem('pending_otp_data');

      return {
        data: {
          user: {
            id: userId,
            email: newUser.email,
            phone,
            user_metadata: { name: newUser.name, role: newUser.role }
          }
        },
        error: null
      };
    },

    signOut: async () => {
      localStorage.removeItem('session_user_id');
      return { error: null };
    },

    signInWithOAuth: async ({ provider, options }: any) => {
      // Mock social login
      console.log('Social login not implemented in localStorage mode');
      return { data: null, error: { message: 'Social login not available' } };
    }
  },

  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const data = getFromStorage(table) || {};
          const item = Object.values(data).find((item: any) => item[column] === value);
          return { data: item || null, error: null };
        },
        maybeSingle: async () => {
          const data = getFromStorage(table) || {};
          const item = Object.values(data).find((item: any) => item[column] === value);
          return { data: item || null, error: null };
        }
      }),
      async then(resolve: any) {
        const data = getFromStorage(table) || {};
        resolve({ data: Object.values(data), error: null });
      }
    }),

    insert: (records: any[]) => ({
      select: () => ({
        single: async () => {
          const data = getFromStorage(table) || {};
          const record = records[0];
          const id = record.id || `${table}-${Date.now()}`;
          const newRecord = { ...record, id, created_at: new Date().toISOString() };
          data[id] = newRecord;
          setInStorage(table, data);
          return { data: newRecord, error: null };
        }
      })
    }),

    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            const data = getFromStorage(table) || {};
            const key = Object.keys(data).find(k => data[k][column] === value);
            if (key) {
              data[key] = { ...data[key], ...updates };
              setInStorage(table, data);
              return { data: data[key], error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          }
        })
      })
    }),

    upsert: (records: any, options?: any) => ({
      select: () => ({
        single: async () => {
          const data = getFromStorage(table) || {};
          const record = Array.isArray(records) ? records[0] : records;
          const id = record.id || `${table}-${Date.now()}`;
          data[id] = { ...data[id], ...record, id };
          setInStorage(table, data);
          return { data: data[id], error: null };
        }
      })
    })
  })
};

// --- DATABASE HELPER FUNCTIONS ---

export const signInWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
  return supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
};

export const upsertProfile = async (id: string, email: string, name: string) => {
  const profiles = getFromStorage('profiles') || {};
  profiles[id] = {
    id,
    email: email || `user-${id.substr(0, 8)}@example.com`,
    full_name: name,
    role: profiles[id]?.role || 'PUBLIC'
  };
  setInStorage('profiles', profiles);
  return profiles[id];
};

export const registerOrganizer = async (userId: string, orgName: string, pan: string) => {
  const organizers = getFromStorage('organizers') || {};
  const id = 'org-' + Date.now();
  const newOrg = {
    id,
    user_id: userId,
    org_name: orgName,
    pan_number: pan,
    status: 'PENDING',
    created_at: new Date().toISOString()
  };
  organizers[id] = newOrg;
  setInStorage('organizers', organizers);
  return newOrg;
};

export const approveOrganizer = async (organizerId: string, userId: string) => {
  const organizers = getFromStorage('organizers') || {};
  if (organizers[organizerId]) {
    organizers[organizerId].status = 'ACTIVE';
    setInStorage('organizers', organizers);
  }

  const profiles = getFromStorage('profiles') || {};
  if (profiles[userId]) {
    profiles[userId].role = 'ORGANISER';
    setInStorage('profiles', profiles);
  }

  const users = getFromStorage('users') || {};
  if (users[userId]) {
    users[userId].role = 'ORGANISER';
    setInStorage('users', users);
  }

  return organizers[organizerId];
};

export const rejectOrganizer = async (organizerId: string) => {
  const organizers = getFromStorage('organizers') || {};
  if (organizers[organizerId]) {
    organizers[organizerId].status = 'REJECTED';
    setInStorage('organizers', organizers);
  }
  return organizers[organizerId];
};

export const getOrganizersForAdmin = async () => {
  const organizers = getFromStorage('organizers') || {};
  return Object.values(organizers);
};

export const publishEvent = async (eventData: any, ticketTiers: any[]) => {
  const events = getFromStorage('events') || {};
  const eventId = 'event-' + Date.now();

  const newEvent = {
    ...eventData,
    id: eventId,
    created_at: new Date().toISOString(),
    ticket_types: ticketTiers
  };

  events[eventId] = newEvent;
  setInStorage('events', events);

  return { event: newEvent, ticketTypes: ticketTiers };
};

export const createBooking = async (userId: string, eventId: string, ticketTypeId: string, amount: number) => {
  const bookings = getFromStorage('bookings') || {};
  const tickets = getFromStorage('tickets') || {};

  const bookingId = 'booking-' + Date.now();
  const qrCode = 'QR-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const newBooking = {
    id: bookingId,
    user_id: userId,
    event_id: eventId,
    total_paid: amount,
    status: 'SUCCESS',
    created_at: new Date().toISOString()
  };

  const newTicket = {
    id: 'ticket-' + Date.now(),
    booking_id: bookingId,
    ticket_type_id: ticketTypeId,
    qr_code: qrCode,
    is_used: false
  };

  bookings[bookingId] = newBooking;
  tickets[newTicket.id] = newTicket;

  setInStorage('bookings', bookings);
  setInStorage('tickets', tickets);

  return { booking: newBooking, qrCode };
};

export const validateTicket = async (qrCode: string) => {
  const tickets = getFromStorage('tickets') || {};
  const ticket = Object.values(tickets).find((t: any) => t.qr_code === qrCode);

  if (!ticket) {
    return { valid: false, message: 'Ticket not found' };
  }

  if ((ticket as any).is_used) {
    return { valid: false, message: 'Ticket already used' };
  }

  // Mark as used
  tickets[(ticket as any).id].is_used = true;
  setInStorage('tickets', tickets);

  return { valid: true, ticket };
};
