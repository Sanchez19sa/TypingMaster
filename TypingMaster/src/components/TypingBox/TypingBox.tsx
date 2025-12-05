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
    onKeyPress: (key: string) => void;
    isFocused: boolean;
    mode: TestMode;
}

const TypingBox: React.FC<TypingBoxProps> = ({ 
    text, userInput, timeLeft, wpm, onKeyPress, isFocused, mode 
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep focus
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

    const handleBoxClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="typing-container">
            <div className="typing-header">
                <Timer timeLeft={timeLeft} />
                <div className="typing-wpm">{wpm} WPM</div>
            </div>

            <div className="typing-area">
                {mode === 'code' ? (
                    <CodeSnippet code={text} userInput={userInput} onClick={handleBoxClick} />
                ) : (
                    <WordDisplay text={text} userInput={userInput} onClick={handleBoxClick} />
                )}
            </div>

            <input 
                ref={inputRef}
                type="text" 
                className="typing-input" 
                onChange={handleChange}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />
        </div>
    );
};

export default TypingBox;

