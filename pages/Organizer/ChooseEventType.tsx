import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User } from '../../types';
import { getEventCategories } from '../../lib/supabase';
import {
  Music,
  Mic2,
  Users,
  Presentation,
  Trophy,
  Smile,
  FerrisWheel,
  Calendar,
  Video,
  MoreHorizontal,
  Loader2,
  Home,
  ChevronRight,
} from 'lucide-react';

export const EVENT_TYPE_OPTIONS = [
  { id: 'Entertainment', label: 'Entertainment', description: 'Shows, festivals, and general entertainment', icon: FerrisWheel, color: 'bg-violet-500' },
  { id: 'Concert', label: 'Concert', description: 'Live music and performances', icon: Music, color: 'bg-pink-500' },
  { id: 'Comedy Show', label: 'Comedy Show', description: 'Stand-up and comedy events', icon: Smile, color: 'bg-amber-500' },
  { id: 'Conference', label: 'Conference', description: 'Business and professional conferences', icon: Users, color: 'bg-blue-500' },
  { id: 'Workshop', label: 'Workshop', description: 'Hands-on learning and workshops', icon: Presentation, color: 'bg-emerald-500' },
  { id: 'Exhibition', label: 'Exhibition', description: 'Expos and exhibitions', icon: Presentation, color: 'bg-teal-500' },
  { id: 'Sports', label: 'Sports', description: 'Sports and fitness events', icon: Trophy, color: 'bg-green-500' },
  { id: 'Meetup', label: 'Meetup', description: 'Community meetups and networking', icon: Mic2, color: 'bg-indigo-500' },
  { id: 'Webinar', label: 'Webinar', description: 'Online seminars and webinars', icon: Video, color: 'bg-cyan-500' },
  { id: 'Other', label: 'Other', description: 'Other event types', icon: MoreHorizontal, color: 'bg-slate-500' },
];

interface ChooseEventTypeProps {
  user: User | null;
}

const ChooseEventType: React.FC<ChooseEventTypeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string; icon?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventCategories()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCategories(data.map((c: any) => ({ id: c.id, name: c.name || c.id, icon: c.icon })));
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const displayTypes = categories.length > 0
    ? categories.map((c) => {
        const opt = EVENT_TYPE_OPTIONS.find((o) => o.id === c.name || o.label === c.name);
        return opt || { id: c.name, label: c.name, description: `${c.name} events`, icon: Calendar, color: 'bg-slate-500' };
      })
    : EVENT_TYPE_OPTIONS;

  const handleSelect = (eventTypeId: string) => {
    navigate('/organizer/create-event', { state: { selectedEventType: eventTypeId } });
  };

  return (
    <DashboardLayout user={user}>
      {/* Light, high-contrast content area (reference: second image) */}
      <div className="max-w-4xl mx-auto bg-[#f5f5f5] min-h-[60vh] rounded-2xl p-6 md:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-slate-600">
          <Link to="/organizer/dashboard" className="flex items-center gap-1 hover:text-[#FF006E] transition-colors">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500">Event Management</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-800 font-medium">Choose Event Type</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Choose Event Type</h1>
          <p className="text-slate-600 mt-2 text-base">
            Select the type of event you want to create. You can add details in the next step.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF006E]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleSelect(type.id)}
                  className="group flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-[#FF006E]/30 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl ${type.color} text-white flex items-center justify-center mb-4`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base uppercase tracking-wide group-hover:text-[#FF006E] transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-800">Tip:</strong> Your event will be tagged with this type so attendees can find it easily. You can still edit details and category later in the create event form.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChooseEventType;
