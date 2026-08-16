function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function withTrailingSlash(value: string) {
  return `${trimSlash(value)}/`;
}

const DEFAULT_PROJECTS_API_URL =
  "https://balancio-api-tytu.onrender.com/api/v1/projects/";

/** Project-scoped API root, e.g. `https://host/api/v1/projects/`. */
export const API_BASE_URL = withTrailingSlash(
  process.env.EXPO_PUBLIC_BASE_API_URL ?? DEFAULT_PROJECTS_API_URL,
);

/** API host root, e.g. `https://host`. */
export const API_ORIGIN = trimSlash(
  API_BASE_URL.replace(/\/api\/v1\/projects\/?$/, ""),
);

export const HEALTH_URL = `${API_ORIGIN}/health`;

export const PROJECT_ID =
  process.env.EXPO_PUBLIC_PROJECT_ID ?? "74cf661c-9fb2-44dd-b1c9-cdf04d0ccb57";

export function projectResourceUrl(subpath: string) {
  const path = subpath.replace(/^\/+/, "");
  return `${API_BASE_URL}${PROJECT_ID}/${path}`;
}

/** Project record URL, e.g. `https://host/api/v1/projects/:id`. */
export function projectSelfUrl() {
  return `${API_BASE_URL}${PROJECT_ID}`;
}
