import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Translations ---
export const translations = {
  tr: {
    welcome: 'Hoş Geldiniz',
    search_placeholder: 'Nereye gitmek istersiniz?',
    popular_routes: 'POPÜLER ROTALAR',
    tours: 'TURLAR',
    explore: 'Keşfet',
    tickets: 'Biletler',
    profile: 'Profil',
    home: 'Ana Sayfa',
    lezzet: 'Lezzet',
    combo_deals: 'Efsane Kombolar',
    combo_subtitle: 'Daha az öde, daha çok gez!',
    recommended_tours: 'Sizin için önerilen turlar',
    all_rights: 'Tüm hakları saklıdır',
    settings: 'Ayarlar',
    logout: 'Oturumu Kapat',
    language: 'Dil',
    currency: 'Para Birimi',
    adults: 'Yetişkin',
    children: 'Çocuk',
    discover_tours: 'Turları Keşfet',
  },
  en: {
    welcome: 'Welcome',
    search_placeholder: 'Where do you want to go?',
    popular_routes: 'POPULAR ROUTES',
    tours: 'TOURS',
    explore: 'Explore',
    tickets: 'Tickets',
    profile: 'Profile',
    home: 'Home',
    lezzet: 'Taste',
    combo_deals: 'Legendary Combos',
    combo_subtitle: 'Pay less, travel more!',
    recommended_tours: 'Recommended for you',
    all_rights: 'All rights reserved',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language',
    currency: 'Currency',
    adults: 'Adult',
    children: 'Child',
    discover_tours: 'Discover Tours',
  }
};

type Language = 'tr' | 'en';
type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  t: (key: keyof typeof translations.tr) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');
  const [currency, setCurrencyState] = useState<Currency>('TRY');

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await AsyncStorage.getItem('user_lang');
      const savedCur = await AsyncStorage.getItem('user_cur');
      if (savedLang) setLanguageState(savedLang as Language);
      if (savedCur) setCurrencyState(savedCur as Currency);
    };
    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('user_lang', lang);
  };

  const setCurrency = async (cur: Currency) => {
    setCurrencyState(cur);
    await AsyncStorage.setItem('user_cur', cur);
  };

  const t = (key: keyof typeof translations.tr) => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
