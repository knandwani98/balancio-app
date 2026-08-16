import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

import { fetchProject } from "@/lib/project";
import { useSettingsStore } from "@/stores/settings";
import { DEFAULT_CURRENCY_CODE, isSupportedCurrencyCode } from "@/utils/currencies";

/** Loads the project's currency from the API into Zustand on sign-in. */
export function useSyncProjectCurrency() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const setCurrencyCode = useSettingsStore((state) => state.setCurrencyCode);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        const project = await fetchProject(token);
        if (cancelled) return;

        const code = isSupportedCurrencyCode(project.currency_code)
          ? project.currency_code
          : DEFAULT_CURRENCY_CODE;
        setCurrencyCode(code);
      } catch {
        // Keep the in-memory default when the project cannot be loaded yet.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, setCurrencyCode]);
}
