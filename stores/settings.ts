import { create } from "zustand";

import {
  CURRENCIES,
  DEFAULT_CURRENCY_CODE,
  type Currency,
} from "@/utils/currencies";

type SettingsState = {
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  currencyCode: DEFAULT_CURRENCY_CODE,
  setCurrencyCode: (currencyCode) => set({ currencyCode }),
}));

export function useSelectedCurrency(): Currency {
  const currencyCode = useSettingsStore((state) => state.currencyCode);
  return CURRENCIES.find((currency) => currency.code === currencyCode) ?? CURRENCIES[0];
}
