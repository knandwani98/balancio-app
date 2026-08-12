export type Currency = {
  code: string;
  symbol: string;
};

/** Common currencies for personal finance. */
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "CHF", symbol: "CHF" },
  { code: "CNY", symbol: "¥" },
  { code: "SGD", symbol: "S$" },
  { code: "AED", symbol: "د.إ" },
  { code: "HKD", symbol: "HK$" },
];

export const DEFAULT_CURRENCY_CODE = "USD";

export function formatCurrencyLabel(currency: Currency): string {
  return `${currency.symbol} ${currency.code}`;
}
