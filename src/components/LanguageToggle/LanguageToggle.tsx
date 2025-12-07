import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const [_, setLang] = useLocalStorage('language', 'en');

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLang(lng);
    };

    return (
        <div className="lang-toggle">
            <button 
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} 
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <span className="lang-sep">/</span>
            <button 
                className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`} 
                onClick={() => changeLanguage('es')}
            >
                ES
            </button>
        </div>
    );
};

export default LanguageToggle;

