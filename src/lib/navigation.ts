const protectedRouteRoots = new Set([
  "analytics",
  "bookmarks",
  "checkout",
  "dashboard",
  "learn",
  "mocks",
  "notes",
  "notifications",
  "planner",
  "practice",
  "profile",
  "rank-map",
  "results",
  "settings",
  "simulations",
]);

/** Keep post-auth redirects inside a known protected area of this app. */
export function safeReturnTo(value: string | null | undefined, fallback = "/dashboard") {
  if (!value?.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  const root = value.split(/[/?#]/).filter(Boolean)[0];
  return root && protectedRouteRoots.has(root) ? value : fallback;
}
