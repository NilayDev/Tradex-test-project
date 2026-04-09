import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, Search, ChevronDown, X } from "lucide-react";

interface FilterProps {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  winRateRange: [number, number];
  setWinRateRange: (range: [number, number]) => void;
  profitFactorRange: [number, number];
  setProfitFactorRange: (range: [number, number]) => void;
  maxDrawdownRange: [number, number];
  setMaxDrawdownRange: (range: [number, number]) => void;
  selectedIndicators: string[];
  setSelectedIndicators: (indicators: string[]) => void;
  onClearAll: () => void;
}

const StrategyFilters = ({ 
  selectedMarket, 
  setSelectedMarket, 
  selectedTimeframe, 
  setSelectedTimeframe,
  searchQuery,
  setSearchQuery,
  winRateRange,
  setWinRateRange,
  profitFactorRange,
  setProfitFactorRange,
  maxDrawdownRange,
  setMaxDrawdownRange,
  selectedIndicators,
  setSelectedIndicators,
  onClearAll,
}: FilterProps) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const markets = ["All", "Crypto", "Forex", "Stocks"];
  const timeframes = ["All", "1H", "4H", "Daily", "Weekly"];
  const indicators = [
    "EMA", 
    "RSI", 
    "MACD", 
    "Bollinger Bands", 
    "Stochastic", 
    "Fibonacci", 
    "Ichimoku", 
    "ADX", 
    "Volume", 
    "Price Action"
  ];

  const toggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const hasActiveFilters = 
    selectedMarket !== "All" || 
    selectedTimeframe !== "All" || 
    searchQuery !== "" ||
    winRateRange[0] !== 0 || 
    winRateRange[1] !== 100 ||
    profitFactorRange[0] !== 0 ||
    profitFactorRange[1] !== 5 ||
    maxDrawdownRange[0] !== 0 ||
    maxDrawdownRange[1] !== 20 ||
    selectedIndicators.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Search & Filter</h3>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Search Strategies</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Market Filter */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Market</label>
          <div className="flex flex-wrap gap-2">
            {markets.map((market) => (
              <Badge
                key={market}
                variant={selectedMarket === market ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setSelectedMarket(market)}
              >
                {market}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeframe Filter */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((timeframe) => (
              <Badge
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Badge>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-6">
            {/* Win Rate Range */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Win Rate: {winRateRange[0]}% - {winRateRange[1]}%
              </label>
              <Slider
                value={winRateRange}
                onValueChange={(value) => setWinRateRange(value as [number, number])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Profit Factor Range */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Profit Factor: {profitFactorRange[0].toFixed(1)} - {profitFactorRange[1].toFixed(1)}
              </label>
              <Slider
                value={profitFactorRange}
                onValueChange={(value) => setProfitFactorRange(value as [number, number])}
                min={0}
                max={5}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Max Drawdown Range */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Max Drawdown: {maxDrawdownRange[0]}% - {maxDrawdownRange[1]}%
              </label>
              <Slider
                value={maxDrawdownRange}
                onValueChange={(value) => setMaxDrawdownRange(value as [number, number])}
                min={0}
                max={20}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Indicators Filter */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Indicators Used {selectedIndicators.length > 0 && `(${selectedIndicators.length})`}
              </label>
              <div className="flex flex-wrap gap-2">
                {indicators.map((indicator) => (
                  <Badge
                    key={indicator}
                    variant={selectedIndicators.includes(indicator) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default StrategyFilters;
