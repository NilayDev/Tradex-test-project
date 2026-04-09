const { Router } = require('express');
const axios = require('axios');

const router = Router();

const GECKO_SIMPLE =
  'https://api.coingecko.com/api/v3/simple/price?' +
  'ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true';

const coins = {
  bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
  ethereum: { symbol: 'ETH', name: 'Ethereum' },
  solana: { symbol: 'SOL', name: 'Solana' },
  binancecoin: { symbol: 'BNB', name: 'BNB' },
  ripple: { symbol: 'XRP', name: 'XRP' },
};

const indices = [
  { symbol: 'SPX', name: 'S&P 500', yahoo: '^GSPC' },
  { symbol: 'GOLD', name: 'Gold', yahoo: 'GC=F' },
  { symbol: 'EUR/USD', name: 'EUR/USD', yahoo: 'EURUSD=X' },
];

const headers = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const reqFast = { headers, timeout: 9000 };
const reqSlow = { headers, timeout: 12000 };

let lastPrices = null;
let lastPricesAt = 0;
const pricesTtlMs = 28000;

const lastGoodCrypto = {};

const chartCache = {};
const chartTtlMs = 90000;

function yahooChartUrl(ticker, interval, range) {
  return (
    'https://query1.finance.yahoo.com/v8/finance/chart/' +
    encodeURIComponent(ticker) +
    '?interval=' +
    interval +
    '&range=' +
    range
  );
}

async function fetchGeckoSimple() {
  try {
    const { data } = await axios.get(GECKO_SIMPLE, reqFast);
    return data;
  } catch (err) {
    console.error('[gecko prices]', err.response?.status || 'x', err.message);
    return null;
  }
}

function buildCrypto(body) {
  const g = body && typeof body === 'object' ? body : {};
  return Object.entries(coins).map(([geckoId, info]) => {
    const row = g[geckoId];
    if (row) {
      lastGoodCrypto[geckoId] = {
        price: row.usd,
        change24h: row.usd_24h_change,
      };
      return {
        symbol: info.symbol,
        name: info.name,
        price: row.usd ?? null,
        change24h: row.usd_24h_change ?? null,
        coinId: geckoId,
      };
    }
    const stale = lastGoodCrypto[geckoId];
    if (stale) {
      return {
        symbol: info.symbol,
        name: info.name,
        price: stale.price,
        change24h: stale.change24h,
        coinId: geckoId,
      };
    }
    return {
      symbol: info.symbol,
      name: info.name,
      price: null,
      change24h: null,
      coinId: geckoId,
    };
  });
}

async function yahooDaySnap(ticker) {
  try {
    const { data } = await axios.get(yahooChartUrl(ticker, '1d', '2d'), reqFast);
    const block = data?.chart?.result?.[0];
    if (!block?.meta) return null;
    const m = block.meta;
    const price = m.regularMarketPrice ?? m.previousClose ?? null;
    let change24h = null;
    if (m.regularMarketPrice != null && m.previousClose) {
      change24h = ((m.regularMarketPrice - m.previousClose) / m.previousClose) * 100;
    }
    return { price, change24h };
  } catch (err) {
    console.error('[yahoo]', ticker, err.response?.status || 'x', err.message);
    return null;
  }
}

router.get('/prices', async (req, res) => {
  const t = Date.now();
  if (lastPrices && t - lastPricesAt < pricesTtlMs) {
    res.json(lastPrices);
    return;
  }

  const gecko = await fetchGeckoSimple();
  const geckoWorked = gecko && Object.keys(gecko).length > 0;
  const crypto = buildCrypto(gecko || {});

  const fallbackBySymbol = lastPrices
    ? Object.fromEntries(lastPrices.map((a) => [a.symbol, a]))
    : {};

  const traditional = await Promise.all(
    indices.map(async (item) => {
      const snap = await yahooDaySnap(item.yahoo);
      if (snap && snap.price != null) {
        return {
          symbol: item.symbol,
          name: item.name,
          price: snap.price,
          change24h: snap.change24h,
          coinId: null,
        };
      }
      const prev = fallbackBySymbol[item.symbol];
      if (prev) return { ...prev };
      return {
        symbol: item.symbol,
        name: item.name,
        price: null,
        change24h: null,
        coinId: null,
      };
    })
  );

  const out = crypto.concat(traditional);
  if (geckoWorked || traditional.some((a) => a.price != null)) {
    lastPrices = out;
    lastPricesAt = t;
  }

  res.json(out);
});

router.get('/chart/:id', async (req, res) => {
  const id = req.params.id;
  const hit = chartCache[id];
  if (hit && Date.now() - hit.t < chartTtlMs) {
    res.json(hit.points);
    return;
  }

  if (coins[id]) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`;
      const { data } = await axios.get(url, reqSlow);
      const raw = data?.prices;
      if (!Array.isArray(raw)) throw new Error('bad payload');
      const points = raw.map(([time, price]) => ({ time, price }));
      chartCache[id] = { points, t: Date.now() };
      res.json(points);
    } catch (err) {
      if (hit) {
        res.json(hit.points);
        return;
      }
      res.status(502).json({ error: 'Chart data temporarily unavailable.' });
    }
    return;
  }

  const match = indices.find((i) => i.symbol === id || i.yahoo === id);
  if (match) {
    try {
      const { data } = await axios.get(yahooChartUrl(match.yahoo, '15m', '1d'), reqSlow);
      const block = data?.chart?.result?.[0];
      if (!block) throw new Error('empty chart');
      const times = block.timestamp || [];
      const closes = block.indicators?.quote?.[0]?.close || [];
      const points = [];
      for (let i = 0; i < times.length; i++) {
        const p = closes[i];
        if (p != null) points.push({ time: times[i] * 1000, price: p });
      }
      chartCache[id] = { points, t: Date.now() };
      res.json(points);
    } catch (err) {
      if (hit) {
        res.json(hit.points);
        return;
      }
      res.status(502).json({ error: 'Chart data temporarily unavailable.' });
    }
    return;
  }

  res.status(400).json({ error: 'Invalid asset ID for chart' });
});

module.exports = router;
