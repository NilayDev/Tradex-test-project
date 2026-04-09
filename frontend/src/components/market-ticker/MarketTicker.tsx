import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MarketQuote } from '@/types/market';
import { HoverPriceChart } from './HoverPriceChart';
import { TickerQuote } from './TickerQuote';

const POLL_MS = 30_000;
const CARD_W = 290;
const POPUP_GAP = 20;

function clampPopupX(clientX: number) {
  const half = CARD_W / 2;
  return Math.min(Math.max(clientX - half, 8), window.innerWidth - CARD_W - 8);
}

export function MarketTicker() {
  const [rows, setRows] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [bad, setBad] = useState(false);
  const [peek, setPeek] = useState<MarketQuote | null>(null);
  const [popupLeft, setPopupLeft] = useState(0);
  const [popupTop, setPopupTop] = useState(0);

  const refresh = useCallback(() => {
    fetch('/api/market/prices')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: MarketQuote[]) => {
        setRows(data);
        setBad(false);
      })
      .catch(() => setBad(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const onRowHover = useCallback((row: MarketQuote | null, x?: number, bottom?: number) => {
    setPeek(row);
    if (row && x != null && bottom != null) {
      setPopupLeft(clampPopupX(x));
      setPopupTop(bottom + POPUP_GAP);
    }
  }, []);

  const loop = [...rows, ...rows];

  return (
    <div className="ticker-wrapper">
      {loading && <div className="ticker-message">Loading market data...</div>}
      {!loading && bad && <div className="ticker-message">Market data unavailable</div>}

      {!loading && !bad && (
        <div className="ticker-viewport">
          <div className="ticker-track">
            {loop.map((row, i) => (
              <TickerQuote key={`${row.symbol}-${i}`} row={row} onHover={onRowHover} />
            ))}
          </div>
        </div>
      )}

      {peek &&
        createPortal(
          <HoverPriceChart
            seriesId={peek.coinId || peek.symbol}
            quote={peek}
            left={popupLeft}
            top={popupTop}
          />,
          document.body
        )}
    </div>
  );
}
