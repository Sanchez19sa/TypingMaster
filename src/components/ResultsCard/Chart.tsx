import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ReferenceLine,
  Label
} from 'recharts';
import type { ChartPoint } from '../../types/typing.types';

interface ChartProps {
  data: ChartPoint[];
  averageWpm: number;
  lang: string;
}

const translations = {
  en: {
    word: "Word",
    time: "Time",
    wpm: "WPM",
    raw: "Raw",
    errors: "Errors",
    axisTime: "time (s)",
    axisWpm: "words per minute",
    axisError: "errors"
  },
  es: {
    word: "Palabra",
    time: "Tiempo",
    wpm: "PPM",
    raw: "Bruto",
    errors: "Errores",
    axisTime: "tiempo (s)",
    axisWpm: "palabras por minuto",
    axisError: "errores"
  }
};

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    const wpmData = payload.find((p: any) => p.dataKey === 'wpm');
    const rawData = payload.find((p: any) => p.dataKey === 'raw');
    const errorData = payload.find((p: any) => p.dataKey === 'error');
    const wordNumber = payload[0]?.payload?.wordNumber;
    const totalWords = payload[0]?.payload?.totalWords;

    return (
      <div className="custom-tooltip" style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.5rem',
        border: '1px solid var(--primary-color)',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        {wordNumber !== undefined && totalWords && (
            <p style={{ 
                color: 'var(--primary-color)', 
                fontWeight: 'bold', 
                fontSize: '0.9rem',
                marginBottom: '0.2rem'
            }}>
                {t.word}: {wordNumber}/{totalWords}
            </p>
        )}
        <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>
            {t.time}: {label}s
        </p>
        {wpmData && (
            <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                {t.wpm}: {wpmData.value}
            </p>
        )}
        {rawData && (
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                {t.raw}: {rawData.value}
            </p>
        )}
        {errorData && errorData.value > 0 && (
           <p style={{ color: 'var(--error-color)', fontSize: '0.9rem' }}>
            {t.errors}: {errorData.value}
           </p>
        )}
      </div>
    );
  }
  return null;
};

const Chart: React.FC<ChartProps> = ({ data, averageWpm, lang }) => {
  if (!data || data.length < 1) return null;

  const t = translations[lang as 'en' | 'es'] || translations.en;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }} className="fade-in">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
          
          <XAxis 
            dataKey="time" 
            stroke="var(--text-sub)" 
            tick={{ fill: 'var(--text-sub)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          >
            <Label value={t.axisTime} position="insideBottom" offset={-10} fill="var(--text-sub)" fontSize={12} />
          </XAxis>
          
          <YAxis 
            yAxisId="left" 
            stroke="var(--text-sub)" 
            tick={{ fill: 'var(--text-sub)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          >
             <Label value={t.axisWpm} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="var(--text-sub)" fontSize={12} dx={-10} />
          </YAxis>

          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="var(--error-color)" 
            tick={{ fill: 'var(--error-color)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            dataKey="error"
          >
            <Label value={t.axisError} angle={90} position="insideRight" style={{ textAnchor: 'middle' }} fill="var(--error-color)" fontSize={12} dx={10} />
          </YAxis>

          <Tooltip 
            content={<CustomTooltip t={t} />} 
            cursor={{ stroke: 'var(--text-sub)', strokeWidth: 1, opacity: 0.2 }} 
          />
          
          <ReferenceLine y={averageWpm} yAxisId="left" stroke="var(--text-sub)" strokeDasharray="3 3" opacity={0.5} />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wpm"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--primary-color)' }}
            animationDuration={1500}
            isAnimationActive={true}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="raw"
            stroke="var(--text-sub)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            opacity={0.5}
            animationDuration={1500}
            isAnimationActive={true}
          />
          <Scatter 
            yAxisId="right" 
            dataKey="error" 
            fill="var(--error-color)" 
            shape={(props: any) => {
                const { cx, cy, payload } = props;
                // Return empty group instead of null to satisfy Typescript/Recharts
                if (payload.error === 0) return <g />;
                return (
                    <text x={cx} y={cy} dy={4} textAnchor="middle" fill="var(--error-color)" fontSize={14} fontWeight="bold">×</text>
                );
            }}
            animationDuration={1500}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

