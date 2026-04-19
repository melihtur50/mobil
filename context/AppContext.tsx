import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from '@/services/i18n';
import { useTranslation } from 'react-i18next';

type Language = 'tr' | 'en' | 'ru' | 'zh';
type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  t: (key: string, options?: any) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [language, setLanguageState] = useState<Language>(i18n.language as Language || 'tr');
  const [currency, setCurrencyState] = useState<Currency>('TRY');

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await AsyncStorage.getItem('user_lang');
      const savedCur = await AsyncStorage.getItem('user_cur');
      if (savedLang) {
        setLanguageState(savedLang as Language);
        i18n.changeLanguage(savedLang);
      }
      if (savedCur) setCurrencyState(savedCur as Currency);
    };
    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user_lang', lang);
  };

  const setCurrency = async (cur: Currency) => {
    setCurrencyState(cur);
    await AsyncStorage.setItem('user_cur', cur);
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
