import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TypingBox } from './components/TypingBox';
import { ResultsCard } from './components/ResultsCard';
import { useTyping } from './hooks/useTyping';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TestMode, Difficulty, CodeLanguage } from './types/typing.types';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    
    // Persistent State
    const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
    
    // Test Config State
    const [mode, setMode] = React.useState<TestMode>('text');
    const [difficulty, setDifficulty] = React.useState<Difficulty>('easy');
    const [duration, setDuration] = React.useState(15);
    const [codeLanguage, setCodeLanguage] = React.useState<CodeLanguage>('javascript');

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
        progress,
        resetTest,
        skipTest,
        handleKey
    } = useTyping({ 
        duration, 
        mode, 
        difficulty, 
        lang: i18n.language,
        codeLanguage 
    });

    const prevLangRef = useRef(i18n.language);

    useEffect(() => {
        if (prevLangRef.current !== i18n.language) {
            prevLangRef.current = i18n.language;

            if (status !== 'finished') {
                resetTest(true); 
            }
        }
    }, [i18n.language, status, resetTest]);

    
    useEffect(() => {
        resetTest(false);
    }, [mode, difficulty, duration, codeLanguage]);

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
                            codeLanguage={codeLanguage} setCodeLanguage={setCodeLanguage}
                        />
                        <TypingBox 
                            text={text}
                            userInput={userInput}
                            timeLeft={timeLeft}
                            wpm={stats.wpm}
                            progress={progress}
                            onKeyPress={handleKey}
                            isFocused={true}
                            mode={mode}
                            onGenerateNew={skipTest}
                        />
                        <div className="hint-text">
                            {t('footer.hint')}
                        </div>
                    </>
                ) : (
                    <ResultsCard stats={stats} onRetry={() => resetTest(false)} />
                )}
            </main>
        </div>
    );
};

export default App;

