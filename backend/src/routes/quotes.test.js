const http = require('http');
const express = require('express');
const axios = require('axios');

const geckoFixture = {
  bitcoin: { usd: 65432.1, usd_24h_change: 2.45 },
  ethereum: { usd: 3200.5, usd_24h_change: -1.2 },
  solana: { usd: 145.3, usd_24h_change: 5.1 },
  binancecoin: { usd: 412.8, usd_24h_change: 0.8 },
  ripple: { usd: 0.62, usd_24h_change: -0.5 },
};

const yahooFixture = {
  chart: {
    result: [
      {
        meta: { regularMarketPrice: 5248, previousClose: 5250 },
        timestamp: [1, 2],
        indicators: { quote: [{ close: [5200, 5248] }] },
      },
    ],
  },
};

const realGet = axios.get.bind(axios);
axios.get = async (url) => {
  if (String(url).includes('coingecko')) {
    return { data: geckoFixture };
  }
  if (String(url).includes('finance.yahoo.com')) {
    return { data: yahooFixture };
  }
  throw new Error('unexpected url: ' + url);
};

const quoteRoutes = require('./quotes');

function getJson(app, path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      http
        .get(`http://127.0.0.1:${port}${path}`, (r) => {
          let buf = '';
          r.on('data', (c) => {
            buf += c;
          });
          r.on('end', () => {
            server.close();
            try {
              resolve({ status: r.statusCode, body: JSON.parse(buf || 'null') });
            } catch (e) {
              reject(e);
            }
          });
        })
        .on('error', (e) => {
          server.close();
          reject(e);
        });
    });
  });
}

async function main() {
  const app = express();
  app.use('/api/market', quoteRoutes);

  const { status, body } = await getJson(app, '/api/market/prices');
  if (status !== 200) throw new Error('expected 200, got ' + status);
  if (!Array.isArray(body)) throw new Error('body should be an array');

  const first = body[0];
  if (!first || typeof first.symbol !== 'string') throw new Error('missing symbol');
  if (typeof first.price !== 'number') throw new Error('missing price');
  if (typeof first.change24h !== 'number') throw new Error('missing change24h');

  console.log('quotes route: ok');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    axios.get = realGet;
  });
