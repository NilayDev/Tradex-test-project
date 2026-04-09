import Header from '@/components/Header';
import StrategyGrid from '@/components/StrategyGrid';

const Strategies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trading Strategies</h1>
          <p className="text-muted-foreground">Browse and discover proven trading strategies</p>
        </div>
        <StrategyGrid />
      </div>
    </div>
  );
};

export default Strategies;
