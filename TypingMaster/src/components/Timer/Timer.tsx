import React from 'react';
import './Timer.css';

interface TimerProps {
    timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
    return (
        <div className="timer">
            {timeLeft}s
        </div>
    );
};

export default Timer;

