declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectMetaMask = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

export const checkMetaMaskConnection = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const sendPayment = async (walletAddress: string, amount: string) => {
  const transactionParameters = {
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Platform wallet address
    from: walletAddress,
    value: amount, // Amount in hex (wei)
  };

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  return txHash;
};

export const checkSubscription = () => {
  const subscription = localStorage.getItem('subscription');
  if (!subscription) return null;
  
  const sub = JSON.parse(subscription);
  const endDate = new Date(sub.endDate);
  const now = new Date();
  
  if (now > endDate) {
    return { ...sub, active: false, expired: true };
  }
  
  return sub;
};

export const isSubscriptionActive = () => {
  const sub = checkSubscription();
  return sub && sub.active && !sub.expired;
};
