import React from 'react';
import type { TestStats } from '../../types/typing.types';
import { useTranslation } from 'react-i18next';
import Chart from './Chart';
import { Button } from '../Button';
import './ResultsCard.css';

interface ResultsCardProps {
    stats: TestStats;
    onRetry: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ stats, onRetry }) => {
    const { t } = useTranslation();

    return (
        <div className="results-card fade-in">
            <h2 className="results-title">{t('results.title')}</h2>
            
            <div className="results-grid">
                <div className="result-big">
                    <span className="label">WPM</span>
                    <span className="value">{stats.wpm}</span>
                </div>
                <div className="result-big">
                    <span className="label">{t('stats.acc')}</span>
                    <span className="value">{stats.accuracy}%</span>
                </div>
            </div>

            <div className="chart-container">
                <Chart data={stats.chartData} />
                <p className="chart-label">WPM over time</p>
            </div>

            <div className="result-details">
                <div className="detail-item">
                    <span>Correct</span>
                    <span className="val-correct">{stats.correctChars}</span>
                </div>
                <div className="detail-item">
                    <span>Incorrect</span>
                    <span className="val-error">{stats.incorrectChars}</span>
                </div>
            </div>

            <Button variant="icon" onClick={onRetry} autoFocus className="retry-btn">
                ⟳
            </Button>
        </div>
    );
};

export default ResultsCard;

