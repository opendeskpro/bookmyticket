import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, LogOut, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { UserRole } from '../../types';

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path?: string; // Path is optional for group headers
  children?: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  items: SidebarItem[];
  collapsed: boolean;
  toggleCollapse: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, role, items, collapsed, toggleCollapse, onLogout }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const renderNavItem = (item: SidebarItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;
    // Check if any child is active to auto-expand or highlight parent
    const isChildActive = item.children?.some(child => location.pathname.startsWith(child.path || ''));

    // Auto-expand if child is active (run once or effect? keeping simple for now)

    // Indentation based on depth
    const paddingLeft = collapsed ? '0px' : `${(depth * 12) + 12}px`;

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => !collapsed && toggleExpand(item.label)}
            className={`
              w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900
              ${isChildActive ? 'text-[#7c3aed] bg-[#f5f3ff]' : ''}
              ${collapsed ? 'justify-center' : ''}
            `}
            style={{ paddingLeft: collapsed ? undefined : paddingLeft }}
            title={collapsed ? item.label : undefined}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </div>
            {!collapsed && (
              <div className="text-gray-400">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </button>

          {/* Render Children */}
          {!collapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf node
    return (
      <NavLink
        key={item.path || item.label}
        to={item.path || '#'}
        className={({ isActive }) => `
          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors block
          ${isActive
            ? 'bg-[#f5f3ff] text-[#7c3aed]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        style={{ paddingLeft: collapsed ? undefined : paddingLeft }}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={20} />
        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-50">
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] bg-clip-text text-transparent">
                BookMyTicket
              </span>
            )}
            {/* Mobile Close */}
            <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
              <X size={20} />
            </button>
            {/* Desktop Collapse */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-transform"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
            {items.map((item) => renderNavItem(item))}
          </div>

          {/* Footer - Logout */}
          <div className="p-4 border-t border-gray-50">
            <button
              onClick={onLogout}
              className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors
              ${collapsed ? 'justify-center' : ''}
            `}>
              <LogOut size={20} />
              {!collapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
