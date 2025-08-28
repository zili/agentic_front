import { useState, useEffect } from 'react';
import { getTranslation, type Translations } from '../i18n/translations';

export const useTranslation = () => {
  const [language, setLanguage] = useState<string>(() => {
    // Récupérer la langue depuis localStorage ou utiliser FR par défaut
    return localStorage.getItem('language') || 'FR';
  });

  const [translations, setTranslations] = useState<Translations>(() => {
    return getTranslation(language);
  });

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    setTranslations(getTranslation(newLanguage));
  };

  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  const t = (key: keyof Translations): string => {
    return translations[key] || key;
  };

  return {
    language,
    changeLanguage,
    t,
    translations,
    isRTL: language === 'AR' // Pour gérer le sens de lecture de l'arabe
  };
};
