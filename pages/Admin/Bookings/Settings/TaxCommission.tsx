import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Save, Percent, DollarSign } from 'lucide-react';

const TaxCommission: React.FC = () => {
    const { theme } = useTheme();
    const [tax, setTax] = useState('12');
    const [commission, setCommission] = useState('10');

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Tax & Commission</h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Configure global tax and platform commission rates.
                </p>
            </div>

            <div className={`p-8 rounded-xl border max-w-2xl ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-base font-bold flex items-center gap-2">
                            Tax Rate (%)
                        </label>
                        <div className="relative">
                            <Percent className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={18} />
                            <input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-lg font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            />
                        </div>
                        <p className="text-sm text-slate-500">
                            This percentage will be added to the ticket price as tax.
                        </p>
                    </div>

                    <div className="w-full h-px bg-slate-200 dark:bg-gray-700"></div>

                    <div className="space-y-4">
                        <label className="text-base font-bold flex items-center gap-2">
                            Commission Rate (%)
                        </label>
                        <div className="relative">
                            <Percent className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={18} />
                            <input
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-lg font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            />
                        </div>
                        <p className="text-sm text-slate-500">
                            Platform commission deducted from the organizer's earnings.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                            <Save size={20} /> Update Rates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCommission;
