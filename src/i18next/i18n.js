import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslation from '../locales/ar/ar.json';
import enTranslation from '../locales/en/en.json'

const language = localStorage.getItem('language')
i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enTranslation,
		},
		ar: {
			translation: arTranslation,
		},
	},
	fallbackLng:language? language: 'ar', // Set 'ar' as the default language
	interpolation: {
		escapeValue: false,
	},
	lng: language? language: 'ar', // Set 'ar' as the initial language
});

export default i18n;
