import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api";
import {
  fetchInvestmentPlans,
  type InvestmentPlanSummary,
} from "@/lib/investmentPlans";

export function useInvestmentPlans() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [plans, setPlans] = useState<InvestmentPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const load = useCallback(async (options?: { showLoading?: boolean }) => {
    if (!isSignedIn) {
      setPlans([]);
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
      const data = await fetchInvestmentPlans(token);
      if (requestId !== requestIdRef.current) return;

      setPlans(data);
      hasLoadedRef.current = true;
      setHasLoaded(true);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;

      if (hasLoadedRef.current) {
        setError("Could not refresh investments");
      } else {
        setPlans([]);
        if (e instanceof ApiError && e.status === 401) {
          setError("Sign in to load investments");
        } else {
          setError("Could not load investments");
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

  return { plans, initialLoading, error, reload };
}
