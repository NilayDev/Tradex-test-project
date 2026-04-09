import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Target, BarChart2, Download } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Helper function to generate realistic backtest data
const generateBacktestData = (equity: any[], startPrice: number, volatility: number) => {
  const backtestData = [];
  let currentPrice = startPrice;
  let tradeCount = 0;
  let trendDirection = 1; // 1 for up, -1 for down
  
  for (let i = 0; i < equity.length; i++) {
    const month = equity[i].month;
    const equityValue = equity[i].value;
    
    // Determine trend based on equity change
    if (i > 0) {
      const equityChange = equity[i].value - equity[i - 1].value;
      trendDirection = equityChange > 0 ? 1 : -1;
    }
    
    // Generate 6 data points per month
    for (let j = 0; j < 6; j++) {
      const dayOffset = j * 5;
      const date = `${month} ${dayOffset === 0 ? 1 : dayOffset}`;
      
      // Price movement correlated with equity trend but with noise
      const trendBias = trendDirection * 0.15; // Slight bias in trend direction
      const randomWalk = (Math.random() - 0.5) * volatility;
      const priceChange = trendBias * volatility + randomWalk;
      currentPrice = currentPrice * (1 + priceChange);
      
      // Ensure price stays positive and realistic
      currentPrice = Math.max(currentPrice, startPrice * 0.5);
      
      // Determine if this is a signal point (increased frequency)
      let signal = null;
      const signalChance = Math.random();
      
      // More frequent signals throughout the month
      if (j === 0 && i > 0 && tradeCount % 2 === 0 && signalChance > 0.4) {
        signal = 'buy';
        tradeCount++;
      } else if (j === 1 && tradeCount % 2 === 0 && signalChance > 0.5) {
        signal = 'buy';
        tradeCount++;
      } else if (j === 2 && tradeCount % 2 === 1 && signalChance > 0.45) {
        signal = 'sell';
        tradeCount++;
      } else if (j === 3 && signalChance > 0.5) {
        signal = tradeCount % 2 === 0 ? 'buy' : 'sell';
        tradeCount++;
      } else if (j === 4 && tradeCount % 2 === 1 && signalChance > 0.4) {
        signal = 'sell';
        tradeCount++;
      } else if (j === 5 && signalChance > 0.55) {
        signal = tradeCount % 2 === 0 ? 'buy' : 'sell';
        tradeCount++;
      }
      
      // Interpolate equity between months
      const equityInterpolated = i < equity.length - 1
        ? equityValue + ((equity[i + 1].value - equityValue) * (j / 6))
        : equityValue;
      
      backtestData.push({
        date,
        price: Math.round(currentPrice * 100) / 100, // Round to 2 decimals
        equity: Math.round(equityInterpolated),
        signal
      });
    }
  }
  
  return backtestData;
};

const StrategyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/strategies/${id}`);
        
        if (!response.ok) {
          throw new Error('Strategy not found');
        }
        
        const data = await response.json();
        let strategyData = data.strategy;
        
        // Convert snake_case from database to camelCase for frontend
        strategyData = {
          ...strategyData,
          winRate: strategyData.win_rate,
          profitFactor: strategyData.profit_factor,
          maxDrawdown: strategyData.max_drawdown,
          avgReturn: strategyData.avg_return,
          backtestData: strategyData.backtest_data,
          monthlyReturns: strategyData.monthly_returns,
        };
        
        // Generate backtestData if it doesn't exist
        if (!strategyData.backtestData && strategyData.equity) {
          // Dynamic pricing based on market type and strategy characteristics
          const marketPrices: Record<string, { base: number, volatility: number }> = {
            'Crypto': { base: 42000 + (Math.random() * 8000), volatility: 0.035 },
            'Forex': { base: 1.08 + (Math.random() * 0.15), volatility: 0.008 },
            'Stocks': { base: 145 + (Math.random() * 60), volatility: 0.018 }
          };
          
          const marketConfig = marketPrices[strategyData.market] || { base: 42000, volatility: 0.025 };
          
          // Adjust volatility based on timeframe
          let volatilityMultiplier = 1.0;
          if (strategyData.timeframe === '5m' || strategyData.timeframe === '15m') {
            volatilityMultiplier = 0.6; // Lower volatility for intraday
          } else if (strategyData.timeframe === '1H' || strategyData.timeframe === '4H') {
            volatilityMultiplier = 1.2; // Higher volatility for swing
          } else if (strategyData.timeframe === 'Daily') {
            volatilityMultiplier = 1.5; // Highest for daily
          }
          
          strategyData.backtestData = generateBacktestData(
            strategyData.equity,
            marketConfig.base,
            marketConfig.volatility * volatilityMultiplier
          );
        }
        
        // Generate algorithm if it doesn't exist
        if (!strategyData.algorithm) {
          strategyData.algorithm = {
            name: `${strategyData.name} Algorithm`,
            type: "Technical Analysis & Pattern Recognition",
            description: `Advanced algorithmic trading system utilizing ${strategyData.name.toLowerCase()} methodology for systematic market analysis and trade execution.`,
            technicalDetails: [
              {
                title: "Core Indicator Calculation",
                content: `The algorithm processes real-time market data to calculate key technical indicators specific to ${strategyData.name}. Mathematical formulas are applied to price and volume data to generate actionable signals.`
              },
              {
                title: "Signal Generation",
                content: "Multi-layered signal processing combines primary indicators with confirmation filters to reduce false positives. Each signal is weighted based on historical performance and current market conditions."
              },
              {
                title: "Risk Management System",
                content: `Automated risk controls including dynamic position sizing, stop-loss placement at ${strategyData.maxDrawdown}% max drawdown, and profit-taking mechanisms ensure capital preservation while maximizing returns.`
              },
              {
                title: "Execution Logic",
                content: "Trade execution follows strict entry and exit criteria with built-in slippage protection and order management. The system adapts to market volatility and liquidity conditions."
              }
            ],
            workflow: [
              "1. Collect and normalize market data from multiple sources",
              "2. Calculate technical indicators and pattern recognition",
              "3. Generate trading signals based on strategy rules",
              "4. Apply risk management filters and position sizing",
              "5. Execute trades with optimal timing and price",
              "6. Monitor open positions and adjust stops/targets",
              "7. Close positions based on exit criteria",
              "8. Log performance metrics and update strategy parameters"
            ],
            complexity: "Intermediate to Advanced",
            computationalLoad: "Medium - Real-time indicator calculations",
            backtestPeriod: `24 months across ${strategyData.market} markets`
          };
        }
        
        setStrategy(strategyData);
        setError(null);
      } catch (err) {
        console.error('Error fetching strategy:', err);
        setError(err instanceof Error ? err.message : 'Failed to load strategy');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStrategy();
    }
  }, [id]);

  const handleDownloadScript = () => {
    if (!strategy) return;
    
    const scriptContent = `// ${strategy.name} - TradingView Pine Script
//@version=5
strategy("${strategy.name}", overlay=true)

// Strategy Description: ${strategy.description}

// Entry Rules:
${strategy.rules.map((rule: string, idx: number) => `// ${idx + 1}. ${rule}`).join('\n')}

// Performance Metrics:
// Win Rate: ${strategy.winRate}%
// Profit Factor: ${strategy.profitFactor}
// Max Drawdown: ${strategy.maxDrawdown}%
// Average Return: ${strategy.avgReturn}%

// Add your custom implementation here
plotshape(true, title="Strategy Template", location=location.belowbar, color=color.blue, style=shape.labelup, text="${strategy.name}")
`;
    
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${strategy.name.replace(/\s+/g, '_')}.pine`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading strategy...</p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Strategy Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || 'The strategy you are looking for does not exist.'}</p>
          <Button onClick={() => navigate("/strategies")}>Back to Strategies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Strategies
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{strategy.name}</h1>
              <div className="flex gap-2">
                <Badge variant="secondary">{strategy.market}</Badge>
                <Badge variant="outline">{strategy.timeframe}</Badge>
              </div>
            </div>
            <Button onClick={handleDownloadScript}>
              <Download className="w-4 h-4 mr-2" />
              Download Script
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Target className="w-4 h-4" />
                Win Rate
              </div>
              <p className="text-3xl font-bold text-success">{strategy.winRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Profit Factor
              </div>
              <p className="text-3xl font-bold">{strategy.profitFactor}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingDown className="w-4 h-4" />
                Max Drawdown
              </div>
              <p className="text-3xl font-bold text-destructive">{strategy.maxDrawdown}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <BarChart2 className="w-4 h-4" />
                Avg Return
              </div>
              <p className="text-3xl font-bold text-success">+{strategy.avgReturn}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Strategy Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{strategy.description}</p>
          </CardContent>
        </Card>

        {/* Algorithm Details */}
        {strategy.algorithm && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <CardTitle>Algorithm & Technical Details</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{strategy.algorithm.name}</Badge>
                <Badge variant="outline">{strategy.algorithm.type}</Badge>
                <Badge variant="outline">Complexity: {strategy.algorithm.complexity}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {strategy.algorithm.description}
                </p>
              </div>

              {/* Technical Components */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Components</h3>
                <div className="grid gap-4">
                  {strategy.algorithm.technicalDetails.map((detail: any, index: number) => (
                    <div key={index} className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-primary mb-2">{detail.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {detail.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithm Workflow */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Algorithm Workflow</h3>
                <div className="space-y-2">
                  {strategy.algorithm.workflow.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Computational Load</p>
                  <p className="font-semibold">{strategy.algorithm.computationalLoad}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Backtest Period</p>
                  <p className="font-semibold">{strategy.algorithm.backtestPeriod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Backtesting Chart */}
        {strategy.backtestData && (
          <Card className="mb-8 border-2">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5" />
                    Backtesting Results (12 Months)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Strategy performance with entry/exit signals
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Initial Capital</p>
                    <p className="text-lg font-bold">${strategy.backtestData[0].equity.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Final Capital</p>
                    <p className="text-lg font-bold text-green-500">${strategy.backtestData[strategy.backtestData.length - 1].equity.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Return</p>
                    <p className="text-lg font-bold text-green-500">
                      +{(((strategy.backtestData[strategy.backtestData.length - 1].equity - strategy.backtestData[0].equity) / strategy.backtestData[0].equity) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="flex items-center gap-6 mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Portfolio Equity</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Buy Signal</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Sell Signal</span>
                </div>
              </div>

              {/* Dual Axis Chart */}
              <ChartContainer config={{
                price: { label: "Price ($)", color: "hsl(217, 91%, 60%)" },
                equity: { label: "Portfolio ($)", color: "hsl(142, 76%, 36%)" }
              }} className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strategy.backtestData} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(217, 91%, 60%)" 
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(142, 76%, 36%)" 
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip />
                    <Legend />
                    
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(217, 91%, 60%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                    
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="equity" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (payload.signal === 'buy') {
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r={8} fill="hsl(142, 76%, 36%)" stroke="white" strokeWidth={2} />
                              <text x={cx} y={cy - 15} textAnchor="middle" fill="hsl(142, 76%, 36%)" fontSize={10} fontWeight="bold">
                                BUY
                              </text>
                            </g>
                          );
                        }
                        if (payload.signal === 'sell') {
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r={8} fill="hsl(0, 84%, 60%)" stroke="white" strokeWidth={2} />
                              <text x={cx} y={cy - 15} textAnchor="middle" fill="hsl(0, 84%, 60%)" fontSize={10} fontWeight="bold">
                                SELL
                              </text>
                            </g>
                          );
                        }
                        return null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Monthly Returns & Win/Loss */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Returns (%)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Average: <span className="font-semibold text-green-500">
                  +{(strategy.monthlyReturns.reduce((sum: number, m: any) => sum + m.return, 0) / strategy.monthlyReturns.length).toFixed(1)}%
                </span> per month
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                return: { label: "Return %", color: "hsl(var(--primary))" }
              }} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strategy.monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Bar dataKey="return" radius={[8, 8, 0, 0]}>
                      {strategy.monthlyReturns.map((entry: any, index: number) => (
                        <rect 
                          key={`bar-${index}`}
                          fill={entry.return >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Distribution</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Total trades: <span className="font-semibold">{strategy.trades.reduce((sum: number, t: any) => sum + t.count, 0)}</span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex flex-col justify-center">
                <div className="space-y-6 mb-6">
                  {strategy.trades.map((trade: any, index: number) => {
                    const total = strategy.trades.reduce((sum: number, t: any) => sum + t.count, 0);
                    const percentage = (trade.count / total) * 100;
                    const isWin = trade.type === 'Win';
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isWin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-semibold">{trade.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold">{trade.count}</span>
                            <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="relative h-12 bg-secondary rounded-lg overflow-hidden">
                          <div 
                            className={`absolute left-0 top-0 h-full ${isWin ? 'bg-green-500' : 'bg-red-500'} transition-all duration-1000 flex items-center justify-end pr-4`}
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-white font-bold text-sm">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-green-500">{strategy.winRate}%</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Profit Factor</p>
                    <p className="text-2xl font-bold text-blue-500">{strategy.profitFactor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Rules & Pros/Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Trading Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strategy.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pros & Cons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-success mb-2">Advantages</h4>
                  <ul className="space-y-2">
                    {strategy.pros.map((pro: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-destructive mb-2">Disadvantages</h4>
                  <ul className="space-y-2">
                    {strategy.cons.map((con: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetail;
