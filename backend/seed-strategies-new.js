// Seed all 12 strategies directly to Supabase
// Run with: node seed-strategies-new.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const strategies = [
  {
    id: 1,
    name: "Mean Reversion RSI",
    market: "Stocks",
    timeframe: "Daily",
    win_rate: 64,
    profit_factor: 2.1,
    max_drawdown: 18.3,
    avg_return: 13.8,
    description: "Statistical mean reversion strategy that identifies oversold/overbought conditions using RSI and standard deviation bands. Targets stocks that deviate significantly from their mean price.",
    algorithm: {
      name: "Mean Reversion with RSI & Bollinger Bands",
      type: "Mean Reversion & Statistical Arbitrage",
      description: "This strategy combines RSI oversold/overbought signals with Bollinger Band extremes to identify mean reversion opportunities. It enters when price touches the lower band with RSI below 30, expecting a bounce back to the mean.",
      technicalDetails: [
        { title: "RSI Calculation", content: "RSI = 100 - (100 / (1 + RS)), where RS = Average Gain / Average Loss over 14 periods. Values below 30 indicate oversold, above 70 overbought." },
        { title: "Bollinger Bands", content: "Middle Band = 20-period SMA. Upper/Lower Bands = Middle Band ± (2 × Standard Deviation). Bands expand during volatility and contract during consolidation." },
        { title: "Z-Score Filter", content: "Z-Score = (Current Price - Mean) / Standard Deviation. Only trades when |Z-Score| > 2, indicating price is 2 standard deviations from mean." },
        { title: "Position Sizing", content: "Risk 1% of capital per trade. Position size = (Account × 0.01) / (Entry Price - Stop Loss Price)." }
      ],
      workflow: ["Calculate 20-day SMA and standard deviation", "Calculate RSI(14)", "Check if price touches lower BB", "Verify RSI < 30", "Calculate Z-score", "Enter long if Z < -2", "Exit at middle band or RSI > 50"],
      complexity: "Intermediate",
      computationalLoad: "Low",
      backtestPeriod: "36 months (2022-2024)"
    },
    rules: ["Entry: Price touches lower BB + RSI < 30 + Z-score < -2", "Stop Loss: 3% below entry", "Take Profit: Middle band or RSI crosses 50", "Max holding: 10 days"],
    pros: ["Works well in ranging markets", "Statistical edge", "Clear entry/exit rules", "Good for sideways stocks"],
    cons: ["Underperforms in strong trends", "Requires patience", "Multiple false signals in crashes", "Needs proper position sizing"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10420 }, { month: "Mar", value: 10890 },
      { month: "Apr", value: 10650 }, { month: "May", value: 11180 }, { month: "Jun", value: 11520 },
      { month: "Jul", value: 11240 }, { month: "Aug", value: 11780 }, { month: "Sep", value: 12150 },
      { month: "Oct", value: 11890 }, { month: "Nov", value: 12480 }, { month: "Dec", value: 13020 }
    ],
    monthly_returns: [
      { month: "Jan", return: 4.2 }, { month: "Feb", return: 4.5 }, { month: "Mar", return: -2.2 },
      { month: "Apr", return: 5.0 }, { month: "May", return: 3.0 }, { month: "Jun", return: -2.4 },
      { month: "Jul", return: 4.8 }, { month: "Aug", return: 3.1 }, { month: "Sep", return: -2.1 },
      { month: "Oct", return: 5.0 }, { month: "Nov", return: 4.3 }, { month: "Dec", return: 4.3 }
    ],
    trades: [{ type: "Win", count: 64 }, { type: "Loss", count: 36 }]
  },
  {
    id: 2,
    name: "Breakout Momentum Scanner",
    market: "Crypto",
    timeframe: "4H",
    win_rate: 58,
    profit_factor: 2.8,
    max_drawdown: 22.4,
    avg_return: 28.6,
    description: "Aggressive momentum strategy that catches explosive breakouts from consolidation patterns. Uses volume confirmation and ATR for volatility filtering.",
    algorithm: {
      name: "Volume-Confirmed Breakout with ATR Filter",
      type: "Breakout & Momentum",
      description: "Identifies consolidation zones (price range < 5% for 7+ days), then enters on breakout with volume spike > 150% of average. Uses ATR to set dynamic stops and targets.",
      technicalDetails: [
        { title: "Consolidation Detection", content: "Tracks 7-day high-low range. Consolidation = (High - Low) / Low < 0.05. Stores consolidation high/low as breakout levels." },
        { title: "Volume Spike", content: "Current Volume / 20-day Average Volume > 1.5. Confirms institutional participation and reduces false breakouts." },
        { title: "ATR-Based Stops", content: "ATR(14) = Average of True Ranges over 14 periods. Stop Loss = Entry - (2 × ATR). Take Profit = Entry + (4 × ATR) for 2:1 R:R." },
        { title: "Momentum Filter", content: "Only enters if price closes above consolidation high by at least 1%. Prevents premature entries on wicks." }
      ],
      workflow: ["Scan for 7+ day consolidation", "Monitor for breakout above range", "Check volume > 1.5x average", "Verify close above high", "Calculate ATR", "Enter with 2 ATR stop", "Trail stop after 2:1 R:R achieved"],
      complexity: "Intermediate to Advanced",
      computationalLoad: "Medium",
      backtestPeriod: "24 months (2023-2024)"
    },
    rules: ["Entry: Breakout from 7-day consolidation + Volume > 1.5x avg + Close > high", "Stop Loss: 2 × ATR below entry", "Take Profit: 4 × ATR or trail after 2:1", "Filter: Only trade BTC, ETH, SOL"],
    pros: ["Catches explosive moves", "High profit factor", "Clear breakout levels", "Volume confirmation reduces fakeouts"],
    cons: ["Lower win rate", "High drawdown", "Requires quick execution", "Whipsaws in choppy markets"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 11850 }, { month: "Mar", value: 10420 },
      { month: "Apr", value: 12680 }, { month: "May", value: 15240 }, { month: "Jun", value: 13890 },
      { month: "Jul", value: 16720 }, { month: "Aug", value: 14980 }, { month: "Sep", value: 13450 },
      { month: "Oct", value: 17890 }, { month: "Nov", value: 19650 }, { month: "Dec", value: 22140 }
    ],
    monthly_returns: [
      { month: "Jan", return: 18.5 }, { month: "Feb", return: -12.1 }, { month: "Mar", return: 21.7 },
      { month: "Apr", return: 20.2 }, { month: "May", return: -8.9 }, { month: "Jun", return: 20.4 },
      { month: "Jul", return: -10.4 }, { month: "Aug", return: -10.2 }, { month: "Sep", return: 33.0 },
      { month: "Oct", return: 9.9 }, { month: "Nov", return: 12.6 }, { month: "Dec", return: 12.6 }
    ],
    trades: [{ type: "Win", count: 58 }, { type: "Loss", count: 42 }]
  },
  {
    id: 3,
    name: "Turtle Trading System",
    market: "Forex",
    timeframe: "Daily",
    win_rate: 42,
    profit_factor: 3.4,
    max_drawdown: 28.7,
    avg_return: 34.2,
    description: "Classic trend-following system based on Donchian Channel breakouts. Legendary strategy used by the Turtle Traders with modern risk management.",
    algorithm: {
      name: "Donchian Channel Breakout (Turtle Method)",
      type: "Trend Following",
      description: "Enters on 20-day high/low breakouts, exits on 10-day opposite breakout. Uses ATR-based position sizing and pyramiding. Designed to catch major trends while accepting many small losses.",
      technicalDetails: [
        { title: "Donchian Channels", content: "Upper Channel = Highest High of last 20 periods. Lower Channel = Lowest Low of last 20 periods. Breakout signals when price exceeds these levels." },
        { title: "ATR Position Sizing", content: "Risk per trade = 2% of capital. Position Size = (Account × 0.02) / (2 × ATR). Normalizes risk across different volatility regimes." },
        { title: "Pyramiding", content: "Add to winning positions every 0.5 ATR move in favor, up to 4 units total. Increases exposure in strong trends." },
        { title: "Exit Strategy", content: "Exit all units when price breaks 10-day channel in opposite direction. Protects profits while staying in trend." }
      ],
      workflow: ["Calculate 20-day high/low", "Calculate 10-day high/low", "Calculate ATR(20)", "Enter long on 20-day high break", "Size position using ATR", "Add units every 0.5 ATR", "Exit on 10-day low break"],
      complexity: "Advanced",
      computationalLoad: "Low",
      backtestPeriod: "60 months (2019-2024)"
    },
    rules: ["Entry: Price breaks 20-day high/low", "Stop Loss: 2 × ATR from entry", "Take Profit: 10-day opposite breakout", "Pyramiding: Add every 0.5 ATR, max 4 units"],
    pros: ["Catches major trends", "Proven track record", "Systematic approach", "Excellent for trending pairs"],
    cons: ["Low win rate", "Large drawdowns", "Many whipsaws", "Requires discipline"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 9720 }, { month: "Mar", value: 10580 },
      { month: "Apr", value: 11890 }, { month: "May", value: 11340 }, { month: "Jun", value: 12680 },
      { month: "Jul", value: 11920 }, { month: "Aug", value: 13450 }, { month: "Sep", value: 14780 },
      { month: "Oct", value: 13980 }, { month: "Nov", value: 15620 }, { month: "Dec", value: 17240 }
    ],
    monthly_returns: [
      { month: "Jan", return: -2.8 }, { month: "Feb", return: 8.8 }, { month: "Mar", return: 12.4 },
      { month: "Apr", return: -4.6 }, { month: "May", return: 11.8 }, { month: "Jun", return: -6.0 },
      { month: "Jul", return: 12.8 }, { month: "Aug", return: 9.9 }, { month: "Sep", return: -5.4 },
      { month: "Oct", return: 11.7 }, { month: "Nov", return: 10.4 }, { month: "Dec", return: 10.4 }
    ],
    trades: [{ type: "Win", count: 42 }, { type: "Loss", count: 58 }]
  },
  {
    id: 4,
    name: "VWAP Intraday Scalper",
    market: "Stocks",
    timeframe: "5m",
    win_rate: 71,
    profit_factor: 1.9,
    max_drawdown: 8.4,
    avg_return: 18.7,
    description: "High-frequency scalping strategy using VWAP as dynamic support/resistance. Targets liquid stocks with tight spreads for quick profits.",
    algorithm: {
      name: "VWAP Mean Reversion Scalping",
      type: "Scalping & Mean Reversion",
      description: "Uses Volume Weighted Average Price as a fair value anchor. Enters when price deviates from VWAP by 0.3-0.5%, expecting quick reversion. Requires fast execution and liquid markets.",
      technicalDetails: [
        { title: "VWAP Calculation", content: "VWAP = Σ(Price × Volume) / Σ(Volume) from market open. Resets daily. Represents average price weighted by volume." },
        { title: "Standard Deviation Bands", content: "VWAP ± (1σ, 2σ, 3σ). σ = √(Σ(Price - VWAP)² × Volume / Σ Volume). Entry at 2σ, exit at VWAP." },
        { title: "Liquidity Filter", content: "Only trades stocks with Average Daily Volume > 5M shares and spread < 0.05%. Ensures fast fills." },
        { title: "Time Filter", content: "Only trades 9:45-11:30 AM and 2:00-3:45 PM EST. Avoids open/close volatility and lunch lull." }
      ],
      workflow: ["Calculate VWAP from open", "Calculate standard deviation bands", "Wait for price to touch 2σ band", "Check volume > average", "Enter toward VWAP", "Exit at VWAP or 1σ", "Stop at 3σ"],
      complexity: "Advanced",
      computationalLoad: "High",
      backtestPeriod: "12 months (2024)"
    },
    rules: ["Entry: Price touches VWAP ± 2σ + Volume confirmation", "Stop Loss: VWAP ± 3σ", "Take Profit: VWAP or 1σ band", "Time: 9:45-11:30, 14:00-15:45 EST only"],
    pros: ["High win rate", "Small drawdown", "Many opportunities", "Quick trades"],
    cons: ["Requires fast execution", "Commission sensitive", "Screen time intensive", "Only works in liquid stocks"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10680 }, { month: "Mar", value: 11240 },
      { month: "Apr", value: 11580 }, { month: "May", value: 12180 }, { month: "Jun", value: 12640 },
      { month: "Jul", value: 12920 }, { month: "Aug", value: 13480 }, { month: "Sep", value: 13920 },
      { month: "Oct", value: 14280 }, { month: "Nov", value: 14820 }, { month: "Dec", value: 15380 }
    ],
    monthly_returns: [
      { month: "Jan", return: 6.8 }, { month: "Feb", return: 5.2 }, { month: "Mar", return: 3.0 },
      { month: "Apr", return: 5.2 }, { month: "May", return: 3.8 }, { month: "Jun", return: 2.2 },
      { month: "Jul", return: 4.3 }, { month: "Aug", return: 3.3 }, { month: "Sep", return: 2.6 },
      { month: "Oct", return: 3.8 }, { month: "Nov", return: 3.7 }, { month: "Dec", return: 3.8 }
    ],
    trades: [{ type: "Win", count: 71 }, { type: "Loss", count: 29 }]
  },
  {
    id: 5,
    name: "Ichimoku Cloud Trend",
    market: "Crypto",
    timeframe: "Daily",
    win_rate: 55,
    profit_factor: 2.6,
    max_drawdown: 19.8,
    avg_return: 22.4,
    description: "Complete trading system using all Ichimoku components. Enters on cloud breakouts with multiple confirmations for high-probability trend trades.",
    algorithm: {
      name: "Ichimoku Kinko Hyo Complete System",
      type: "Trend Following & Multi-Indicator",
      description: "Uses five Ichimoku lines for comprehensive market analysis. Requires price above cloud, Tenkan above Kijun, and Chikou above price for bullish confirmation.",
      technicalDetails: [
        { title: "Tenkan-sen (Conversion)", content: "Tenkan = (9-period high + 9-period low) / 2. Fast-moving line showing short-term momentum." },
        { title: "Kijun-sen (Base)", content: "Kijun = (26-period high + 26-period low) / 2. Slower line acting as support/resistance and trigger." },
        { title: "Senkou Span A & B (Cloud)", content: "Span A = (Tenkan + Kijun) / 2, plotted 26 periods ahead. Span B = (52-period high + low) / 2, plotted 26 ahead." },
        { title: "Chikou Span (Lagging)", content: "Current close plotted 26 periods back. Confirms trend by comparing to historical price." }
      ],
      workflow: ["Calculate all 5 Ichimoku lines", "Check price above cloud", "Verify Tenkan > Kijun", "Confirm Chikou > price", "Enter on all confirmations", "Trail stop below cloud", "Exit when price enters cloud"],
      complexity: "Advanced",
      computationalLoad: "Medium",
      backtestPeriod: "36 months (2022-2024)"
    },
    rules: ["Entry: Price > Cloud + Tenkan > Kijun + Chikou > Price + TK cross", "Stop Loss: Below cloud or Kijun", "Take Profit: Trail with cloud or opposite TK cross", "Filter: Only trade in direction of cloud"],
    pros: ["Complete system", "Multiple confirmations", "Visual clarity", "Works in all timeframes"],
    cons: ["Complex for beginners", "Lagging signals", "Choppy in sideways", "Requires all confirmations"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 11420 }, { month: "Mar", value: 12680 },
      { month: "Apr", value: 11240 }, { month: "May", value: 13580 }, { month: "Jun", value: 15120 },
      { month: "Jul", value: 13890 }, { month: "Aug", value: 16240 }, { month: "Sep", value: 14520 },
      { month: "Oct", value: 12980 }, { month: "Nov", value: 16450 }, { month: "Dec", value: 18920 }
    ],
    monthly_returns: [
      { month: "Jan", return: 14.2 }, { month: "Feb", return: 11.0 }, { month: "Mar", return: -11.4 },
      { month: "Apr", return: 20.8 }, { month: "May", return: 11.3 }, { month: "Jun", return: -8.1 },
      { month: "Jul", return: 16.9 }, { month: "Aug", return: -10.6 }, { month: "Sep", return: -10.6 },
      { month: "Oct", return: 26.7 }, { month: "Nov", return: 15.0 }, { month: "Dec", return: 15.0 }
    ],
    trades: [{ type: "Win", count: 55 }, { type: "Loss", count: 45 }]
  },
  {
    id: 6,
    name: "Harmonic Pattern Hunter",
    market: "Forex",
    timeframe: "4H",
    win_rate: 68,
    profit_factor: 2.7,
    max_drawdown: 14.2,
    avg_return: 21.8,
    description: "Advanced pattern recognition strategy identifying Gartley, Butterfly, and Bat patterns. Uses Fibonacci ratios for precise entry and exit points.",
    algorithm: {
      name: "Harmonic Pattern Recognition (Gartley, Bat, Butterfly)",
      type: "Pattern Recognition & Fibonacci",
      description: "Scans for specific price patterns with precise Fibonacci relationships. Enters at pattern completion (D point) with targets at Fibonacci retracements of CD leg.",
      technicalDetails: [
        { title: "Gartley Pattern", content: "XA leg, AB retraces 61.8% of XA, BC retraces 38.2-88.6% of AB, CD = 78.6% retracement of XA. Entry at D." },
        { title: "Bat Pattern", content: "Similar to Gartley but D point at 88.6% retracement of XA. Tighter pattern with higher win rate." },
        { title: "Butterfly Pattern", content: "D point extends to 127.2% or 161.8% of XA. Indicates strong reversal potential." },
        { title: "Fibonacci Targets", content: "TP1 = 38.2% retracement of CD, TP2 = 61.8% of CD. Stop below/above D point by 10 pips." }
      ],
      workflow: ["Scan for XABCD swing points", "Measure Fibonacci ratios", "Validate pattern type", "Wait for D point completion", "Enter with confirmation candle", "Set stops beyond D", "Take profit at Fib levels"],
      complexity: "Expert",
      computationalLoad: "High",
      backtestPeriod: "48 months (2020-2024)"
    },
    rules: ["Entry: Valid harmonic pattern completion at D point + confirmation candle", "Stop Loss: 10 pips beyond D point", "Take Profit: 38.2% and 61.8% of CD leg", "Filter: Only trade on major pairs"],
    pros: ["High accuracy", "Precise entry/exit", "Great risk-reward", "Works in all markets"],
    cons: ["Rare setups", "Complex identification", "Requires experience", "Manual pattern drawing"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10720 }, { month: "Mar", value: 11380 },
      { month: "Apr", value: 11840 }, { month: "May", value: 12480 }, { month: "Jun", value: 12920 },
      { month: "Jul", value: 12580 }, { month: "Aug", value: 13680 }, { month: "Sep", value: 14320 },
      { month: "Oct", value: 14820 }, { month: "Nov", value: 15580 }, { month: "Dec", value: 16380 }
    ],
    monthly_returns: [
      { month: "Jan", return: 7.2 }, { month: "Feb", return: 6.2 }, { month: "Mar", return: 4.0 },
      { month: "Apr", return: 5.4 }, { month: "May", return: 3.5 }, { month: "Jun", return: -2.6 },
      { month: "Jul", return: 8.7 }, { month: "Aug", return: 4.7 }, { month: "Sep", return: 3.5 },
      { month: "Oct", return: 5.3 }, { month: "Nov", return: 5.1 }, { month: "Dec", return: 5.1 }
    ],
    trades: [{ type: "Win", count: 68 }, { type: "Loss", count: 32 }]
  },
  {
    id: 7,
    name: "Order Flow Imbalance",
    market: "Crypto",
    timeframe: "15m",
    win_rate: 62,
    profit_factor: 2.3,
    max_drawdown: 16.5,
    avg_return: 19.3,
    description: "Institutional-grade strategy analyzing order book depth and trade flow. Identifies supply/demand imbalances before price moves.",
    algorithm: {
      name: "Order Book Depth & Delta Volume Analysis",
      type: "Market Microstructure & Order Flow",
      description: "Analyzes bid/ask imbalances in order book and cumulative delta (buy volume - sell volume). Enters when large imbalance appears with volume confirmation.",
      technicalDetails: [
        { title: "Bid-Ask Imbalance", content: "Imbalance Ratio = (Bid Volume - Ask Volume) / (Bid Volume + Ask Volume). Values > 0.3 indicate buying pressure, < -0.3 selling pressure." },
        { title: "Cumulative Delta", content: "Delta = Buy Volume - Sell Volume per candle. Cumulative Delta = Σ Delta. Divergence between price and delta signals reversals." },
        { title: "Volume Profile", content: "Tracks volume at each price level. High volume nodes act as support/resistance. Low volume nodes indicate fast price movement zones." },
        { title: "Absorption Detection", content: "Large orders at level that don't move price = absorption. Indicates strong hands accumulating/distributing." }
      ],
      workflow: ["Monitor order book depth", "Calculate bid-ask imbalance", "Track cumulative delta", "Identify volume profile nodes", "Detect absorption patterns", "Enter on imbalance > 30%", "Exit on opposite imbalance"],
      complexity: "Expert",
      computationalLoad: "Very High",
      backtestPeriod: "18 months (2023-2024)"
    },
    rules: ["Entry: Bid-ask imbalance > 30% + Delta divergence + Volume node", "Stop Loss: 1.5% from entry", "Take Profit: Opposite imbalance or 3:1 R:R", "Filter: Only BTC, ETH with > $50M daily volume"],
    pros: ["Sees institutional activity", "Leading indicator", "High accuracy", "Works in all conditions"],
    cons: ["Requires order book data", "Complex analysis", "High computational needs", "Exchange-specific"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 11280 }, { month: "Mar", value: 12450 },
      { month: "Apr", value: 11620 }, { month: "May", value: 13840 }, { month: "Jun", value: 12980 },
      { month: "Jul", value: 11450 }, { month: "Aug", value: 14120 }, { month: "Sep", value: 15680 },
      { month: "Oct", value: 14240 }, { month: "Nov", value: 16890 }, { month: "Dec", value: 18420 }
    ],
    monthly_returns: [
      { month: "Jan", return: 12.8 }, { month: "Feb", return: 10.4 }, { month: "Mar", return: -6.7 },
      { month: "Apr", return: 19.1 }, { month: "May", return: -6.2 }, { month: "Jun", return: -11.8 },
      { month: "Jul", return: 23.3 }, { month: "Aug", return: 11.1 }, { month: "Sep", return: -9.2 },
      { month: "Oct", return: 18.6 }, { month: "Nov", return: 9.1 }, { month: "Dec", return: 9.1 }
    ],
    trades: [{ type: "Win", count: 62 }, { type: "Loss", count: 38 }]
  },
  {
    id: 8,
    name: "Statistical Arbitrage Pairs",
    market: "Stocks",
    timeframe: "1H",
    win_rate: 73,
    profit_factor: 2.4,
    max_drawdown: 11.8,
    avg_return: 16.4,
    description: "Market-neutral pairs trading strategy exploiting mean reversion in correlated stocks. Uses cointegration and z-score for entry signals.",
    algorithm: {
      name: "Cointegration-Based Pairs Trading",
      type: "Statistical Arbitrage & Market Neutral",
      description: "Identifies pairs of stocks with historical correlation > 0.8. Calculates spread and z-score. Goes long underperformer, short outperformer when spread diverges.",
      technicalDetails: [
        { title: "Cointegration Test", content: "Uses Augmented Dickey-Fuller test on price spread. P-value < 0.05 indicates cointegration. Only trades cointegrated pairs." },
        { title: "Spread Calculation", content: "Spread = Stock A - (Hedge Ratio × Stock B). Hedge Ratio from linear regression minimizes spread variance." },
        { title: "Z-Score Entry", content: "Z-Score = (Current Spread - Mean Spread) / Std Dev. Enter when |Z| > 2, exit when Z crosses 0." },
        { title: "Position Sizing", content: "Equal dollar amounts in each leg. Adjust for beta to maintain market neutrality. Rebalance daily." }
      ],
      workflow: ["Screen for correlated pairs", "Test cointegration", "Calculate hedge ratio", "Monitor spread z-score", "Enter at |Z| > 2", "Long underperformer, short outperformer", "Exit at Z = 0 or stop at |Z| > 4"],
      complexity: "Expert",
      computationalLoad: "High",
      backtestPeriod: "36 months (2022-2024)"
    },
    rules: ["Entry: Z-score > 2 or < -2 on cointegrated pair", "Stop Loss: Z-score > 4 (divergence continues)", "Take Profit: Z-score crosses 0 (convergence)", "Pairs: Same sector, correlation > 0.8"],
    pros: ["Market neutral", "Consistent returns", "Low correlation to market", "Statistical edge"],
    cons: ["Requires two positions", "Correlation can break", "Needs margin", "Complex setup"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10480 }, { month: "Mar", value: 10920 },
      { month: "Apr", value: 11280 }, { month: "May", value: 11680 }, { month: "Jun", value: 12040 },
      { month: "Jul", value: 12380 }, { month: "Aug", value: 12760 }, { month: "Sep", value: 13120 },
      { month: "Oct", value: 13440 }, { month: "Nov", value: 13840 }, { month: "Dec", value: 14280 }
    ],
    monthly_returns: [
      { month: "Jan", return: 4.8 }, { month: "Feb", return: 4.2 }, { month: "Mar", return: 3.3 },
      { month: "Apr", return: 3.3 }, { month: "May", return: 3.1 }, { month: "Jun", return: 2.8 },
      { month: "Jul", return: 3.0 }, { month: "Aug", return: 2.9 }, { month: "Sep", return: 2.4 },
      { month: "Oct", return: 3.0 }, { month: "Nov", return: 2.9 }, { month: "Dec", return: 3.2 }
    ],
    trades: [{ type: "Win", count: 73 }, { type: "Loss", count: 27 }]
  },
  {
    id: 9,
    name: "Smart Money Concepts",
    market: "Forex",
    timeframe: "1H",
    win_rate: 66,
    profit_factor: 2.5,
    max_drawdown: 15.7,
    avg_return: 20.1,
    description: "Institutional trading strategy based on order blocks, fair value gaps, and liquidity grabs. Follows smart money footprints.",
    algorithm: {
      name: "Order Blocks & Fair Value Gap Detection",
      type: "Price Action & Institutional Flow",
      description: "Identifies institutional order blocks, fair value gaps (imbalance zones), and liquidity sweeps. Enters on retest of order blocks expecting continuation.",
      technicalDetails: [
        { title: "Order Block Identification", content: "Order Block = Last opposite-colored candle before strong impulse. Represents institutional accumulation/distribution zone." },
        { title: "Fair Value Gap (FVG)", content: "FVG = Gap between candle 1 high and candle 3 low (or vice versa). Represents imbalance. Price tends to fill gaps before continuing." },
        { title: "Liquidity Sweep", content: "Price briefly breaks obvious high/low to trigger stops, then reverses. Indicates smart money stop hunting before real move." },
        { title: "Break of Structure", content: "Price breaks previous higher high (bullish) or lower low (bearish). Confirms trend change. Entry after BOS with order block retest." }
      ],
      workflow: ["Identify market structure", "Mark order blocks", "Spot fair value gaps", "Wait for liquidity sweep", "Confirm break of structure", "Enter on order block retest", "Target opposite liquidity"],
      complexity: "Advanced",
      computationalLoad: "Medium",
      backtestPeriod: "24 months (2023-2024)"
    },
    rules: ["Entry: Liquidity sweep + BOS + Order block retest + FVG fill", "Stop Loss: Beyond order block", "Take Profit: Opposite liquidity pool or 3:1 R:R", "Filter: Only trade during London/NY sessions"],
    pros: ["Follows institutions", "High probability setups", "Clear structure", "Works on all pairs"],
    cons: ["Subjective interpretation", "Requires practice", "Patience needed", "Can miss fast moves"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10640 }, { month: "Mar", value: 11220 },
      { month: "Apr", value: 11580 }, { month: "May", value: 12280 }, { month: "Jun", value: 12780 },
      { month: "Jul", value: 12420 }, { month: "Aug", value: 13480 }, { month: "Sep", value: 14120 },
      { month: "Oct", value: 14580 }, { month: "Nov", value: 15380 }, { month: "Dec", value: 16240 }
    ],
    monthly_returns: [
      { month: "Jan", return: 6.4 }, { month: "Feb", return: 5.5 }, { month: "Mar", return: 3.2 },
      { month: "Apr", return: 6.1 }, { month: "May", return: 4.1 }, { month: "Jun", return: -2.8 },
      { month: "Jul", return: 8.5 }, { month: "Aug", return: 4.7 }, { month: "Sep", return: 3.3 },
      { month: "Oct", return: 5.5 }, { month: "Nov", return: 5.6 }, { month: "Dec", return: 5.6 }
    ],
    trades: [{ type: "Win", count: 66 }, { type: "Loss", count: 34 }]
  },
  {
    id: 10,
    name: "Machine Learning Momentum",
    market: "Crypto",
    timeframe: "1H",
    win_rate: 61,
    profit_factor: 2.6,
    max_drawdown: 20.3,
    avg_return: 24.7,
    description: "AI-powered momentum strategy using Random Forest classifier trained on 50+ technical indicators. Adapts to changing market conditions.",
    algorithm: {
      name: "Random Forest Multi-Indicator Classification",
      type: "Machine Learning & Momentum",
      description: "Trains Random Forest model on historical data with 50+ features (RSI, MACD, Bollinger, volume, etc.). Predicts next 4-hour price direction. Enters when model confidence > 70%.",
      technicalDetails: [
        { title: "Feature Engineering", content: "50+ features: RSI(14,21,28), MACD(12,26,9), BB(20,2), ATR(14), Volume ratios, Price rate of change, Moving average distances, Momentum oscillators." },
        { title: "Random Forest Model", content: "Ensemble of 100 decision trees. Each tree votes on price direction. Final prediction = majority vote. Confidence = % of trees agreeing." },
        { title: "Training Process", content: "Rolling window: Train on 6 months, test on 1 month. Retrain weekly. Prevents overfitting. Uses walk-forward optimization." },
        { title: "Risk Management", content: "Only trades when confidence > 70%. Position size scales with confidence. Higher confidence = larger position (max 3% risk)." }
      ],
      workflow: ["Collect 6 months historical data", "Calculate 50+ features", "Train Random Forest model", "Generate predictions", "Filter by confidence > 70%", "Enter with scaled position", "Retrain weekly"],
      complexity: "Expert",
      computationalLoad: "Very High",
      backtestPeriod: "24 months (2023-2024)"
    },
    rules: ["Entry: Model predicts direction with > 70% confidence", "Stop Loss: 2.5% from entry", "Take Profit: 5% target or model reverses", "Retrain: Weekly with new data"],
    pros: ["Adapts to market changes", "Uses multiple indicators", "Quantified confidence", "Systematic approach"],
    cons: ["Requires programming skills", "Computationally intensive", "Black box decisions", "Overfitting risk"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 11240 }, { month: "Mar", value: 9980 },
      { month: "Apr", value: 12680 }, { month: "May", value: 14520 }, { month: "Jun", value: 13180 },
      { month: "Jul", value: 15840 }, { month: "Aug", value: 14120 }, { month: "Sep", value: 17280 },
      { month: "Oct", value: 15640 }, { month: "Nov", value: 19480 }, { month: "Dec", value: 22140 }
    ],
    monthly_returns: [
      { month: "Jan", return: 12.4 }, { month: "Feb", return: -11.2 }, { month: "Mar", return: 27.1 },
      { month: "Apr", return: 14.5 }, { month: "May", return: -9.2 }, { month: "Jun", return: 20.2 },
      { month: "Jul", return: -10.9 }, { month: "Aug", return: 22.4 }, { month: "Sep", return: -9.5 },
      { month: "Oct", return: 24.6 }, { month: "Nov", return: 13.7 }, { month: "Dec", return: 13.7 }
    ],
    trades: [{ type: "Win", count: 61 }, { type: "Loss", count: 39 }]
  },
  {
    id: 11,
    name: "Elliott Wave Trader",
    market: "Forex",
    timeframe: "4H",
    win_rate: 59,
    profit_factor: 2.9,
    max_drawdown: 17.6,
    avg_return: 26.3,
    description: "Advanced wave analysis strategy based on Elliott Wave Theory. Identifies 5-wave impulse and 3-wave corrective patterns for high R:R trades.",
    algorithm: {
      name: "Elliott Wave Pattern Recognition",
      type: "Wave Analysis & Pattern Recognition",
      description: "Identifies Elliott Wave structures using Fibonacci ratios between waves. Enters at wave 3 start (after wave 2 correction) and wave 5 start. Uses Fibonacci extensions for targets.",
      technicalDetails: [
        { title: "Wave Identification", content: "Impulse: 5 waves (1-2-3-4-5). Corrective: 3 waves (A-B-C). Wave 3 is never shortest. Wave 4 doesn't overlap wave 1." },
        { title: "Fibonacci Ratios", content: "Wave 2 retraces 38.2-61.8% of Wave 1. Wave 3 extends 161.8% of Wave 1. Wave 4 retraces 38.2% of Wave 3." },
        { title: "Entry Timing", content: "Enter at end of Wave 2 correction (61.8% Fib of Wave 1). Target Wave 3 extension at 161.8% of Wave 1." },
        { title: "Invalidation Levels", content: "Wave 2 cannot exceed Wave 1 start. Wave 4 cannot enter Wave 1 territory. These are hard stop levels." }
      ],
      workflow: ["Identify Wave 1 impulse", "Wait for Wave 2 correction", "Measure Fibonacci retracement", "Enter at 61.8% retracement", "Target 161.8% extension", "Trail stop through Wave 4", "Exit at Wave 5 completion"],
      complexity: "Expert",
      computationalLoad: "Medium",
      backtestPeriod: "48 months (2020-2024)"
    },
    rules: ["Entry: Wave 2 retracement to 61.8% Fibonacci level", "Stop Loss: Below Wave 1 start", "Take Profit: 161.8% extension of Wave 1", "Filter: Only trade clear 5-wave structures"],
    pros: ["High R:R potential", "Clear invalidation levels", "Works on all timeframes", "Fibonacci precision"],
    cons: ["Highly subjective", "Requires expertise", "Wave counts can change", "Time-consuming analysis"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 11680 }, { month: "Mar", value: 10420 },
      { month: "Apr", value: 12840 }, { month: "May", value: 14280 }, { month: "Jun", value: 12980 },
      { month: "Jul", value: 15640 }, { month: "Aug", value: 13920 }, { month: "Sep", value: 16480 },
      { month: "Oct", value: 15120 }, { month: "Nov", value: 18240 }, { month: "Dec", value: 20680 }
    ],
    monthly_returns: [
      { month: "Jan", return: 16.8 }, { month: "Feb", return: -10.8 }, { month: "Mar", return: 23.2 },
      { month: "Apr", return: 11.2 }, { month: "May", return: -9.1 }, { month: "Jun", return: 20.5 },
      { month: "Jul", return: -10.9 }, { month: "Aug", return: 18.4 }, { month: "Sep", return: -8.3 },
      { month: "Oct", return: 20.6 }, { month: "Nov", return: 13.4 }, { month: "Dec", return: 13.4 }
    ],
    trades: [{ type: "Win", count: 59 }, { type: "Loss", count: 41 }]
  },
  {
    id: 12,
    name: "Multi-Timeframe Confluence",
    market: "Stocks",
    timeframe: "Daily",
    win_rate: 69,
    profit_factor: 2.2,
    max_drawdown: 13.4,
    avg_return: 17.9,
    description: "Systematic strategy combining signals from weekly, daily, and 4H timeframes. Only trades when all three timeframes align for maximum probability.",
    algorithm: {
      name: "Triple Timeframe Alignment System",
      type: "Multi-Timeframe Analysis",
      description: "Analyzes trend on weekly (200 EMA), momentum on daily (MACD + RSI), and entry on 4H (price action). Requires all three to align before entering. Reduces false signals significantly.",
      technicalDetails: [
        { title: "Weekly Trend Filter", content: "Price must be above 200 EMA on weekly chart for longs. Below for shorts. Sets overall directional bias." },
        { title: "Daily Momentum", content: "MACD histogram must be positive and rising. RSI between 50-70 for longs. Confirms momentum alignment." },
        { title: "4H Entry Trigger", content: "Wait for pullback to 20 EMA on 4H. Enter on bullish engulfing or pin bar at EMA. Tight stop below candle." },
        { title: "Position Management", content: "Scale in: 50% at entry, 50% on first pullback. Scale out: 50% at 2:1, trail remainder with 20 EMA." }
      ],
      workflow: ["Check weekly trend (200 EMA)", "Verify daily momentum (MACD+RSI)", "Wait for 4H pullback to 20 EMA", "Look for entry candle pattern", "Enter with 50% position", "Add on first pullback", "Trail with 20 EMA"],
      complexity: "Intermediate",
      computationalLoad: "Medium",
      backtestPeriod: "36 months (2022-2024)"
    },
    rules: ["Entry: Weekly trend + Daily momentum + 4H pullback to 20 EMA + Entry candle", "Stop Loss: Below entry candle low", "Take Profit: 50% at 2:1, trail rest", "Filter: Only S&P 500 stocks"],
    pros: ["High win rate", "Multiple confirmations", "Manageable drawdown", "Clear rules"],
    cons: ["Fewer signals", "Requires monitoring 3 timeframes", "Can miss fast moves", "Patience required"],
    equity: [
      { month: "Jan", value: 10000 }, { month: "Feb", value: 10580 }, { month: "Mar", value: 11120 },
      { month: "Apr", value: 11480 }, { month: "May", value: 12080 }, { month: "Jun", value: 12520 },
      { month: "Jul", value: 12240 }, { month: "Aug", value: 13180 }, { month: "Sep", value: 13840 },
      { month: "Oct", value: 14280 }, { month: "Nov", value: 14980 }, { month: "Dec", value: 15680 }
    ],
    monthly_returns: [
      { month: "Jan", return: 5.8 }, { month: "Feb", return: 5.1 }, { month: "Mar", return: 3.2 },
      { month: "Apr", return: 5.2 }, { month: "May", return: 3.7 }, { month: "Jun", return: -2.2 },
      { month: "Jul", return: 7.7 }, { month: "Aug", return: 5.0 }, { month: "Sep", return: 3.2 },
      { month: "Oct", return: 4.9 }, { month: "Nov", return: 4.7 }, { month: "Dec", return: 4.7 }
    ],
    trades: [{ type: "Win", count: 69 }, { type: "Loss", count: 31 }]
  }
];

async function seedStrategies() {
  console.log('🚀 Strategy Seeder');
  console.log('==================');
  console.log(`📡 Connecting to: ${process.env.SUPABASE_URL}`);

  // Test connection
  const { error: testError } = await supabase.from('strategies').select('id').limit(1);
  if (testError) {
    console.error('❌ Connection failed:', testError.message);
    console.log('\n💡 Make sure the strategies table exists (run database-setup.sql first)');
    process.exit(1);
  }
  console.log('✅ Connected successfully!\n');

  // Clear existing data
  console.log('🗑️  Clearing existing strategies...');
  const { error: deleteError } = await supabase.from('strategies').delete().neq('id', 0);
  if (deleteError) {
    console.error('❌ Failed to clear strategies:', deleteError.message);
    process.exit(1);
  }

  // Insert all strategies
  console.log(`📝 Inserting ${strategies.length} strategies...\n`);
  let successCount = 0;

  for (const strategy of strategies) {
    const { error } = await supabase.from('strategies').insert(strategy);
    if (error) {
      console.error(`❌ Failed to insert "${strategy.name}":`, error.message);
    } else {
      console.log(`✅ [${strategy.id}/12] ${strategy.name}`);
      successCount++;
    }
  }

  console.log(`\n🎉 Done! ${successCount}/${strategies.length} strategies seeded.`);
}

seedStrategies();
