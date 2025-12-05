import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TypingBox } from './components/TypingBox';
import { ResultsCard } from './components/ResultsCard';
import { useTyping } from './hooks/useTyping';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TestMode, Difficulty } from './types/typing.types';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    
    // Persistent State
    const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
    // Language is managed by i18next and LanguageToggle

    // Test Config State
    const [mode, setMode] = React.useState<TestMode>('text');
    const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
    const [duration, setDuration] = React.useState(30);

    // Apply Theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const {
        text,
        userInput,
        status,
        timeLeft,
        stats,
        resetTest,
        handleKey
    } = useTyping({ 
        duration, 
        mode, 
        difficulty, 
        lang: i18n.language 
    });

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="app-container">
            <Header toggleTheme={toggleTheme} currentTheme={theme} />
            
            <main className="main-content">
                {status !== 'finished' ? (
                    <>
                        <ModeSelector 
                            mode={mode} setMode={setMode}
                            difficulty={difficulty} setDifficulty={setDifficulty}
                            duration={duration} setDuration={setDuration}
                        />
                        <TypingBox 
                            text={text}
                            userInput={userInput}
                            timeLeft={timeLeft}
                            wpm={stats.wpm}
                            onKeyPress={handleKey}
                            isFocused={true}
                            mode={mode}
                        />
                        <div className="hint-text">
                            {t('footer.hint')}
                        </div>
                    </>
                ) : (
                    <ResultsCard stats={stats} onRetry={resetTest} />
                )}
            </main>
        </div>
    );
};

export default App;

