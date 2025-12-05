import React from 'react';
import type { ChartPoint } from '../../types/results.types';

interface ChartProps {
    data: ChartPoint[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
    if (data.length < 2) return null;
        
    const width = 600;
    const height = 200;
    const padding = 20;

    const maxWpm = Math.max(...data.map(d => d.wpm), 60);
    const maxTime = data[data.length - 1].time;

    // Avoid division by zero
    const scaleX = maxTime > 0 ? (width - padding * 2) / maxTime : 0;
    const scaleY = maxWpm > 0 ? (height - padding * 2) / maxWpm : 0;

    const points = data.map(d => {
        const x = d.time * scaleX + padding;
        const y = height - (d.wpm * scaleY) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="result-chart">
            <polyline 
                fill="none" 
                stroke="var(--primary-color)" 
                strokeWidth="3" 
                points={points} 
            />
            {/* Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--text-sub)" opacity="0.5"/>
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--text-sub)" opacity="0.5"/>
        </svg>
    );
};

export default Chart;

