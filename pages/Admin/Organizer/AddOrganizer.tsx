import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Save, Upload, User, Mail, Phone, Lock, Hash, MapPin, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';

const AddOrganizer: React.FC = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        designation: '',
        country: '',
        city: '',
        state: '',
        zipCode: '',
        address: '',
        details: '',
        facebook: '',
        twitter: '',
        linkedin: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement submission logic
        console.log('Form submitted', formData);
        alert('Organizer added successfully! (Mock)');
    };

    return (
        <div className={`p-6 md:p-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add Organizer</h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                            Create a new organizer profile manually.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image Upload */}
                    <div className="space-y-8">
                        <div className={`p-8 rounded-[2rem] border shadow-xl flex flex-col items-center gap-6 ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                            <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center relative overflow-hidden group hover:border-[#3A86FF] transition-colors cursor-pointer">
                                <Upload className="text-gray-400 group-hover:text-[#3A86FF] transition-colors" size={32} />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Upload</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold mb-1">Profile Image</h3>
                                <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                                    Recommended size 300x300px.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className={`p-8 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>

                            {/* Credentials Section */}
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#3A86FF] rounded-full"></span>
                                Credentials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="text" name="username" value={formData.username} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter username" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter email address" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter phone number" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter password" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Confirm password" />
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#3A86FF] rounded-full"></span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full py-3 px-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter full name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Designation</label>
                                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={`w-full py-3 px-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="e.g. Event Manager" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="text" name="country" value={formData.country} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter country" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter city" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleChange} className={`w-full py-3 px-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter state" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Zip Code</label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter zip code" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full py-3 px-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Enter street address" />
                            </div>

                            <div className="space-y-2 mb-10">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Details</label>
                                <textarea name="details" rows={4} value={formData.details} onChange={handleChange} className={`w-full p-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="Bio or details..." />
                            </div>

                            {/* Social Links */}
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#3A86FF] rounded-full"></span>
                                Social Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Facebook</label>
                                    <div className="relative">
                                        <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="URL" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Twitter</label>
                                    <div className="relative">
                                        <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="URL" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">LinkedIn</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF]' : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF]'}`} placeholder="URL" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#3A86FF] hover:bg-[#2f6cdb] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save Organizer
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrganizer;
