import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import zh from '../locales/zh.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
  ru: { translation: ru },
  zh: { translation: zh },
};

const supportedLanguages = ['tr', 'en', 'ru', 'zh'];
const locales = Localization.getLocales();
let initialLanguage = 'en'; // Default fallback

if (locales && locales.length > 0) {
  const deviceLanguage = locales[0].languageCode;
  
  // Casus Modu: Match device language if supported
  if (deviceLanguage && supportedLanguages.includes(deviceLanguage)) {
    initialLanguage = deviceLanguage;
    console.log(`[Casus Modu] Detected supported language: ${deviceLanguage}`);
  } else {
    console.log(`[Casus Modu] Unsupported language (${deviceLanguage}), falling back to 'en'`);
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
