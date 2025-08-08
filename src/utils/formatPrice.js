// Minimal price formatter with locale/currency handling
export function formatPrice(amount, { locale = navigator.language || 'en-US', currency = 'USD' } = {}) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return '—';
  }
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

