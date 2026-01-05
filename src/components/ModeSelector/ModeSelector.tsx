import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TestMode, Difficulty, CodeLanguage } from '../../types/typing.types';
import { DURATIONS } from '../../utils/constants';
import './ModeSelector.css';

interface ModeSelectorProps {
    mode: TestMode;
    setMode: (m: TestMode) => void;
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    duration: number;
    setDuration: (d: number) => void;
    codeLanguage: CodeLanguage;
    setCodeLanguage: (l: CodeLanguage) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
    mode, setMode,
    difficulty, setDifficulty,
    duration, setDuration,
    codeLanguage, setCodeLanguage
}) => {
    const { t } = useTranslation();

    return (
        <div className="mode-selector">
            <div className="mode-selector__row">
                <div className="mode-selector__group">
                    <button 
                        className={`mode-selector__btn ${mode === 'text' ? 'active' : ''}`}
                        onClick={() => setMode('text')}
                    >
                        {t('modes.text')}
                    </button>
                    <button 
                        className={`mode-selector__btn ${mode === 'code' ? 'active' : ''}`}
                        onClick={() => setMode('code')}
                    >
                        {t('modes.code')}
                    </button>
                </div>

                <div className="mode-selector__divider"></div>

                <div className="mode-selector__group">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            className={`mode-selector__btn ${difficulty === d ? 'active' : ''}`}
                            onClick={() => setDifficulty(d)}
                        >
                            {t(`difficulty.${d}`)}
                        </button>
                    ))}
                </div>

                <div className="mode-selector__divider"></div>

                <div className="mode-selector__group">
                    {DURATIONS.map(d => (
                        <button
                            key={d}
                            className={`mode-selector__btn ${duration === d ? 'active' : ''}`}
                            onClick={() => setDuration(d)}
                        >
                            {d}s
                        </button>
                    ))}
                </div>
            </div>

            {mode === 'code' && (
                <div className="mode-selector__row code-languages fade-in-slide">
                    <div className="mode-selector__group">
                        {(['javascript', 'python', 'typescript'] as CodeLanguage[]).map(lang => (
                            <button
                                key={lang}
                                className={`mode-selector__btn ${codeLanguage === lang ? 'active' : ''}`}
                                onClick={() => setCodeLanguage(lang)}
                            >
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModeSelector;

