import React from 'react';
import { useTranslation } from 'react-i18next';
import './Timer.css';

interface TimerProps {
    timeLeft: number;
    progress?: { current: number; total: number };
}

const Timer: React.FC<TimerProps> = ({ timeLeft, progress }) => {
    const { t } = useTranslation();
    return (
        <div className="timer-container">
            <div className="timer">
                {timeLeft}s
            </div>
            {progress && (
                <div className="word-count">
                    {progress.current} / {progress.total} {t('stats.words')}
                </div>
            )}
        </div>
    );
};

export default Timer;

