import React from 'react';
import './Header.css';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../LanguageToggle';

interface HeaderProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
    const { t } = useTranslation();

    return (
        <header className="header">
            <div className="header__logo">
                <span className="header__icon">⌨</span>
                <h1>{t('title')}</h1>
            </div>
            <div className="header__controls">
                <LanguageToggle />
                <button 
                    className="header__btn" 
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {currentTheme === 'dark' ? '☀' : '☾'}
                </button>
            </div>
        </header>
    );
};

export default Header;

