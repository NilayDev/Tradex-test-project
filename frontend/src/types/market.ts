export type MarketQuote = {
  symbol: string;
  name: string;
  price: number | null;
  change24h: number | null;
  /** CoinGecko id when this row is crypto; null for indices / fx */
  coinId: string | null;
};
