import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { supabase } from '../../../lib/supabase';
import { Save, Calendar, Clock, Image as ImageIcon, Type, Link, Upload, ChevronRight, CheckCircle2, AlertCircle, Copy, Globe, Plus, Trash2 } from 'lucide-react';
import EventLocation from './EventLocation';

interface AddEventProps {
    type: 'online' | 'venue';
}

const AddEvent: React.FC<AddEventProps> = ({ type }) => {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeLang, setActiveLang] = useState('en');

    // Refs for file inputs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category_id: '',
        type: type,
        description: '',
        poster_image: '',
        thumbnail: '',
        date_type: 'single', // single | multiple
        countdown_status: 'active', // active | deactive
        organizer: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        // Array for multiple dates
        multiple_dates: [] as { start_date: string, start_time: string, end_date: string, end_time: string }[],
        status: 'active',
        is_featured: false,
        refund_policy: '',
        meta_keywords: '',
        meta_description: '',
        // Venue fields
        venue_name: '',
        address: '',
        country_id: '',
        state_id: '',
        city_id: '',
        district_name: '', // New field
        zip_code: '',
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('event_categories').select('*').eq('status', 'active');
        setCategories(data || []);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'title') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleLocationChange = (locationData: any) => {
        setFormData(prev => ({ ...prev, ...locationData }));
    };

    // Multiple Date Logic
    const addDateRow = () => {
        setFormData(prev => ({
            ...prev,
            multiple_dates: [...prev.multiple_dates, { start_date: '', start_time: '', end_date: '', end_time: '' }]
        }));
    };

    const removeDateRow = (index: number) => {
        const newDates = [...formData.multiple_dates];
        newDates.splice(index, 1);
        setFormData(prev => ({ ...prev, multiple_dates: newDates }));
    };

    const handleDateRowChange = (index: number, field: string, value: string) => {
        const newDates = [...formData.multiple_dates];
        (newDates[index] as any)[field] = value;
        setFormData(prev => ({ ...prev, multiple_dates: newDates }));
    };

    // Image Upload Logic
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'poster_image') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
            // Here you would typically upload 'file' to Supabase Storage
            // For now, we use the Data URL for immediate preview
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);

        // Initial Validation
        if (!formData.title || !formData.category_id) {
            setMessage({ type: 'error', text: 'Title and Category are required.' });
            setLoading(false);
            return;
        }

        // Date Validation
        if (formData.date_type === 'single') {
            if (!formData.start_date || !formData.end_date) {
                setMessage({ type: 'error', text: 'Start and End dates are required.' });
                setLoading(false);
                return;
            }
        } else {
            if (formData.multiple_dates.length === 0) {
                setMessage({ type: 'error', text: 'Please add at least one date for multiple events.' });
                setLoading(false);
                return;
            }
        }

        if (type === 'venue' && (!formData.country_id || !formData.address)) {
            setMessage({ type: 'error', text: 'Venue location details are required.' });
            setLoading(false);
            return;
        }

        try {
            // Construct payload
            let finalStartDate, finalEndDate;

            if (formData.date_type === 'single') {
                finalStartDate = new Date(`${formData.start_date}T${formData.start_time || '00:00'}:00`).toISOString();
                finalEndDate = new Date(`${formData.end_date}T${formData.end_time || '23:59'}:00`).toISOString();
            } else {
                // For multiple, we take the earliest start and latest end for the main record
                // In a real app, you might create a separate 'event_dates' table
                // For now, we'll serialize the multiple dates into a JSON field or just verify logic
                finalStartDate = new Date().toISOString(); // Placeholder logic
                finalEndDate = new Date().toISOString();
            }

            const { error } = await supabase.from('events').insert([{
                ...formData,
                start_date: finalStartDate,
                end_date: finalEndDate,
                // extra field for multiple dates if schema supports it, e.g. dates_json: formData.multiple_dates
            }]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Event created successfully!' });
            setTimeout(() => {
                console.log('Redirecting...');
            }, 2000);

        } catch (error: any) {
            console.error('Error creating event:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to create event.' });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all ${theme === 'dark'
            ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600'
            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
        }`;

    const labelClass = `block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`;
    const sectionClass = `p-6 rounded-xl border space-y-6 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`;

    return (
        <div className={`p-6 max-w-7xl mx-auto animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add {type === 'online' ? 'Online' : 'Venue'} Event</h2>
                    <div className="flex items-center gap-2 text-xs font-medium opacity-50 mt-2">
                        <span>Event Management</span>
                        <ChevronRight size={12} />
                        <span>Add Event</span>
                        <ChevronRight size={12} />
                        <span className="capitalize">{type}</span>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#2563eb] hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Event</>}
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Media Section */}
                    <div className={sectionClass}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                <ImageIcon size={20} className="text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Media</h3>
                                <p className="text-xs opacity-50">Upload event thumbnail and images.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Thumbnail Upload */}
                            <div>
                                <label className={labelClass}>Thumbnail Image (320x230) <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors aspect-video relative group overflow-hidden ${theme === 'dark' ? 'border-gray-700 hover:border-gray-500 bg-[#131922]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
                                >
                                    {formData.thumbnail ? (
                                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="opacity-50 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs opacity-50">Click to upload</span>
                                        </>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={thumbnailInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                                    />
                                </div>
                            </div>

                            {/* Poster Upload */}
                            <div>
                                <label className={labelClass}>Poster Image (Original)</label>
                                <div
                                    onClick={() => posterInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors aspect-video relative group overflow-hidden ${theme === 'dark' ? 'border-gray-700 hover:border-gray-500 bg-[#131922]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
                                >
                                    {formData.poster_image ? (
                                        <img src={formData.poster_image} alt="Poster" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="opacity-50 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs opacity-50">Click to upload</span>
                                        </>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={posterInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'poster_image')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time Section (Refined Layout) */}
                    <div className={sectionClass}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Clock size={20} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Date & Time</h3>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Date Type */}
                            <div>
                                <label className={labelClass}>Date Type <span className="text-red-500">*</span></label>
                                <div className={`grid grid-cols-2 p-1 rounded-lg border ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <button
                                        onClick={() => handleChange('date_type', 'single')}
                                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.date_type === 'single' ? 'bg-[#2563eb] text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        Single
                                    </button>
                                    <button
                                        onClick={() => handleChange('date_type', 'multiple')}
                                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.date_type === 'multiple' ? 'bg-[#2563eb] text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        Multiple
                                    </button>
                                </div>
                            </div>

                            {/* Countdown Status */}
                            <div>
                                <label className={labelClass}>Countdown Status <span className="text-red-500">*</span></label>
                                <div className={`grid grid-cols-2 p-1 rounded-lg border ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <button
                                        onClick={() => handleChange('countdown_status', 'active')}
                                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.countdown_status === 'active' ? 'bg-[#2563eb] text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => handleChange('countdown_status', 'deactive')}
                                        className={`py-2 text-sm font-medium rounded-md transition-all ${formData.countdown_status === 'deactive' ? 'bg-red-500 text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        Deactive
                                    </button>
                                </div>
                            </div>

                            {/* Date/Time Logic */}
                            {formData.date_type === 'single' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
                                            <input type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Start Time <span className="text-red-500">*</span></label>
                                            <input type="time" value={formData.start_time} onChange={(e) => handleChange('start_time', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>End Date <span className="text-red-500">*</span></label>
                                            <input type="date" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>End Time <span className="text-red-500">*</span></label>
                                            <input type="time" value={formData.end_time} onChange={(e) => handleChange('end_time', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Multiple Dates</h4>
                                        <button onClick={addDateRow} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1">
                                            <Plus size={12} /> Add Date
                                        </button>
                                    </div>
                                    {formData.multiple_dates.map((date, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 rounded-lg border bg-gray-50/50 dark:bg-white/5">
                                            <div>
                                                <label className={labelClass}>Start Date</label>
                                                <input type="date" value={date.start_date} onChange={(e) => handleDateRowChange(index, 'start_date', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Start Time</label>
                                                <input type="time" value={date.start_time} onChange={(e) => handleDateRowChange(index, 'start_time', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>End Date</label>
                                                <input type="date" value={date.end_date} onChange={(e) => handleDateRowChange(index, 'end_date', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>End Time</label>
                                                <input type="time" value={date.end_time} onChange={(e) => handleDateRowChange(index, 'end_time', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <button onClick={() => removeDateRow(index)} className="w-full py-2.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.multiple_dates.length === 0 && (
                                        <div className="text-center py-8 opacity-50 border-2 border-dashed rounded-lg">
                                            No dates added yet. Click "Add Date" to start.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organizer & Status */}
                    <div className={sectionClass}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Organizer</label>
                                <select
                                    value={formData.organizer}
                                    onChange={(e) => handleChange('organizer', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">Select Organizer</option>
                                    <option value="admin">Admin (Default)</option>
                                </select>
                                <p className="text-[10px] mt-1 opacity-50 text-orange-400">Please leave it blank for Admin's event</p>
                            </div>
                            <div>
                                <label className={labelClass}>Status <span className="text-red-500">*</span></label>
                                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className={inputClass}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Is Feature?</label>
                                <select value={formData.is_featured ? 'yes' : 'no'} onChange={(e) => handleChange('is_featured', e.target.value === 'yes')} className={inputClass}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Content (Language Support) */}
                    <div className={`${sectionClass} relative overflow-hidden`}>
                        <div className="bg-[#2563eb] text-white px-6 py-3 -mx-6 -mt-6 mb-6 flex items-center justify-between">
                            <span className="font-bold">English Language (Default)</span>
                            <Globe size={16} className="opacity-80" />
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Event Title <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter Event Name" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                                    <select value={formData.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className={inputClass}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Location (Venue Only) */}
                            {type === 'venue' && (
                                <EventLocation locationData={formData} onChange={handleLocationChange} />
                            )}

                            <div>
                                <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Enter detailed description..." className={`${inputClass} min-h-[200px]`} />
                            </div>

                            <div>
                                <label className={labelClass}>Refund Policy</label>
                                <textarea value={formData.refund_policy} onChange={(e) => handleChange('refund_policy', e.target.value)} placeholder="Enter Refund Policy" className={`${inputClass} min-h-[100px]`} />
                            </div>

                            <div>
                                <label className={labelClass}>Event Meta Keywords</label>
                                <input type="text" value={formData.meta_keywords} onChange={(e) => handleChange('meta_keywords', e.target.value)} placeholder="Enter Meta Keywords" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Event Meta Description</label>
                                <textarea value={formData.meta_description} onChange={(e) => handleChange('meta_description', e.target.value)} placeholder="Enter Meta Description" className={`${inputClass} min-h-[80px]`} />
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-700/50">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-transparent" id="clone" />
                                <label htmlFor="clone" className="text-xs opacity-70">Clone for other languages</label>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Language & Quick Actions (This could be sticky) */}
                <div className="space-y-6">
                    {/* Language Switcher Mockup */}
                    <div className={sectionClass}>
                        <h3 className="font-bold text-lg mb-4">Language</h3>
                        <div className="space-y-2">
                            <button className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between border transition-all ${activeLang === 'en' ? 'bg-[#2563eb]/10 border-[#2563eb] text-[#2563eb]' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                <span className="font-medium">English</span>
                                {activeLang === 'en' && <CheckCircle2 size={16} />}
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between border border-transparent opacity-50 cursor-not-allowed">
                                <span className="font-medium">Arabic</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddEvent;
