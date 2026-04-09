import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-4">Join Our Waitlist</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Get early access to our advanced backtester and receive weekly strategy updates
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Join Waitlist
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Join 2,500+ traders already on the waitlist
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
