export function formatStripPrice(price: number | null, symbol: string) {
  if (price == null) return '—';
  if (symbol === 'EUR/USD') return price.toFixed(4);
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

/** Hover card header + chart tooltip */
export function formatCardPrice(price: number, symbol: string) {
  if (symbol === 'EUR/USD' || price < 1) return price.toFixed(4);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
