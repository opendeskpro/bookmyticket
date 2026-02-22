import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteConfig, updateSiteConfig as updateSupabaseConfig } from '../lib/supabase';

// Define types for each section
export interface HeroConfig {
    title1: string;
    title2: string; // Gradient part
    subtitle: string;
    searchPlaceholder: string;
    bgVideo: string; // URL or YouTube embed
    stats: { label: string; value: string }[];
}

export interface SpotlightConfig {
    visible: boolean;
    title: string;
    subtitle: string;
    eventId: string; // The ID of the event to spotlight
    image: string; // Override image if needed
}

export interface CitiesConfig {
    visible: boolean;
    title: string;
    subtitle: string;
}

export interface OrganizersConfig {
    visible: boolean;
    title: string;
    subtitle: string;
}

export interface WhyBookItem {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name
    color: string; // e.g., "bg-purple-100 text-purple-600"
}

export interface WhyBookWithUsConfig {
    visible: boolean;
    title: string;
    subtitle: string;
    items: WhyBookItem[];
    image: string;
}

export interface AppDownloadConfig {
    visible: boolean;
    title1: string;
    title2: string;
    subtitle: string;
    image: string;
}

export interface FooterLink {
    label: string;
    url: string;
}

export interface FooterSection {
    title: string;
    links: FooterLink[];
}

export interface FooterConfig {
    visible: boolean;
    aboutText: string;
    socialLinks: { facebook: string; twitter: string; instagram: string; linkedin: string };
    sections: FooterSection[];
    copyrightText: string;
}

export interface MovieApiConfig {
    client: string;
    apiKey: string;
    authorization: string;
    territory: string;
    apiVersion: string;
}

export interface SiteConfig {
    hero: HeroConfig;
    spotlight: SpotlightConfig;
    cities: CitiesConfig;
    organizers: OrganizersConfig;
    whyBookWithUs: WhyBookWithUsConfig;
    appDownload: AppDownloadConfig;
    footer: FooterConfig;
    brand?: { logo_url: string; site_name: string };
    enable_movies_page?: boolean;
    movieApi?: MovieApiConfig;
    mobile_menu?: { label: string; icon: string; url: string }[];
}

const DEFAULT_CONFIG: SiteConfig = {
    hero: {
        title1: 'Discover Your Next',
        title2: 'Unforgettable Experience',
        subtitle: 'Explore concerts, shows, nightlife, and exclusive experiences happening around you.',
        searchPlaceholder: 'Search events, concerts, shows...',
        bgVideo: 'https://www.youtube.com/embed/XeaAT-wTLuM?autoplay=1&mute=1&loop=1&playlist=XeaAT-wTLuM&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1',
        stats: [
            { label: 'Concert', value: '' },
            { label: 'Sports', value: '' },
            { label: 'Musics', value: '' },
            { label: 'Live Shows', value: '' },
            { label: 'Comedy Show', value: '' }
        ]
    },
    spotlight: {
        visible: true,
        title: 'Spotlight 🎯',
        subtitle: "Handpicked experiences and standout events you won't want to miss!",
        eventId: '1', // Default ID
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200'
    },
    cities: {
        visible: true,
        title: 'Popular Cities 📍',
        subtitle: 'Upcoming events in the trending destinations!'
    },
    organizers: {
        visible: true,
        title: 'Featured Organizers 🌟',
        subtitle: 'Discover events from our trusted organizers worldwide'
    },
    whyBookWithUs: {
        visible: true,
        title: 'Why Book with BookMyTicket? 🎟️',
        subtitle: 'We make your booking experience smooth, secure, and hassle-free.',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1000',
        items: [
            { id: '1', title: 'Curated Events for You', description: "Discover handpicked experiences, tailored to your interests and city.", icon: 'Sparkles', color: 'bg-purple-100 text-purple-600' },
            { id: '2', title: 'Safe & Secure Checkout', description: 'Fast, encrypted payments with top-grade security—your transactions are safe.', icon: 'ShieldCheck', color: 'bg-blue-100 text-blue-600' },
            { id: '3', title: 'Instant Confirmation', description: 'Get your tickets instantly via email & app – no waiting, no worries.', icon: 'Zap', color: 'bg-emerald-100 text-emerald-600' },
        ]
    },
    appDownload: {
        visible: true,
        title1: 'JOIN OUR',
        title2: 'NEWSLETTER! 📬',
        subtitle: "We get it — spam is no one's friend! That's why our newsletter is different. Pure value, zero clutter.",
        image: '/newsletter_illustration_premium.png'
    },
    footer: {
        visible: true,
        aboutText: "BookMyTicket is India's premier high-end event discovery portal. We bridge the gap between imagination and live experience.",
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#'
        },
        sections: [
            {
                title: 'Marketplace',
                links: [
                    { label: 'All Events', url: '#' },
                    { label: 'Concerts', url: '#' },
                    { label: 'Comedy Shows', url: '#' },
                    { label: 'Workshops', url: '#' },
                    { label: 'Free Events', url: '#' }
                ]
            },
            {
                title: 'Support',
                links: [
                    { label: 'Help Center', url: '#' },
                    { label: 'Privacy Policy', url: '#' },
                    { label: 'Terms of Use', url: '#' },
                    { label: 'Refund Policy', url: '#' },
                    { label: 'Contact Us', url: '#' }
                ]
            }
        ],
        copyrightText: "© 2026 bookmyticket. all rights reserved."
    },
    enable_movies_page: true,
    movieApi: {
        client: 'NEXV',
        apiKey: 'VOKzV5AuIh9wz2Ni36Zd1aCcMEABhfMk5dtC6NKM',
        authorization: 'Basic TkVYVjpKVENmV292Nkh4WjM=',
        territory: 'IN',
        apiVersion: 'v201'
    },
    mobile_menu: [
        { label: "Home", icon: "Home", url: "/" },
        { label: "Search", icon: "Search", url: "/events" },
        { label: "Bookings", icon: "Ticket", url: "/my-tickets" },
        { label: "Wallet", icon: "Wallet", url: "/organizer/wallet" },
        { label: "Profile", icon: "User", url: "/profile" }
    ]
};

interface SiteConfigContextType {
    config: SiteConfig;
    updateConfig: (section: keyof SiteConfig, data: Partial<any>) => Promise<void>;
    resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Fetch all config sections
                const [
                    savedConfig,
                    settingsConfig,
                    brandAssets,
                    footerLinks,
                    mobileMenu,
                    movieApi
                ] = await Promise.all([
                    getSiteConfig('homepage'),
                    getSiteConfig('settings'),
                    getSiteConfig('brand_assets'),
                    getSiteConfig('footer_links'),
                    getSiteConfig('mobile_menu'),
                    getSiteConfig('movie_api')
                ]);

                let newConfig = { ...DEFAULT_CONFIG };

                if (savedConfig) newConfig = { ...newConfig, ...savedConfig };
                if (settingsConfig) newConfig = { ...newConfig, ...settingsConfig };

                // Map Brand Assets
                if (brandAssets) {
                    newConfig.brand = brandAssets;
                }

                // Map Movie API
                if (movieApi) {
                    newConfig.movieApi = movieApi;
                }

                // Map Mobile Menu
                if (mobileMenu && Array.isArray(mobileMenu) && mobileMenu.length > 0) {
                    (newConfig as any).mobile_menu = mobileMenu;
                }

                // Map Footer Links
                if (footerLinks) {
                    newConfig.footer = {
                        ...newConfig.footer,
                        socialLinks: footerLinks.social_links?.reduce((acc: any, link: any) => {
                            acc[link.platform.toLowerCase()] = link.url;
                            return acc;
                        }, {}) || newConfig.footer.socialLinks,
                        sections: footerLinks.columns?.map((col: any) => ({
                            title: col.title,
                            links: col.links
                        })) || newConfig.footer.sections,
                        // Store full footer config for components that can use it (like top_links)
                        raw: footerLinks
                    } as any;
                }

                setConfig(newConfig);
            } catch (e) {
                console.error("Failed to fetch site config", e);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const updateConfig = async (section: keyof SiteConfig, data: Partial<any>) => {
        const isPrimitive = typeof config[section] !== 'object' || config[section] === null;
        const newSectionConfig = isPrimitive ? data : { ...config[section], ...data };
        const newConfig = {
            ...config,
            [section]: newSectionConfig
        };

        // Optimistic update
        setConfig(newConfig);

        try {
            // Map the context section to the Supabase section key
            const sectionMap: Record<string, string> = {
                hero: 'homepage',
                spotlight: 'homepage',
                cities: 'homepage',
                organizers: 'homepage',
                whyBookWithUs: 'homepage',
                appDownload: 'homepage',
                footer: 'footer_links',
                brand: 'brand_assets',
                enable_movies_page: 'settings',
                movieApi: 'movie_api',
                mobile_menu: 'mobile_menu'
            };

            const supabaseKey = sectionMap[section] || 'homepage';

            // If it's a settings field, we might need to fetch the whole settings object first 
            // but for simplicity we upsert based on the section map
            if (supabaseKey === 'settings') {
                const currentSettings = await getSiteConfig('settings') || {};
                await updateSupabaseConfig('settings', { ...currentSettings, [section]: data });
            } else {
                await updateSupabaseConfig(supabaseKey, newConfig[section]);
            }
        } catch (error) {
            console.error(`Failed to save config section ${section} to Supabase`, error);
        }
    };

    const resetConfig = async () => {
        setConfig(DEFAULT_CONFIG);
        try {
            await updateSupabaseConfig('homepage', DEFAULT_CONFIG);
        } catch (error) {
            console.error("Failed to reset config in Supabase", error);
        }
    };

    return (
        <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {!loading && children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (context === undefined) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};
