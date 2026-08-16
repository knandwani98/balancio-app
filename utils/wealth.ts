export type InvestmentAssetType = {
  key: string;
  label: string;
};

export const INVESTMENT_ASSET_TYPES: InvestmentAssetType[] = [
  { key: "mutual-funds", label: "Mutual Funds" },
  { key: "stocks", label: "Stocks" },
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

export function isPlanNameTracked(name: string, trackedNames: string[]) {
  return trackedNames.some(
    (tracked) => tracked.localeCompare(name, undefined, { sensitivity: "accent" }) === 0,
  );
}
