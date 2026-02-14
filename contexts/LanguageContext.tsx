import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = {
    code: string;
    name: string;
    flag: string;
    isRTL: boolean;
};

const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', isRTL: false },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', isRTL: false },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳', isRTL: false },
    { code: 'te', name: 'Telugu', flag: '🇮🇳', isRTL: false },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳', isRTL: false },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳', isRTL: false },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳', isRTL: false },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳', isRTL: false },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳', isRTL: false },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳', isRTL: false },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', isRTL: false },
    { code: 'fr', name: 'French', flag: '🇫🇷', isRTL: false },
    { code: 'de', name: 'German', flag: '🇩🇪', isRTL: false },
];

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (code: string) => void;
    languages: Language[];
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
    en: {
        'dashboard': 'Dashboard',
        'all_events': 'All Events',
        'venue_events': 'Venue Events',
        'online_events': 'Online Events',
        'add_event': 'Add Event',
        'organiser_portal': 'Organizer Portal',
        'welcome_back': 'Welcome back',
        'save': 'Save',
        'back': 'Back',
        'event_title': 'Event Title',
        'category': 'Category',
        'address': 'Address',
        'show_map': 'Show Map',
        'city': 'City',
        'zip': 'Zip/Post Code',
        'country': 'Country',
        'description': 'Description',
        'all_bookings': 'All Bookings',
        'withdraw': 'Withdraw',
        'transactions': 'Transactions',
        'pwa_scanner': 'PWA Scanner',
        'all_tickets': 'All Tickets',
        'logout': 'Logout',
        'gallery_images': 'Gallery Images',
        'thumbnail_image': 'Thumbnail Image',
        'date_type': 'Date Type',
        'countdown_status': 'Countdown Status',
        'start_date': 'Start Date',
        'start_time': 'Start Time',
        'end_date': 'End Date',
        'end_time': 'End Time',
        'status': 'Status',
        'is_feature': 'Is Feature',
    },
    hi: {
        'dashboard': 'डैशबोर्ड',
        'all_events': 'सभी कार्यक्रम',
        'venue_events': 'स्थान कार्यक्रम',
        'online_events': 'ऑनलाइन कार्यक्रम',
        'add_event': 'कार्यक्रम जोड़ें',
        'organiser_portal': 'आयोजक पोर्टल',
        'welcome_back': 'वापसी पर स्वागत है',
        'save': 'सहेजें',
        'back': 'पीछे',
        'event_title': 'कार्यक्रम का शीर्षक',
        'category': 'श्रेणी',
        'address': 'पता',
        'show_map': 'नक्शा दिखाएं',
        'city': 'शहर',
        'state': 'राज्य',
        'district': 'ज़िला',
        'zip': 'ज़िप/डाक कोड',
        'country': 'देश',
        'description': 'विवरण',
        'all_bookings': 'सभी बुकिंग',
        'withdraw': 'निकालें',
        'transactions': 'लेन-देन',
        'pwa_scanner': 'पीडब्ल्यूए स्कैनर',
        'all_tickets': 'सभी टिकट',
        'logout': 'लॉग आउट',
        'gallery_images': 'गैलरी चित्र',
        'thumbnail_image': 'थंबनेल चित्र',
        'date_type': 'तारीख का प्रकार',
        'countdown_status': 'काउंटडाउन स्थिति',
        'start_date': 'प्रारंभ तिथि',
        'start_time': 'प्रारंभ समय',
        'end_date': 'अंतिम तिथि',
        'end_time': 'अंतिम समय',
        'status': 'स्थिति',
        'is_feature': 'विशेष रुप से प्रदर्शित',
    },
    // In a real app, other languages would have their own maps here
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

    const setLanguage = (code: string) => {
        const lang = languages.find(l => l.code === code);
        if (lang) {
            setCurrentLanguage(lang);
            document.dir = lang.isRTL ? 'rtl' : 'ltr';
        }
    };

    const t = (key: string) => {
        return translations[currentLanguage.code]?.[key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
