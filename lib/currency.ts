const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? 'CHF';

export function formatMoney(amount: number, currency?: string) {
  const curr = currency ?? DEFAULT_CURRENCY;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback: simple rendering
    return `${amount.toFixed(2)} ${curr}`;
  }
}

export { DEFAULT_CURRENCY };

export function getPreferredCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  try {
    return (globalThis.localStorage.getItem('breitling_currency') as string) || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function setPreferredCurrency(currency: string) {
  if (typeof window === 'undefined') return;
  try {
    globalThis.localStorage.setItem('breitling_currency', currency);
  } catch {
    // ignore
  }
}
