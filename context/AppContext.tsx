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
  points: number;
  setPoints: (val: number) => void;
  userPromoCode: string;
  t: (key: string, options?: any) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [language, setLanguageState] = useState<Language>(i18n.language as Language || 'tr');
  const [currency, setCurrencyState] = useState<Currency>('TRY');
  const [points, setPoints] = useState(0);
  const [userPromoCode, setUserPromoCode] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const savedLang = await AsyncStorage.getItem('user_lang');
      const savedCur = await AsyncStorage.getItem('user_cur');
      const savedPoints = await AsyncStorage.getItem('@Tourkia_User_Points');
      const savedCode = await AsyncStorage.getItem('@Tourkia_User_PromoCode');

      if (savedLang) {
        setLanguageState(savedLang as Language);
        i18n.changeLanguage(savedLang);
      }
      if (savedCur) setCurrencyState(savedCur as Currency);
      if (savedPoints) setPoints(parseFloat(savedPoints));
      if (savedCode) setUserPromoCode(savedCode);
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

  const updatePoints = async (val: number) => {
    setPoints(val);
    await AsyncStorage.setItem('@Tourkia_User_Points', val.toString());
  };

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, 
      currency, setCurrency, 
      points, setPoints: updatePoints, 
      userPromoCode, t 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
