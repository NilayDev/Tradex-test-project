import { useEffect, useState } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MarketQuote } from '@/types/market';
import { formatCardPrice } from '@/lib/marketFormat';

const PCT_ICON = 12;

type Point = { time: number; price: number };

type Props = {
  seriesId: string;
  quote: MarketQuote;
  left: number;
  top: number;
};

function clockLabel(ms: number) {
  return new Date(ms).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function HoverPriceChart({ seriesId, quote, left, top }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [busy, setBusy] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    setBusy(true);
    setFailed(false);
    setPoints([]);

    fetch(`/api/market/chart/${encodeURIComponent(seriesId)}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error('chart');
        return res.json();
      })
      .then((rows: Point[]) => setPoints(Array.isArray(rows) ? rows : []))
      .catch((err) => {
        if (err.name !== 'AbortError') setFailed(true);
      })
      .finally(() => setBusy(false));

    return () => ac.abort();
  }, [seriesId]);

  const ch = quote.change24h;
  const up = ch != null && ch > 0;
  const down = ch != null && ch < 0;
  const stroke = up ? '#0ecb81' : down ? '#f6465d' : '#888';
  const pctText =
    ch == null
      ? null
      : ch > 0
        ? `+${ch.toFixed(2)}%`
        : ch < 0
          ? `-${Math.abs(ch).toFixed(2)}%`
          : `${ch.toFixed(2)}%`;

  const headerPrice =
    quote.price != null
      ? (quote.symbol === 'EUR/USD' ? '' : '$') + formatCardPrice(quote.price, quote.symbol)
      : '—';

  const tipFormatter = (v: number) => [
    (quote.symbol === 'EUR/USD' ? '' : '$') + formatCardPrice(v, quote.symbol),
    'Price',
  ];

  return (
    <div className="chart-popup" style={{ left, top }}>
      <div className="chart-header">
        <div className="chart-header-left">
          <span className="chart-name">{quote.name}</span>
          <span className="chart-symbol-badge">{quote.symbol}</span>
        </div>
        <div className="chart-header-right">
          <span className="chart-price">{headerPrice}</span>
          <span
            className="chart-change inline-flex items-center gap-1"
            style={{ color: stroke }}
          >
            {ch == null && '—'}
            {ch != null && up && (
              <>
                <TrendingUp size={PCT_ICON} strokeWidth={2.25} className="shrink-0" aria-hidden />
                {pctText}
              </>
            )}
            {ch != null && down && (
              <>
                <TrendingDown size={PCT_ICON} strokeWidth={2.25} className="shrink-0" aria-hidden />
                {pctText}
              </>
            )}
            {ch != null && ch === 0 && (
              <>
                <Minus size={PCT_ICON} strokeWidth={2.25} className="shrink-0" aria-hidden />
                {pctText}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="chart-body">
        {busy && (
          <div className="chart-status">
            <span className="chart-spinner" />
          </div>
        )}
        {!busy && failed && (
          <div className="chart-status chart-status-error">Data temporarily unavailable</div>
        )}
        {!busy && !failed && points.length === 0 && (
          <div className="chart-status">No data returned</div>
        )}
        {!busy && !failed && points.length > 0 && (
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value: number) => tipFormatter(value)}
                labelFormatter={(t: number) => clockLabel(t)}
                contentStyle={{
                  backgroundColor: '#0f0f1a',
                  border: '1px solid #2a2a3a',
                  borderRadius: 6,
                  fontSize: 11,
                  color: '#fff',
                  padding: '4px 8px',
                }}
                itemStyle={{ color: stroke }}
                cursor={{ stroke: '#333', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: stroke, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="chart-footer text-white/50">24H PRICE CHART</div>
    </div>
  );
}
