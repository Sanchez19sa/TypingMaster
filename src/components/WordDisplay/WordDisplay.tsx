import React, { useRef, useEffect } from 'react';
import './WordDisplay.css';

interface WordDisplayProps {
    text: string;
    userInput: string;
    onClick: () => void;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ text, userInput, onClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    // Calculate cursor position
    useEffect(() => {
        if (!containerRef.current || !cursorRef.current) return;
        const activeChar = containerRef.current.querySelector('.char.active');
        const containerRect = containerRef.current.getBoundingClientRect();

        if (activeChar) {
            const rect = (activeChar as HTMLElement).getBoundingClientRect();
            cursorRef.current.style.transform = `translate(${rect.left - containerRect.left}px, ${rect.top - containerRect.top}px)`;
            cursorRef.current.style.opacity = '1';
        } else if (userInput.length === text.length) {
            // End of text
             const lastChar = containerRef.current.lastElementChild;
             if(lastChar) {
                const rect = (lastChar as HTMLElement).getBoundingClientRect();
                 cursorRef.current.style.transform = `translate(${rect.right - containerRect.left}px, ${rect.top - containerRect.top}px)`;
             }
        }
    }, [userInput, text]);

    return (
        <div className="word-display" ref={containerRef} onClick={onClick}>
            <span ref={cursorRef} className="cursor" />
            {text.split('').map((char, index) => {
                let className = 'char';
                if (index < userInput.length) {
                    className += userInput[index] === char ? ' correct' : ' error';
                } else if (index === userInput.length) {
                    className += ' active';
                }
                return (
                    <span key={index} className={className}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

export default WordDisplay;

