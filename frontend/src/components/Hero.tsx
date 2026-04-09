import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary">50+ Proven Strategies</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Discover Trading Strategies with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Real Backtest Data
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore battle-tested trading strategies across crypto, forex, and stocks. 
          Each strategy includes detailed rules, backtest results, and performance metrics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Strategies
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
            Submit Your Strategy
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Full Backtests</h3>
            <p className="text-sm text-muted-foreground">Complete performance data</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold">Proven Results</h3>
            <p className="text-sm text-muted-foreground">Real market-tested strategies</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold">Risk Metrics</h3>
            <p className="text-sm text-muted-foreground">Detailed drawdown analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
