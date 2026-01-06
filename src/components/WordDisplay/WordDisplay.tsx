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

    useEffect(() => {
        if (!containerRef.current || !cursorRef.current) return;
        
        const activeChar = containerRef.current.querySelector('.char.active');
        const container = containerRef.current;
        
        if (activeChar) {
            const el = activeChar as HTMLElement;

            cursorRef.current.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
            cursorRef.current.style.opacity = '1';

            const cursorTop = el.offsetTop;
            const cursorHeight = el.offsetHeight;
            const containerHeight = container.clientHeight;
            const scrollTop = container.scrollTop;
            const targetScroll = cursorTop - (containerHeight / 2) + (cursorHeight / 2);
            const buffer = containerHeight * 0.3;
            
            const isBelow = cursorTop > (scrollTop + containerHeight - buffer);
            const isAbove = cursorTop < (scrollTop + buffer);

            if (isBelow || isAbove) {
                container.scrollTo({
                    top: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
            }

        } else if (userInput.length === text.length) {
             const lastChar = containerRef.current.lastElementChild as HTMLElement;
             if(lastChar && !lastChar.classList.contains('cursor')) {
                 cursorRef.current.style.transform = `translate(${lastChar.offsetLeft + lastChar.offsetWidth}px, ${lastChar.offsetTop}px)`;

                 container.scrollTo({
                     top: container.scrollHeight,
                     behavior: 'smooth'
                 });
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