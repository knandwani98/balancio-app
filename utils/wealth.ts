export const WEALTH_TOTALS = {
  assets: 312_450,
  liabilities: 31_280,
} as const;

export function formatMoney(amount: number, symbol: string) {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
