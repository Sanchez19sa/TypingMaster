import React, { useRef, useEffect } from 'react';
import { WordDisplay } from '../WordDisplay';
import { CodeSnippet } from '../CodeSnippet';
import { Timer } from '../Timer';
import type { TestMode } from '../../types/typing.types';
import './TypingBox.css';

interface TypingBoxProps {
    text: string;
    userInput: string;
    timeLeft: number;
    wpm: number;
    progress: { current: number; total: number };
    onKeyPress: (key: string) => void;
    isFocused: boolean;
    mode: TestMode;
    onGenerateNew?: () => void;
}

const TypingBox: React.FC<TypingBoxProps> = ({ 
    text, userInput, timeLeft, wpm, progress, onKeyPress, isFocused, mode, onGenerateNew 
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            // If input is not focused, focus it
            if (document.activeElement !== inputRef.current) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused, userInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length > 0) {
             const char = val.slice(-1);
             onKeyPress(char);
        }
        e.target.value = '';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onKeyPress('Enter');
        }
    };

    const handleBoxClick = () => {
        inputRef.current?.focus();
    };

    const showRefresh = userInput.length === 0;

    return (
        <div className="typing-container">
            <div className="typing-header">
                <Timer timeLeft={timeLeft} progress={progress} />
                <div className="typing-wpm">{wpm} WPM</div>
            </div>

            <div className="typing-area">
                {mode === 'code' ? (
                    <CodeSnippet code={text} userInput={userInput} onClick={handleBoxClick} />
                ) : (
                    <WordDisplay text={text} userInput={userInput} onClick={handleBoxClick} />
                )}
            </div>

            {/* Changed conditional rendering to class-based visibility to reserve space */}
            <div className={`refresh-container ${!showRefresh ? 'hidden' : ''}`}>
                {onGenerateNew && (
                    <button 
                        className="refresh-btn" 
                        onClick={onGenerateNew} 
                        title="Generate new text"
                        aria-label="Generate new text"
                        tabIndex={!showRefresh ? -1 : 0}
                    >
                        🔄
                    </button>
                )}
            </div>

            <input 
                ref={inputRef}
                type="text" 
                className="typing-input" 
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />
        </div>
    );
};

export default TypingBox;