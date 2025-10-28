import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '', buttonClass = '', activeClass = '', inactiveClass = '' }) => {
    const { i18n } = useTranslation();

    const languages = [
        { code: "en", label: "EN" },
        { code: "hi", label: "हिंदी" },
        { code: "od", label: "ଓଡ଼ିଆ" },
    ];

    const defaultButtonStyle = 'px-2 py-1 rounded-lg text-sm transition-colors duration-200';
    const defaultActiveStyle = 'bg-violet-100 text-violet-600 font-semibold';
    const defaultInactiveStyle = 'text-gray-500 hover:bg-gray-100/50';

    return (
        <div className={`flex items-center gap-1 bg-gray-50/70 p-1 rounded-xl border border-gray-100 overflow-x-auto scrollbar-hide ${className}`}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`${buttonClass || defaultButtonStyle} ${i18n.language === lang.code ? (activeClass || defaultActiveStyle) : (inactiveClass || defaultInactiveStyle)} whitespace-nowrap`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
