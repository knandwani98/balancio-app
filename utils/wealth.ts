export const WEALTH_TOTALS = {
  assets: 312_450,
  liabilities: 31_280,
} as const;

export type InvestmentAssetType = {
  key: string;
  label: string;
};

export const INVESTMENT_ASSET_TYPES: InvestmentAssetType[] = [
  { key: "stocks", label: "Stocks" },
  { key: "mutual-funds", label: "Mutual Funds" },
  { key: "fixed-recurring-deposits", label: "Fixed & Recurring Deposits" },
  { key: "digital-assets", label: "Digital Assets" },
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
  { key: "bonds", label: "Bonds" },
  { key: "nps", label: "NPS" },
  { key: "epf-ppf", label: "EPF / PPF" },
];

export const INVESTMENT_ASSET_PREVIEW_COUNT = 3;

export function formatMoney(amount: number, symbol: string) {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
