
import React from 'react';
import { 
  Music, 
  Trophy, 
  Cpu, 
  Theater, 
  Mic2, 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Users,
  PartyPopper,
  Zap,
  Clock,
  Heart,
  Headphones,
  Tv,
  Gamepad2,
  Dumbbell
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'All', icon: <Zap size={18} />, color: 'bg-slate-100 text-slate-600' },
  { name: 'Concert', icon: <Music size={18} />, color: 'bg-purple-100 text-purple-600' },
  { name: 'Sports', icon: <Trophy size={18} />, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Musics', icon: <Headphones size={18} />, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Live Shows', icon: <Theater size={18} />, color: 'bg-orange-100 text-orange-600' },
  { name: 'Comedy Show', icon: <Mic2 size={18} />, color: 'bg-pink-100 text-pink-600' },
  { name: 'Workshops', icon: <Cpu size={18} />, color: 'bg-blue-100 text-blue-600' }
];

export const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Saree, These Are Just Jokes!',
    description: 'A stand-up comedy special by Sharul Channa exploring the quirks of life.',
    category: 'Comedy Show',
    location: 'Coimbatore',
    date: '2026-03-13',
    time: '20:00',
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&h=1000&auto=format&fit=crop',
    organiserId: 'org1',
    status: 'APPROVED',
    isVirtual: false,
    isExclusive: true,
    tickets: [{ id: 't1', name: 'Paid', price: 499, quantity: 200, sold: 150 }]
  },
  {
    id: '2',
    title: 'Moonwalk Musical Night',
    description: 'A tribute to A R Rahman & Prabhudeva.',
    category: 'Musics',
    location: 'Chennai',
    date: '2026-01-04',
    time: '18:30',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&h=400&auto=format&fit=crop',
    organiserId: 'org2',
    status: 'APPROVED',
    tickets: [{ id: 't2', name: 'Standard', price: 999, quantity: 500, sold: 120 }]
  },
  {
    id: '3',
    title: 'Soulfest 2025',
    description: 'The magic of pure sound in an architecturally designed auditorium.',
    category: 'Concert',
    location: 'Chennai',
    date: '2025-12-24',
    time: '19:00',
    banner: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&h=400&auto=format&fit=crop',
    organiserId: 'org3',
    status: 'APPROVED',
    tickets: [{ id: 't3', name: 'General', price: 1500, quantity: 300, sold: 45 }]
  }
];
