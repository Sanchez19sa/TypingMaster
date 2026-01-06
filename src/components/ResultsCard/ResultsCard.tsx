import React, { useMemo } from 'react';
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
    const { i18n } = useTranslation();

    const translations = {
      en: {
        wpm: 'WPM',
        accuracy: 'Accuracy',
        testType: 'test type',
        consistency: 'Consistency',
        time: 'Time',
        correct: 'Correct Characters',
        incorrect: 'Incorrect Characters',
      },
      es: {
        wpm: 'PPM',
        accuracy: 'Precisión',
        testType: 'Tipo',
        consistency: 'Consistencia',
        time: 'Tiempo',
        correct: 'Caracteres correctos',
        incorrect: 'Caracteres incorrectos',
      }
    };

    // Get current language labels (fallback to en)
    const tLabels = translations[i18n.language as 'en' | 'es'] || translations.en;

    // Calculate consistency (Coefficient of Variation of WPM)
    const consistency = useMemo(() => {
        if (!stats.chartData || stats.chartData.length < 2) return 100;
        const wpms = stats.chartData.map(d => d.wpm);
        const mean = stats.wpm;
        if (mean === 0) return 0;
        
        const squareDiffs = wpms.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        // Consistency is inverse of variance (roughly) mapped to %
        const cv = stdDev / mean;
        const cons = 100 - (cv * 100);
        return Math.max(0, Math.min(100, Math.round(cons)));
    }, [stats.chartData, stats.wpm]);

    return (
        <div className="results-container fade-in">
            <div className="results-header">
                <div className="stat-group big">
                    <div className="stat-label">{tLabels.wpm}</div>
                    <div className="stat-value primary">{stats.wpm}</div>
                </div>
                <div className="stat-group big">
                    <div className="stat-label">{tLabels.accuracy}</div>
                    <div className="stat-value">{stats.accuracy}%</div>
                </div>
            </div>

            <div className="chart-wrapper">
                <Chart data={stats.chartData} averageWpm={stats.wpm} lang={i18n.language} />
            </div>

            <div className="results-details">
                <div className="stat-group small">
                    <div className="stat-label">{tLabels.testType}</div>
                    <div className="stat-value text-sub">{tLabels.time} {stats.chartData.length}s</div> 
                </div>
                
                <div className="stat-group small">
                    <div className="stat-label">{tLabels.correct}</div>
                    <div className="stat-value text-main">{stats.correctChars}</div>
                </div>

                <div className="stat-group small">
                    <div className="stat-label">{tLabels.incorrect}</div>
                    <div className="stat-value error">{stats.incorrectChars}</div>
                </div>

                <div className="stat-group small">
                    <div className="stat-label">{tLabels.consistency}</div>
                    <div className="stat-value">{consistency}%</div>
                </div>
            </div>

            <div className="results-actions">
                <Button variant="icon" onClick={onRetry} className="action-btn" title="Restart Test">
                    ⟳
                </Button>
            </div>
        </div>
    );
};

export default ResultsCard;
