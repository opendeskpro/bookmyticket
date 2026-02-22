import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import SeatLayoutBuilder from '../../components/Organizer/SeatLayoutBuilder';
import { Image as ImageIcon, Calendar, MapPin, DollarSign, Layout, Type, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User } from '../../types';

interface CreateEventProps {
    user: User | null;
}

const CreateEvent: React.FC<CreateEventProps> = ({ user }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSeated, setIsSeated] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        city: '',
        venue: '',
        description: '',
        banner_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
        category: 'Entertainment'
    });

    const [showtimes, setShowtimes] = useState<string[]>([]);
    const [currentTime, setCurrentTime] = useState('');

    const addTime = () => {
        if (currentTime && !showtimes.includes(currentTime)) {
            setShowtimes([...showtimes, currentTime].sort());
            setCurrentTime('');
        }
    };

    const removeTime = (time: string) => {
        setShowtimes(showtimes.filter(t => t !== time));
    };

    const handlePublish = async () => {
        if (!formData.title || !formData.date || !formData.city) {
            toast.error("Please fill in the required fields");
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            await api.events.create({
                ...formData,
                event_date: formData.date,
                start_time: showtimes[0] || '19:00', // Take first slot or default
                banner_url: formData.banner_url,
                is_virtual: false,
                status: 'PUBLISHED'
            });

            toast.success('Event Published Successfully!');
            navigate('/organizer/events');
        } catch (error: any) {
            console.error("Error creating event:", error);
            toast.error(error.message || 'Failed to publish event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Create New Event</h1>
                    <div className="flex gap-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#FF006E]' : 'bg-gray-200'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#FF006E]' : 'bg-gray-200'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#FF006E]' : 'bg-gray-200'}`}></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Type className="text-gray-400" /> Basic Details
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF006E]/20 outline-none"
                                        placeholder="e.g. Summer Music Festival"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                className="w-full pl-10 p-3 border border-gray-200 rounded-lg outline-none"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slots</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="time"
                                                className="flex-1 p-3 border border-gray-200 rounded-lg outline-none"
                                                value={currentTime}
                                                onChange={(e) => setCurrentTime(e.target.value)}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={addTime}
                                                type="button"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {showtimes.map((time) => (
                                                <span key={time} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {time}
                                                    <button onClick={() => removeTime(time)} className="text-gray-400 hover:text-red-500">&times;</button>
                                                </span>
                                            ))}
                                            {showtimes.length === 0 && <span className="text-xs text-gray-400">Add multiple times for single day events</span>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue & City</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                className="w-full pl-10 p-3 border border-gray-200 rounded-lg outline-none"
                                                placeholder="e.g. Grand Arena"
                                                value={formData.venue}
                                                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-32 p-3 border border-gray-200 rounded-lg outline-none"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                                        placeholder="Tell people what makes your event special..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setStep(2)}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Media & Pricing Type */}
                    {step === 2 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ImageIcon className="text-gray-400" /> Media & Configuration
                            </h2>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600 font-medium">Click to upload Event Banner</p>
                                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${!isSeated ? 'border-[#FF006E] bg-[#FF006E]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setIsSeated(false)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-full ${!isSeated ? 'bg-[#FF006E] text-white' : 'bg-gray-100 text-gray-500'}`}><DollarSign size={20} /></div>
                                            <span className="font-bold">General Admission</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Simple ticket types (e.g., Gold, Silver) without seat selection.</p>
                                    </div>

                                    <div
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSeated ? 'border-[#FF006E] bg-[#FF006E]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setIsSeated(true)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-full ${isSeated ? 'bg-[#FF006E] text-white' : 'bg-gray-100 text-gray-500'}`}><Layout size={20} /></div>
                                            <span className="font-bold">Seated Layout</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Interactive seat map where users pick specific seats.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => setStep(3)}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Tickets / Layout */}
                    {step === 3 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                {isSeated ? <Layout className="text-gray-400" /> : <DollarSign className="text-gray-400" />}
                                {isSeated ? 'Design Seat Layout' : 'Ticket Categories'}
                            </h2>

                            {isSeated ? (
                                <SeatLayoutBuilder onSave={(layout) => console.log(layout)} />
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                                    General Admission Configuration Placeholder
                                </div>
                            )}

                            <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={handlePublish} isLoading={loading}>Publish Event</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateEvent;
