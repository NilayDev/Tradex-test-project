import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type { MarketQuote } from '@/types/market';
import { formatStripPrice } from '@/lib/marketFormat';

type Props = {
  row: MarketQuote;
  onHover: (row: MarketQuote | null, x?: number, bottom?: number) => void;
};

const ICON = 14;

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const cls = 'ticker-trend-icon';
  if (trend === 'up') {
    return <TrendingUp className={cls} size={ICON} strokeWidth={2.25} aria-hidden />;
  }
  if (trend === 'down') {
    return <TrendingDown className={cls} size={ICON} strokeWidth={2.25} aria-hidden />;
  }
  return <Minus className={cls} size={ICON} strokeWidth={2.25} aria-hidden />;
}

function changeTone(change: number | null) {
  if (change == null) return 'ticker-change ticker-change-zero';
  if (change > 0) return 'ticker-change ticker-change-positive';
  if (change < 0) return 'ticker-change ticker-change-negative';
  return 'ticker-change ticker-change-zero';
}

function sparkTrend(change: number | null): 'up' | 'down' | 'flat' | null {
  if (change == null) return null;
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}

export function TickerQuote({ row, onHover }: Props) {
  const { symbol, price, change24h, coinId } = row;
  const tone = changeTone(change24h);
  const trend = sparkTrend(change24h);

  const pct =
    change24h != null
      ? `${change24h > 0 ? '+' : change24h < 0 ? '-' : ''}${Math.abs(change24h).toFixed(2)}%`
      : '—';

  return (
    <div
      className={'ticker-item' + (coinId ? ' ticker-item-crypto' : '')}
      onMouseEnter={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        onHover(row, e.clientX, b.bottom);
      }}
      onMouseLeave={() => onHover(null)}
    >
      <span className="ticker-symbol">{symbol}</span>
      <span className="ticker-price">{formatStripPrice(price, symbol)}</span>
      <span className={tone}>
        {change24h != null && trend && <TrendIcon trend={trend} />}
        {pct}
      </span>
      <span className="ticker-divider" aria-hidden />
    </div>
  );
}
