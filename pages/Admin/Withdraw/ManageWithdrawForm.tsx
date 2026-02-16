import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    ChevronDown, Filter, Info, ArrowLeft,
    Type, Hash, Calendar, Clock, AlignLeft, CheckSquare,
    Save, GripVertical
} from 'lucide-react';

interface FormField {
    id: string;
    type: 'Text' | 'Number' | 'Select' | 'Checkbox' | 'Textarea' | 'Datepicker' | 'Timepicker';
    label: string;
    placeholder: string;
    required: boolean;
}

const ManageWithdrawForm: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock existing fields
    const [fields, setFields] = useState<FormField[]>([
        { id: '1', type: 'Text', label: 'Bank Name', placeholder: 'Enter your bank name', required: true },
        { id: '2', type: 'Text', label: 'Account Holder', placeholder: 'Full name on account', required: true },
        { id: '3', type: 'Number', label: 'Account Number', placeholder: '0000 0000 0000', required: true },
    ]);

    const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

    const handleAddField = (type: FormField['type']) => {
        const newField: FormField = {
            id: Date.now().toString(),
            type,
            label: `New ${type} Field`,
            placeholder: `Enter ${type.toLowerCase()}...`,
            required: false
        };
        setFields([...fields, newField]);
        setIsAddFieldOpen(false);
    };

    const handleRemoveField = (fieldId: string) => {
        setFields(fields.filter(f => f.id !== fieldId));
    };

    const handleToggleRequired = (fieldId: string) => {
        setFields(fields.map(f =>
            f.id === fieldId ? { ...f, required: !f.required } : f
        ));
    };

    const fieldIcons = {
        Text: <Type size={16} />,
        Number: <Hash size={16} />,
        Select: <ChevronDown size={16} />,
        Checkbox: <CheckSquare size={16} />,
        Textarea: <AlignLeft size={16} />,
        Datepicker: <Calendar size={16} />,
        Timepicker: <Clock size={16} />
    };

    return (
        <div className={`p-8 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {/* Header */}
            <div className="flex items-center gap-6 mb-10">
                <button
                    onClick={() => navigate('/admin/withdraw/payment-methods')}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm'
                        }`}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Manage Form Builder</h2>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        Configure data mutation fields for Method ID: <span className="text-[#38bdf8]">{id}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Elements Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6 italic">Field Artifacts</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {(Object.keys(fieldIcons) as Array<FormField['type']>).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleAddField(type)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all group italic ${theme === 'dark'
                                            ? 'bg-white/5 border-white/5 text-white/40 hover:bg-[#38bdf8] hover:text-white hover:border-[#38bdf8]'
                                            : 'bg-white border-slate-100 text-slate-500 hover:bg-[#38bdf8] hover:text-white hover:border-[#38bdf8]'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        {fieldIcons[type]}
                                    </div>
                                    {type} Field
                                    <Plus size={14} className="ml-auto opacity-20 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Preview Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`rounded-[3rem] border p-10 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] italic">Form Structure Matrix</h4>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Live serialization of custom fields</p>
                            </div>
                            <button className="px-8 py-3 bg-[#38bdf8] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#38bdf8] transition-all shadow-xl shadow-[#38bdf8]/20 flex items-center gap-2 italic active:scale-95">
                                <Save size={16} /> Save Configuration
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-white/10">
                                    <Plus size={32} />
                                </div>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Zero fields detected. Add fields from the left terminal.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field) => (
                                    <div
                                        key={field.id}
                                        className={`group relative p-6 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="cursor-grab active:cursor-grabbing text-white/10 hover:text-white/40 transition-colors mt-1">
                                                <GripVertical size={20} />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-black/40 text-[#38bdf8]' : 'bg-white text-[#38bdf8] shadow-sm'}`}>
                                                        {field.type}
                                                    </span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                    <button
                                                        onClick={() => handleToggleRequired(field.id)}
                                                        className={`text-[9px] font-black uppercase tracking-widest transition-colors ${field.required ? 'text-[#FF006E]' : 'text-white/20 hover:text-white/40'}`}
                                                    >
                                                        {field.required ? 'Required [ACTIVE]' : 'Set Required'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveField(field.id)}
                                                        className="text-white/10 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Field Label</label>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => {
                                                                const newFields = [...fields];
                                                                const idx = newFields.findIndex(f => f.id === field.id);
                                                                newFields[idx].label = e.target.value;
                                                                setFields(newFields);
                                                            }}
                                                            className={`w-full px-4 py-3 rounded-xl border text-[11px] font-black italic outline-none focus:border-[#38bdf8] transition-all uppercase ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white placeholder:text-white/10' : 'bg-white border-slate-100 shadow-sm'
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Placeholder</label>
                                                        <input
                                                            type="text"
                                                            value={field.placeholder}
                                                            onChange={(e) => {
                                                                const newFields = [...fields];
                                                                const idx = newFields.findIndex(f => f.id === field.id);
                                                                newFields[idx].placeholder = e.target.value;
                                                                setFields(newFields);
                                                            }}
                                                            className={`w-full px-4 py-3 rounded-xl border text-[11px] font-black italic outline-none focus:border-[#38bdf8] transition-all uppercase ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white placeholder:text-white/10' : 'bg-white border-slate-100 shadow-sm'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageWithdrawForm;
