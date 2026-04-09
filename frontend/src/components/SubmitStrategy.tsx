import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const SubmitStrategy = () => {
  return (
    <section id="submit" className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Submit Your Strategy</h2>
          <p className="text-muted-foreground text-lg">
            Share your trading strategy and get a free professional backtest
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input id="strategy-name" placeholder="My Awesome Strategy" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market</Label>
              <Input id="market" placeholder="Crypto, Forex, or Stocks" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Strategy Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your entry rules, exit rules, indicators used, and any filters..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Chart or Script (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, PDF or TradingView Pine Script
                </p>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              Submit Strategy
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default SubmitStrategy;
