import { apiFetch } from "@/lib/api";
import { projectResourceUrl } from "@/lib/config";

export type InvestmentPlanSummary = {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  period_amount: number;
  current_value: number;
  invested: number;
  holding_count: number;
  point_count: number;
  created_at: string;
  updated_at: string;
};

export async function fetchInvestmentPlans(
  token: string | null,
): Promise<InvestmentPlanSummary[]> {
  return apiFetch<InvestmentPlanSummary[]>(
    projectResourceUrl("investment-plans"),
    { token },
  );
}

export function sortPlansByValue(
  plans: InvestmentPlanSummary[],
): InvestmentPlanSummary[] {
  return [...plans].sort((a, b) => b.current_value - a.current_value);
}
