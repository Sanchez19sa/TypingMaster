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
        wpm: 'wpm',
        accuracy: 'acc',
        testType: 'test type',
        raw: 'raw',
        characters: 'characters',
        words: 'words',
        consistency: 'consistency',
        time: 'time',
        correct: 'correct',
        incorrect: 'incorrect'
      },
      es: {
        wpm: 'ppm',
        accuracy: 'precisión',
        testType: 'tipo de prueba',
        raw: 'bruto',
        characters: 'caracteres',
        words: 'palabras',
        consistency: 'consistencia',
        time: 'tiempo',
        correct: 'correctas',
        incorrect: 'incorrectas'
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
                    <div className="stat-label">{tLabels.raw}</div>
                    <div className="stat-value primary">{stats.rawWpm}</div>
                </div>
                <div className="stat-group small">
                    <div className="stat-label">{tLabels.characters}</div>
                    <div className="stat-value" title="correct/incorrect/missing/extra">
                        <span className="text-main">{stats.correctChars}</span>/
                        <span className="error">{stats.incorrectChars}</span>/
                        <span className="text-sub">0</span>/
                        <span className="text-sub">0</span>
                    </div>
                </div>
                 <div className="stat-group small">
                    <div className="stat-label">{tLabels.words}</div>
                    <div className="stat-value" title={`${tLabels.correct}/${tLabels.incorrect}`}>
                        <span className="text-main">{stats.correctWords}</span>/
                        <span className="error">{stats.incorrectWords}</span>
                    </div>
                </div>
                <div className="stat-group small">
                    <div className="stat-label">{tLabels.consistency}</div>
                    <div className="stat-value">{consistency}%</div>
                </div>
            </div>

            <div className="results-actions">
                <Button variant="icon" onClick={onRetry} autoFocus className="action-btn" title="Restart Test">
                    ⟳
                </Button>
            </div>
        </div>
    );
};

export default ResultsCard;

