import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Subscription {
  active: boolean;
  isTrial: boolean;
  startDate: string;
  endDate: string;
  plan: string;
  expired?: boolean;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '', isPremium: false });

  useEffect(() => {
    const sub = localStorage.getItem('subscription');
    if (sub) {
      const parsed: Subscription = JSON.parse(sub);
      const expired = new Date() > new Date(parsed.endDate);
      if (!expired && parsed.active) setCurrentPlan(parsed.plan);
    }
  }, []);

  const activate = async (plan: string, isTrial: boolean, days: number, isPremium: boolean) => {
    setIsLoading(plan);
    try {
      await new Promise(res => setTimeout(res, 900));
      const subscription: Subscription = {
        active: true,
        isTrial,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        plan,
      };
      localStorage.setItem('subscription', JSON.stringify(subscription));
      setCurrentPlan(plan);
      setSuccessModal({
        isOpen: true,
        title: isTrial ? 'Free Trial Activated!' : `${plan} Activated!`,
        message: isTrial
          ? 'Your 30-day free trial is now active. Enjoy full access to all strategies!'
          : `Welcome to ${plan}! You now have full access to all premium features.`,
        isPremium,
      });
    } catch {
      setErrorModal({ isOpen: true, title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      key: 'Free Trial',
      label: 'Free Trial',
      subtitle: 'Perfect to get started',
      icon: Sparkles,
      iconBg: 'bg-indigo-600',
      badge: null,
      originalPrice: null,
      price: '$0',
      priceSub: '/month',
      saving: null,
      cta: 'Current Plan',
      ctaAction: () => activate('Free Trial', true, 30, false),
      ctaClass: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      features: [
        'Access to 12 professional trading strategies',
        'Real-time backtesting results',
        'Basic algorithm details',
        'Community discussions',
        'Portfolio tracking dashboard',
        'Strategy download scripts',
        'Email support',
        '30-day trial period',
      ],
      cardClass: 'bg-[#1a1f2e] border border-white/10',
      isTrial: true,
      days: 30,
      isPremium: false,
    },
    {
      key: 'Premium',
      label: 'Premium',
      subtitle: 'For serious traders',
      icon: Crown,
      iconBg: 'bg-yellow-500',
      badge: { text: '★ MOST POPULAR', class: 'bg-yellow-500 text-black' },
      originalPrice: '$99',
      price: '$50',
      priceSub: '/month',
      saving: 'Save 50% — Limited Time',
      cta: 'Upgrade to Premium',
      ctaAction: () => activate('Premium', false, 30, true),
      ctaClass: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-black font-bold',
      features: [
        'Access to 50+ professional trading strategies',
        '2 NEW strategies added DAILY',
        'Real-time backtesting with live data',
        'Advanced algorithm details & source code',
        'AI-powered strategy recommendations',
        'Custom strategy builder tool',
        'Automated trading bot integration',
        'Advanced risk management tools',
        'Real-time market alerts & signals',
        'Priority support',
      ],
      cardClass: 'bg-[#1a1f2e] border-2 border-yellow-500/60',
      isTrial: false,
      days: 30,
      isPremium: true,
    },
    {
      key: 'Elite',
      label: 'Elite',
      subtitle: 'For professional traders',
      icon: Zap,
      iconBg: 'bg-purple-600',
      badge: { text: '⚡ ELITE', class: 'bg-purple-600 text-white' },
      originalPrice: '$199',
      price: '$99',
      priceSub: '/month',
      saving: '5 strategies daily',
      cta: 'Upgrade to Elite',
      ctaAction: () => activate('Elite', false, 30, true),
      ctaClass: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold',
      features: [
        'Custom strategy development service',
        'White-label trading bot',
        'Priority algorithm requests',
        'Advanced AI portfolio manager',
        'Hedge fund-level risk analytics',
        'Direct access to strategy developers',
        'VIP community & networking events',
        'Unlimited API calls',
        'Revenue sharing opportunities',
      ],
      cardClass: 'bg-[#1a1f2e] border-2 border-purple-500/60',
      isTrial: false,
      days: 30,
      isPremium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Header />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => { setSuccessModal({ ...successModal, isOpen: false }); navigate('/dashboard'); }}
        title={successModal.title}
        message={successModal.message}
        isPremium={successModal.isPremium}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold text-white mb-3">Upgrade Your Plan</h1>
          <p className="text-gray-400 text-lg">Unlock more strategies and premium features with an upgrade</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.key;
            const loading = isLoading === plan.key;

            return (
              <div key={plan.key} className={`relative rounded-2xl p-6 flex flex-col ${plan.cardClass}`}>
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.badge.class}`}>
                      {plan.badge.text}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-1">{plan.label}</h2>
                <p className="text-gray-400 text-sm mb-4">{plan.subtitle}</p>

                {/* Price */}
                <div className="mb-2">
                  {plan.originalPrice && (
                    <span className="text-gray-500 line-through text-lg mr-2">{plan.originalPrice}</span>
                  )}
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.priceSub}</span>
                </div>
                {plan.saving && (
                  <p className={`text-sm font-semibold mb-5 ${plan.isPremium ? 'text-yellow-400' : 'text-purple-400'}`}>
                    {plan.saving}
                  </p>
                )}
                {!plan.saving && <div className="mb-5" />}

                {/* CTA Button */}
                <Button
                  className={`w-full mb-2 py-5 text-base rounded-xl ${
                    isCurrentPlan
                      ? 'bg-white/10 text-white border border-white/20 cursor-default'
                      : plan.isTrial
                      ? plan.ctaClass
                      : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                  }`}
                  disabled={loading || isCurrentPlan || !plan.isTrial}
                  onClick={isCurrentPlan || !plan.isTrial ? undefined : plan.ctaAction}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />Processing...</>
                  ) : isCurrentPlan ? (
                    <><Check className="w-4 h-4 mr-2" />Current Plan</>
                  ) : !plan.isTrial ? (
                    <>🔒 Payment Coming Soon</>
                  ) : (
                    plan.cta
                  )}
                </Button>
                {!plan.isTrial && !isCurrentPlan && (
                  <p className="text-xs text-gray-600 text-center mb-4">Payment integration in progress</p>
                )}
                {(plan.isTrial || isCurrentPlan) && <div className="mb-4" />}

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
