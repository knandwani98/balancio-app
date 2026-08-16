import { apiFetch } from "@/lib/api";
import { HEALTH_URL } from "@/lib/config";

export type HealthResponse = {
  status: "ok";
};

export function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>(HEALTH_URL, { token: null });
}
