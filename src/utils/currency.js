// Simple currency conversion utility relative to USD base
const RATES = { USD: 1, EUR: 0.92, GBP: 0.78 };

export function convertCurrency(amount, from = 'USD', to = 'USD') {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 0;
  if (from === to) return amount;
  const fromRate = RATES[from] ?? 1;
  const toRate = RATES[to] ?? 1;
  // Normalize to USD, then to target
  const amountInUSD = amount / fromRate; // since RATES are relative to USD
  return amountInUSD * toRate;
}

export const SUPPORTED_CURRENCIES = Object.keys(RATES);

