export type NetworthResponse = {
  assets: number;
  liabilities: number;
  networth: number;
};

export type WealthTotals = NetworthResponse;

export const EMPTY_WEALTH_TOTALS: WealthTotals = {
  assets: 0,
  liabilities: 0,
  networth: 0,
};

export function mapNetworthResponse(data: NetworthResponse): WealthTotals {
  return {
    assets: data.assets,
    liabilities: data.liabilities,
    networth: data.networth,
  };
}
