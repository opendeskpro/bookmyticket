
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const MobileBottomNav: React.FC = () => {
    const { config } = useSiteConfig();
    const location = useLocation();

    // Get mobile menu from config, fallback to empty array
    const menuItems = (config as any).mobile_menu || [];

    if (!menuItems.length) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151515]/90 backdrop-blur-xl border-t border-white/10 z-[100] pb-safe shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-around h-16">
                {menuItems.map((item: any, index: number) => {
                    const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
                    const isActive = location.pathname === item.url;

                    return (
                        <NavLink
                            key={index}
                            to={item.url}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-all duration-300 w-full ${isActive ? 'text-[#FBB040] drop-shadow-[0_0_10px_rgba(251,176,64,0.5)]' : 'text-gray-400 hover:text-white'
                                }`
                            }
                        >
                            <IconComponent
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? 'animate-in zoom-in duration-300' : ''}
                            />
                            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-[#FBB040]' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#FBB040] rounded-full shadow-[0_0_5px_rgba(251,176,64,0.8)]" />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
