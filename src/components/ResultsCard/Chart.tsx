import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ReferenceLine,
} from 'recharts';
import type { ChartPoint } from '../../types/typing.types';

interface ChartProps {
  data: ChartPoint[];
  averageWpm: number;
  lang: string;
  /** Altura fija del chart; evita depender de padres con height: 100% */
  height?: number;
}

type Lang = 'en' | 'es';

const translations = {
  en: { word: 'Word', time: 'Time', wpm: 'WPM', raw: 'Raw', errors: 'Errors' },
  es: { word: 'Palabra', time: 'Tiempo', wpm: 'PPM', raw: 'Bruto', errors: 'Errores' },
} satisfies Record<Lang, Record<string, string>>;

type TooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: any;
  t: (typeof translations)[Lang];
};

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label, t }) => {
  if (!active || !payload?.length) return null;

  const wpmData = payload.find((p: any) => p.dataKey === 'wpm');
  const rawData = payload.find((p: any) => p.dataKey === 'raw');
  const errorData = payload.find((p: any) => p.dataKey === 'error');
  const wordNumber = payload[0]?.payload?.wordNumber;
  const totalWords = payload[0]?.payload?.totalWords;

  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.5rem',
        border: '1px solid var(--primary-color)',
        borderRadius: 4,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        zIndex: 100,
      }}
    >
      {wordNumber !== undefined && totalWords ? (
        <p
          style={{
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            marginBottom: '0.2rem',
          }}
        >
          {t.word}: {wordNumber}/{totalWords}
        </p>
      ) : null}

      <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>
        {t.time}: {label}s
      </p>

      {wpmData ? (
        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          {t.wpm}: {wpmData.value}
        </p>
      ) : null}

      {rawData ? (
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
          {t.raw}: {rawData.value}
        </p>
      ) : null}

      {errorData?.value > 0 ? (
        <p style={{ color: 'var(--error-color)', fontSize: '0.9rem' }}>
          {t.errors}: {errorData.value}
        </p>
      ) : null}
    </div>
  );
};

function clampPositiveInt(n: number) {
  const v = Math.floor(n);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

const Chart: React.FC<ChartProps> = ({ data, averageWpm, lang, height = 250 }) => {
  const t = (translations as any)[lang] ?? translations.en;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const next = clampPositiveInt(el.clientWidth);
      setWidth(next);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const chartWidth = width;
  const chartHeight = clampPositiveInt(height);

  const canRender = data?.length > 0 && chartWidth > 0 && chartHeight > 0;

  const errorShape = useCallback((props: any) => {
    const { cx, cy, payload } = props;
    if (!payload || payload.error === 0) return <g />;
    return (
      <text
        x={cx}
        y={cy}
        dy={3}
        textAnchor="middle"
        fill="var(--error-color)"
        fontSize={12}
        fontWeight="bold"
      >
        ×
      </text>
    );
  }, []);

  // Tooltip component instance estable (evita remounts)
  const tooltipContent = useMemo(() => <CustomTooltip t={t} />, [t]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: chartHeight,
        minHeight: chartHeight,
        // Importante en layouts flex: evita que el item colapse raro
        minWidth: 0,
      }}
    >
      {!canRender ? null : (
        <ComposedChart
          width={chartWidth}
          height={chartHeight}
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />

          <XAxis
            dataKey="time"
            stroke="var(--text-sub)"
            tick={{ fill: 'var(--text-sub)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            dy={10}
            interval="preserveStartEnd"
          />

          <YAxis
            yAxisId="left"
            stroke="var(--text-sub)"
            tick={{ fill: 'var(--text-sub)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            width={40}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--error-color)"
            tick={{ fill: 'var(--error-color)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            dataKey="error"
            width={30}
          />

          <Tooltip
            content={tooltipContent}
            cursor={{ stroke: 'var(--text-sub)', strokeWidth: 1, opacity: 0.2 }}
            isAnimationActive={false}
          />

          <ReferenceLine
            y={averageWpm}
            yAxisId="left"
            stroke="var(--text-sub)"
            strokeDasharray="3 3"
            opacity={0.5}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wpm"
            stroke="var(--primary-color)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: 'var(--primary-color)' }}
            animationDuration={1000}
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
            animationDuration={1000}
          />

          <Scatter
            yAxisId="right"
            dataKey="error"
            fill="var(--error-color)"
            shape={errorShape}
            animationDuration={1000}
          />
        </ComposedChart>
      )}
    </div>
  );
};

export default React.memo(Chart);
