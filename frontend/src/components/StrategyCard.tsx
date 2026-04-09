import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  id: number;
  name: string;
  market: string;
  timeframe: string;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  avgReturn: number;
}

const StrategyCard = ({
  id,
  name,
  market,
  timeframe,
  winRate,
  profitFactor,
  maxDrawdown,
  avgReturn,
}: StrategyCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group bg-gradient-to-br from-card to-card/50"
      onClick={() => navigate(`/strategy/${id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{market}</Badge>
            <Badge variant="outline">{timeframe}</Badge>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <BarChart2 className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Target className="w-3 h-3" />
            <span>Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-success">{winRate}%</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>Profit Factor</span>
          </div>
          <p className="text-2xl font-bold">{profitFactor}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <TrendingDown className="w-3 h-3" />
            <span>Max DD</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{maxDrawdown}%</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <BarChart2 className="w-3 h-3" />
            <span>Avg Return</span>
          </div>
          <p className="text-2xl font-bold text-success">+{avgReturn}%</p>
        </div>
      </div>
    </Card>
  );
};

export default StrategyCard;
