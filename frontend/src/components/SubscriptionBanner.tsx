import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Crown } from 'lucide-react';
import { checkSubscription } from '@/lib/metamask';

const SubscriptionBanner = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sub = checkSubscription();
    if (sub && sub.active && !sub.expired) {
      const days = Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
      
      // Show banner if less than 7 days left
      if (days <= 7) {
        setShowBanner(true);
      }
    }
  }, []);

  if (!showBanner || daysLeft === null) return null;

  return (
    <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-700 dark:text-yellow-400">
          Your subscription expires in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>. 
          Renew now to continue accessing premium strategies.
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="ml-4 bg-yellow-500 hover:bg-yellow-600"
        >
          <Crown className="w-4 h-4 mr-2" />
          Renew Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionBanner;
