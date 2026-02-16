import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MenuItem {
    id: string;
    label: string;
    url: string;
    target: '_self' | '_blank';
    parentId: string | null;
    order: number;
    type: 'custom' | 'page' | 'category';
}

const MenuBuilder: React.FC = () => {
    const { theme } = useTheme();
    const [websiteMenus, setWebsiteMenus] = useState<MenuItem[]>([]);
    const [deletedMenuIds, setDeletedMenuIds] = useState<string[]>([]);
    const [menuForm, setMenuForm] = useState<{ label: string; url: string; target: '_self' | '_blank' }>({ label: '', url: '', target: '_self' });
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .order('order_index', { ascending: true });

        if (data) {
            const mapped: MenuItem[] = data.map((item: any) => ({
                id: item.id,
                label: item.label,
                url: item.url,
                target: item.target,
                parentId: item.parent_id,
                order: item.order_index,
                type: item.type
            }));
            setWebsiteMenus(mapped);
        }
    };

    const builtInMenus = [
        { text: 'Home', url: '/' },
        { text: 'Events', url: '/' },
        { text: 'Organizers', url: '/#organizers' },
        { text: 'Shop', url: '/shop' },
        { text: 'Cart', url: '/cart' },
        { text: 'Blog', url: '/blog' },
        { text: 'Contact', url: '/contact' },
        { text: 'About Us', url: '/about' },
        { text: 'Privacy Policy', url: '/refund-policy', isCustom: true },
        { text: 'Terms & Conditions', url: '/terms-and-conditions', isCustom: true },
    ];

    const handleAddToMenus = (item: any) => {
        const rootItems = websiteMenus.filter(m => !m.parentId);
        const maxOrder = rootItems.length > 0 ? Math.max(...rootItems.map(m => m.order)) : -1;

        const newItem: MenuItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: item.text,
            url: item.url,
            target: '_self',
            parentId: null,
            order: maxOrder + 1,
            type: item.isCustom ? 'page' : 'custom'
        };
        setWebsiteMenus([...websiteMenus, newItem]);
    };

    const handleAddOrUpdateMenu = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMenuId) {
            setWebsiteMenus(websiteMenus.map(m => m.id === editingMenuId ? { ...m, label: menuForm.label, url: menuForm.url, target: menuForm.target } : m));
            setEditingMenuId(null);
        } else {
            const rootItems = websiteMenus.filter(m => !m.parentId);
            const maxOrder = rootItems.length > 0 ? Math.max(...rootItems.map(m => m.order)) : -1;

            const newItem: MenuItem = {
                id: Math.random().toString(36).substr(2, 9),
                label: menuForm.label,
                url: menuForm.url,
                target: menuForm.target,
                parentId: null,
                order: maxOrder + 1,
                type: 'custom'
            };
            setWebsiteMenus([...websiteMenus, newItem]);
        }
        setMenuForm({ label: '', url: '', target: '_self' });
    };

    const getSiblings = (parentId: string | null) => {
        return websiteMenus.filter(m => m.parentId === parentId).sort((a, b) => a.order - b.order);
    };

    const moveMenu = (id: string, direction: 'up' | 'down') => {
        const menu = websiteMenus.find(m => m.id === id);
        if (!menu) return;

        const siblings = getSiblings(menu.parentId);
        const index = siblings.findIndex(m => m.id === id);

        if (direction === 'up' && index > 0) {
            const prev = siblings[index - 1];
            const newMenus = websiteMenus.map(m => {
                if (m.id === menu.id) return { ...m, order: prev.order };
                if (m.id === prev.id) return { ...m, order: menu.order };
                return m;
            });
            setWebsiteMenus(newMenus);
        } else if (direction === 'down' && index < siblings.length - 1) {
            const next = siblings[index + 1];
            const newMenus = websiteMenus.map(m => {
                if (m.id === menu.id) return { ...m, order: next.order };
                if (m.id === next.id) return { ...m, order: menu.order };
                return m;
            });
            setWebsiteMenus(newMenus);
        }
    };

    const indentMenu = (id: string) => {
        const menu = websiteMenus.find(m => m.id === id);
        if (!menu) return;

        const siblings = getSiblings(menu.parentId);
        const index = siblings.findIndex(m => m.id === id);

        if (index > 0) {
            const prev = siblings[index - 1];
            const newSiblings = getSiblings(prev.id);
            const maxOrder = newSiblings.length > 0 ? Math.max(...newSiblings.map(m => m.order)) : -1;

            const newMenus = websiteMenus.map(m =>
                m.id === id ? { ...m, parentId: prev.id, order: maxOrder + 1 } : m
            );
            setWebsiteMenus(newMenus);
        }
    };

    const outdentMenu = (id: string) => {
        const menu = websiteMenus.find(m => m.id === id);
        if (!menu || !menu.parentId) return;

        const currentParent = websiteMenus.find(m => m.id === menu.parentId);
        if (!currentParent) return;

        const grandParentId = currentParent.parentId;
        const parentSiblings = getSiblings(grandParentId);
        const parentIndex = parentSiblings.findIndex(m => m.id === currentParent.id);

        const itemsToShift = parentSiblings.slice(parentIndex + 1);

        let newMenus = [...websiteMenus];
        itemsToShift.forEach(item => {
            newMenus = newMenus.map(m => m.id === item.id ? { ...m, order: m.order + 1 } : m);
        });

        newMenus = newMenus.map(m => m.id === id ? { ...m, parentId: grandParentId, order: currentParent.order + 1 } : m);
        setWebsiteMenus(newMenus);
    };

    const deleteMenu = (id: string) => {
        const idsToDelete = [id];
        const findChildren = (pid: string) => {
            websiteMenus.filter(m => m.parentId === pid).forEach(child => {
                idsToDelete.push(child.id);
                findChildren(child.id);
            });
        };
        findChildren(id);
        setDeletedMenuIds([...deletedMenuIds, ...idsToDelete.filter(did => !String(did).includes('-'))]);
        setWebsiteMenus(websiteMenus.filter(m => !idsToDelete.includes(m.id)));
    };

    const startEditMenu = (menu: MenuItem) => {
        setEditingMenuId(menu.id);
        setMenuForm({ label: menu.label, url: menu.url, target: menu.target });
    };

    const handleSaveMenus = async () => {
        setIsSaving(true);
        try {
            if (deletedMenuIds.length > 0) {
                await supabase.from('menus').delete().in('id', deletedMenuIds);
                setDeletedMenuIds([]);
            }
            const updates = websiteMenus.map(m => ({
                id: m.id,
                label: m.label,
                url: m.url,
                type: m.type,
                parent_id: m.parentId,
                order_index: m.order,
                target: m.target
            }));
            const { error } = await supabase.from('menus').upsert(updates);
            if (error) throw error;
            alert('Menus updated successfully!');
            fetchMenus();
        } catch (err) {
            console.error("Error saving menus:", err);
            alert('Failed to save menus.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderMenuItems = (parentId: string | null = null, depth = 0) => {
        const items = getSiblings(parentId);
        if (items.length === 0) return null;

        return (
            <div className={`space-y-2 ${depth > 0 ? 'ml-8' : ''}`}>
                {items.map((menu) => (
                    <div key={menu.id}>
                        <div className={`${theme === 'dark' ? 'bg-[#0f172a] border-gray-800 hover:border-gray-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'} border rounded-sm p-3 flex items-center justify-between group transition-all`}>
                            <div className="flex items-center gap-4">
                                {menu.type === 'page' || menu.id.length > 0 ? (
                                    <div className="w-6 h-6 bg-[#10b981] rounded-sm flex items-center justify-center shadow-lg">
                                        <Plus size={12} className="text-white" />
                                    </div>
                                ) : null}
                                <div className="flex flex-col">
                                    <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{menu.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <button type="button" onClick={() => moveMenu(menu.id, 'up')} className="w-7 h-7 bg-[#6366f1] rounded-sm flex items-center justify-center text-white hover:bg-[#4f46e5] transition-colors"><ChevronDown size={14} className="rotate-180" /></button>
                                <button type="button" onClick={() => moveMenu(menu.id, 'down')} className="w-7 h-7 bg-[#6366f1] rounded-sm flex items-center justify-center text-white hover:bg-[#4f46e5] transition-colors"><ChevronDown size={14} /></button>
                                <button type="button" onClick={() => outdentMenu(menu.id)} disabled={!menu.parentId} className="w-7 h-7 bg-[#8b5cf6] rounded-sm flex items-center justify-center text-white hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={14} className="rotate-180" /></button>
                                <button type="button" onClick={() => indentMenu(menu.id)} className="w-7 h-7 bg-[#8b5cf6] rounded-sm flex items-center justify-center text-white hover:bg-[#7c3aed] transition-colors"><ChevronRight size={14} /></button>
                                <button type="button" onClick={() => startEditMenu(menu)} className="w-7 h-7 bg-[#2563eb] rounded-sm flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-sm ml-1"><Edit2 size={12} /></button>
                                <button type="button" onClick={() => deleteMenu(menu.id)} className="w-7 h-7 bg-[#ef4444] rounded-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm"><Trash2 size={12} /></button>
                            </div>
                        </div>
                        {renderMenuItems(menu.id, depth + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-6 animate-in fade-in duration-700">
            {/* Column 1 */}
            <div className="flex flex-col h-full overflow-hidden">
                <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700/50' : 'bg-white border-slate-200'} border rounded-none shadow-xl transition-colors`}>
                    <div className="bg-[#2563eb] px-6 py-4 flex-shrink-0 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Built-In Menus</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {builtInMenus.map((item, idx) => (
                            <div key={idx} className={`flex items-center justify-between px-4 py-3 ${theme === 'dark' ? 'bg-[#131922] border-gray-800' : 'bg-slate-50 border-slate-200'} border rounded-md hover:border-blue-500/50 transition-colors group`}>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{item.text}</span>
                                    {item.isCustom && <span className="text-[10px] px-2 py-0.5 bg-[#FFB703] text-black rounded-sm font-bold uppercase">Custom</span>}
                                </div>
                                <button onClick={() => handleAddToMenus(item)} className="bg-[#2563eb] text-white text-[11px] font-medium px-4 py-2 rounded-sm hover:bg-blue-500 transition-all shadow-md">Add</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col h-full overflow-hidden">
                <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700/50' : 'bg-white border-slate-200'} border rounded-none shadow-xl transition-colors`}>
                    <div className="bg-[#2563eb] px-6 py-4 flex-shrink-0">
                        <h3 className="text-sm font-semibold text-white">{editingMenuId ? 'Edit Menu' : 'Add/Edit Menu'}</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <form onSubmit={handleAddOrUpdateMenu} className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Text</label>
                                <input type="text" placeholder="Enter Menu Name" className={`w-full ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'} border rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none transition-all`} value={menuForm.label} onChange={(e) => setMenuForm({ ...menuForm, label: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>URL</label>
                                <input type="text" placeholder="Enter Menu URL" className={`w-full ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'} border rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none transition-all`} value={menuForm.url} onChange={(e) => setMenuForm({ ...menuForm, url: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Target</label>
                                <div className="relative">
                                    <select className={`w-full ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none transition-all appearance-none`} value={menuForm.target} onChange={(e) => setMenuForm({ ...menuForm, target: e.target.value as any })}>
                                        <option value="_self">Self</option>
                                        <option value="_blank">Blank</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="bg-[#2563eb] text-white px-6 py-2.5 rounded-sm font-medium text-xs flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg"><Plus size={14} /> {editingMenuId ? 'Update' : 'Add'}</button>
                                {editingMenuId && <button type="button" onClick={() => { setEditingMenuId(null); setMenuForm({ label: '', url: '', target: '_self' }); }} className="bg-[#22c55e] text-white px-6 py-2.5 rounded-sm font-medium text-xs hover:bg-green-500 transition-all shadow-lg">Update</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col h-full overflow-hidden">
                <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700/50' : 'bg-white border-slate-200'} border rounded-none shadow-xl transition-colors`}>
                    <div className="bg-[#2563eb] px-6 py-4 flex-shrink-0 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Website Menus</h3>
                        <button onClick={handleSaveMenus} disabled={isSaving} className="bg-white text-[#2563eb] text-[10px] font-bold uppercase px-3 py-1.5 rounded-sm hover:bg-gray-100 transition-all disabled:opacity-50">{isSaving ? 'Saving...' : 'Update Menu'}</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                        {websiteMenus.length === 0 ? <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} text-sm font-medium`}>NO MENU ITEMS ADDED.</div> : renderMenuItems(null)}
                    </div>
                    <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700/30 bg-[#1e2736]' : 'border-slate-100 bg-white'} flex-shrink-0`}>
                        <button onClick={handleSaveMenus} disabled={isSaving} className="w-full bg-[#10b981] text-white py-3 rounded-sm font-bold uppercase text-xs tracking-wide hover:bg-[#059669] transition-all shadow-lg disabled:opacity-50">{isSaving ? 'Saving Changes...' : 'Save Menu Structure'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuBuilder;
