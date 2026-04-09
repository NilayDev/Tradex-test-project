import { Card } from "@/components/ui/card";
import { Code, LineChart, Mail, Trophy } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: LineChart,
      title: "Full Backtest Data",
      description: "Every strategy includes complete backtest results with equity curves, drawdown analysis, and performance metrics.",
    },
    {
      icon: Code,
      title: "TradingView Scripts",
      description: "Download Pine Script code for compatible strategies. Implement directly in your TradingView charts.",
    },
    {
      icon: Trophy,
      title: "Strategy of the Week",
      description: "Get weekly updates featuring our top-performing strategy with detailed analysis and setup guide.",
    },
    {
      icon: Mail,
      title: "Submit Your Strategy",
      description: "Share your trading strategy and get a free professional backtest from our team.",
    },
  ];

  return (
    <section id="features" className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Traders Choose Us</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional tools and data to help you make informed trading decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
