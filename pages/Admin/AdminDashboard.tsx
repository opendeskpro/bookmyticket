import React from 'react';
import { Event } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const chartData = [
  { name: 'Jan', value: -1.0 },
  { name: 'Feb', value: -0.8 },
  { name: 'Mar', value: -0.6 },
  { name: 'Apr', value: -0.4 },
  { name: 'May', value: -0.2 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

const AdminDashboard: React.FC<{ events: Event[] }> = () => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="space-y-8">
          {/* Top Row: Monthly Income & Monthly Event Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[400px]">
            {/* Monthly Income Chart */}
            <div className={`p-8 rounded-[2rem] border shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} domain={[-1, 1]} ticks={[-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#131922' : '#fff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#3A86FF', fontSize: '10px', fontWeight: 900 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3A86FF" strokeWidth={3} dot={{ fill: '#3A86FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto pt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-2.5 rounded-sm border border-[#3A86FF]" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Monthly Income</span>
                </div>
              </div>
            </div>

            {/* Monthly Event Bookings Chart */}
            <div className={`p-8 rounded-[2rem] border shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} domain={[-1, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#131922' : '#fff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#7209B7', fontSize: '10px', fontWeight: 900 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#7209B7" strokeWidth={3} dot={{ fill: '#7209B7', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto pt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-2.5 rounded-sm border border-[#7209B7]" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Monthly Event Bookings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Product Order Monthly Income & Monthly Product Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[500px]">
            <div className={`p-10 rounded-[2.5rem] border shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xl font-bold mb-10 tracking-tight">Product Order Monthly Income (2026)</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.map(d => ({ ...d, value: 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} domain={[-1, 1]} />
                    <Line type="monotone" dataKey="value" stroke="#38B000" strokeWidth={3} dot={{ fill: 'white', stroke: '#38B000', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-sm border border-[#38B000] flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[#38B000]/20" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Monthly Income</span>
                </div>
              </div>
            </div>

            <div className={`p-10 rounded-[2.5rem] border shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xl font-bold mb-10 tracking-tight">Monthly Product Orders (2026)</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.map(d => ({ ...d, value: 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} domain={[-1, 1]} />
                    <Line type="monotone" dataKey="value" stroke="#FFB703" strokeWidth={3} dot={{ fill: 'white', stroke: '#FFB703', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-sm border border-[#FFB703] flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[#FFB703]/20" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Monthly Product Order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
