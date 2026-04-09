import { useState, useEffect } from "react";
import StrategyCard from "./StrategyCard";
import StrategyFilters from "./StrategyFilters";

const StrategyGrid = () => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [winRateRange, setWinRateRange] = useState<[number, number]>([0, 100]);
  const [profitFactorRange, setProfitFactorRange] = useState<[number, number]>([0, 5]);
  const [maxDrawdownRange, setMaxDrawdownRange] = useState<[number, number]>([0, 20]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/strategies');
        
        if (!response.ok) {
          throw new Error('Failed to fetch strategies');
        }
        
        const data = await response.json();
        
        // Convert snake_case to camelCase and add indicators
        let formattedStrategies = data.strategies.map((s: any) => ({
          id: s.id,
          name: s.name,
          market: s.market,
          timeframe: s.timeframe,
          winRate: s.win_rate,
          profitFactor: s.profit_factor,
          maxDrawdown: s.max_drawdown,
          avgReturn: s.avg_return,
          indicators: s.indicators || ["Technical Analysis"], // Default if not in DB
        }));

        setStrategies(formattedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        // Fallback to empty array on error
        setStrategies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const clearAllFilters = () => {
    setSelectedMarket("All");
    setSelectedTimeframe("All");
    setSearchQuery("");
    setWinRateRange([0, 100]);
    setProfitFactorRange([0, 5]);
    setMaxDrawdownRange([0, 20]);
    setSelectedIndicators([]);
  };

  const filteredStrategies = strategies.filter((strategy) => {
    // Search filter
    const searchMatch = searchQuery === "" || 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Market filter
    const marketMatch = selectedMarket === "All" || strategy.market === selectedMarket;
    
    // Timeframe filter
    const timeframeMatch = selectedTimeframe === "All" || strategy.timeframe === selectedTimeframe;
    
    // Win rate filter
    const winRateMatch = strategy.winRate >= winRateRange[0] && strategy.winRate <= winRateRange[1];
    
    // Profit factor filter
    const profitFactorMatch = strategy.profitFactor >= profitFactorRange[0] && 
      strategy.profitFactor <= profitFactorRange[1];
    
    // Max drawdown filter
    const drawdownMatch = strategy.maxDrawdown >= maxDrawdownRange[0] && 
      strategy.maxDrawdown <= maxDrawdownRange[1];
    
    // Indicators filter
    const indicatorMatch = selectedIndicators.length === 0 || 
      selectedIndicators.some(indicator => strategy.indicators.includes(indicator));

    return searchMatch && marketMatch && timeframeMatch && winRateMatch && 
           profitFactorMatch && drawdownMatch && indicatorMatch;
  });

  return (
    <section id="strategies" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Trading Strategies</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our collection of backtested strategies with real performance data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <StrategyFilters
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              winRateRange={winRateRange}
              setWinRateRange={setWinRateRange}
              profitFactorRange={profitFactorRange}
              setProfitFactorRange={setProfitFactorRange}
              maxDrawdownRange={maxDrawdownRange}
              setMaxDrawdownRange={setMaxDrawdownRange}
              selectedIndicators={selectedIndicators}
              setSelectedIndicators={setSelectedIndicators}
              onClearAll={clearAllFilters}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading strategies...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStrategies.map((strategy) => (
                    <StrategyCard key={strategy.id} {...strategy} />
                  ))}
                </div>

                {filteredStrategies.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      {strategies.length === 0 
                        ? 'No strategies available. Please seed the database first.'
                        : 'No strategies found with selected filters'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyGrid;
