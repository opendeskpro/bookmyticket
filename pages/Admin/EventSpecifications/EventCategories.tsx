import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../../contexts/ThemeContext';
import { Plus, Search, Edit2, Trash2, X, Upload, Check, AlertCircle } from 'lucide-react';

interface EventCategory {
    id: string;
    name: string;
    image: string | null;
    status: 'active' | 'inactive';
    is_featured: boolean;
    serial_number: number;
}

const EventCategories: React.FC = () => {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        image: string | null;
        status: 'active' | 'inactive';
        is_featured: boolean;
        serial_number: number;
    }>({
        name: '',
        image: null,
        status: 'active',
        is_featured: false,
        serial_number: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('event_categories')
                .select('*')
                .order('serial_number', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('event_categories')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('event_categories')
                    .insert([formData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchCategories();
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            const { error } = await supabase
                .from('event_categories')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            image: null,
            status: 'active',
            is_featured: false,
            serial_number: categories.length + 1
        });
    };

    const openEditModal = (category: EventCategory) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            image: category.image,
            status: category.status,
            is_featured: category.is_featured,
            serial_number: category.serial_number
        });
        setIsModalOpen(true);
    };

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Event Categories</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Manage your event categories and their visibility.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#2563eb] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Filter Bar */}
            <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row gap-4 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all ${theme === 'dark'
                                ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600'
                                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                            }`}
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase font-bold border-b ${theme === 'dark' ? 'bg-[#131922] text-gray-400 border-gray-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            <tr>
                                <th className="px-6 py-4">Serial</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Featured</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/10">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No categories found.</td></tr>
                            ) : (
                                categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                                    <tr key={category.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-[#131922]/50 border-gray-700' : 'hover:bg-slate-50/80 border-slate-100'}`}>
                                        <td className="px-6 py-4 font-mono text-xs opacity-60">#{category.serial_number}</td>
                                        <td className="px-6 py-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                                                {category.image ? (
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload size={16} className="opacity-20" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{category.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${category.status === 'active'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${category.is_featured ? 'bg-[#2563eb]' : 'bg-gray-600'}`}>
                                                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${category.is_featured ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-white">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="w-8 h-8 rounded-lg bg-[#3A86FF] flex items-center justify-center hover:bg-[#2563eb] transition-colors shadow-lg shadow-blue-500/20"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="w-8 h-8 rounded-lg bg-[#ef4444] flex items-center justify-center hover:bg-[#dc2626] transition-colors shadow-lg shadow-red-500/20"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-[#1e2736] border border-white/10' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700 bg-[#131922]' : 'border-slate-100 bg-slate-50'}`}>
                            <h3 className="font-bold text-lg">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Image Upload Placeholder */}
                            <div className="flex justify-center">
                                <div className={`w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-600 hover:border-[#2563eb] bg-[#131922]' : 'border-slate-300 hover:border-blue-500 bg-slate-50'}`}>
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload size={24} className="mx-auto mb-2 opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg border outline-none text-sm transition-all focus:ring-2 focus:ring-[#2563eb] ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}
                                    placeholder="e.g. Music Festival"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-70">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                        className={`w-full px-4 py-3 rounded-lg border outline-none text-sm appearance-none ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-70">Serial Number</label>
                                    <input
                                        type="number"
                                        value={formData.serial_number}
                                        onChange={e => setFormData({ ...formData, serial_number: parseInt(e.target.value) })}
                                        className={`w-full px-4 py-3 rounded-lg border outline-none text-sm transition-all focus:ring-2 focus:ring-[#2563eb] ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-600/50">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-600 text-[#2563eb] focus:ring-[#2563eb]"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer select-none">Mark as Featured Category</label>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={`py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="py-3 rounded-lg font-bold text-sm uppercase tracking-wide bg-[#2563eb] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    {editingId ? 'Update Changes' : 'Create Category'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCategories;
