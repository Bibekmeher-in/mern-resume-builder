import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nBackend from 'i18next-http-backend';

i18n
    .use(i18nBackend)
    .use(initReactI18next)
    .init({

        backend: {

            loadPath: '/locales/{{lng}}/translation.json',
        },

        // Add fallback and supported languages
        fallbackLng: "en",
        supportedLngs: ['en', 'hi', 'od', 'or'],
        ns: ['translation'],
        defaultNS: 'translation',

        debug: true,

        interpolation: {
            escapeValue: false
        },

    });

export default i18n;