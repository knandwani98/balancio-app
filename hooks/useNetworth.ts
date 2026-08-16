import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { projectResourceUrl } from "@/lib/config";
import {
  EMPTY_WEALTH_TOTALS,
  mapNetworthResponse,
  type NetworthResponse,
  type WealthTotals,
} from "@/lib/networth";

export function useNetworth() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [totals, setTotals] = useState<WealthTotals>(EMPTY_WEALTH_TOTALS);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const load = useCallback(async (options?: { showLoading?: boolean }) => {
    if (!isSignedIn) {
      setTotals(EMPTY_WEALTH_TOTALS);
      setLoading(false);
      setHasLoaded(false);
      hasLoadedRef.current = false;
      return;
    }

    const requestId = ++requestIdRef.current;
    const showLoading = options?.showLoading ?? !hasLoadedRef.current;

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const token = await getTokenRef.current();
      const data = await apiFetch<NetworthResponse>(projectResourceUrl("networth"), {
        token,
      });
      if (requestId !== requestIdRef.current) return;

      setTotals(mapNetworthResponse(data));
      hasLoadedRef.current = true;
      setHasLoaded(true);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;

      if (hasLoadedRef.current) {
        setError("Could not refresh net worth");
      } else {
        setTotals(EMPTY_WEALTH_TOTALS);
        if (e instanceof ApiError && e.status === 401) {
          setError("Sign in to load net worth");
        } else {
          setError("Could not load net worth");
        }
        setHasLoaded(true);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    void load();
  }, [isLoaded, isSignedIn, load]);

  const reload = useCallback(() => load({ showLoading: true }), [load]);

  const initialLoading = !isLoaded || (!hasLoaded && loading);

  return { totals, initialLoading, refreshing: hasLoaded && loading, error, reload };
}
