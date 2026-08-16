import { apiFetch } from "@/lib/api";
import { projectSelfUrl } from "@/lib/config";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  currency_code: string;
  is_archive: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export async function fetchProject(token: string | null): Promise<Project> {
  return apiFetch<Project>(projectSelfUrl(), { token });
}

export async function updateProjectCurrency(
  token: string | null,
  currencyCode: string,
): Promise<Project> {
  return apiFetch<Project>(projectSelfUrl(), {
    method: "PATCH",
    token,
    body: { currency_code: currencyCode },
  });
}
