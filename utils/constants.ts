import { type ColorSchemeName } from "react-native";

export const colors = {
  canvas: "#F2F2F7",
  muted: "#8E8E93",
  foreground: "#1C1C1E",
  ink: "#111827",
  glassTint: "rgba(255, 255, 255, 0.35)",
  card: "rgba(255, 255, 255, 0.72)",
  "card-border": "rgba(255, 255, 255, 0.85)",
} as const;

export function themeColors(scheme: ColorSchemeName) {
  const isDark = scheme === "dark";

  return {
    muted: isDark ? "#AEAEB2" : colors.muted,
    glassTint: isDark ? "rgba(255, 255, 255, 0.12)" : colors.glassTint,
    // Active pill stays light; label on it stays dark in both schemes.
    tabIndicator: isDark ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.9)",
    tabActive: colors.foreground,
    tabInactive: isDark ? "#EBEBF5" : colors.muted,
  } as const;
}

export const spacing = {
  card: "22px",
} as const;

export const borderRadius = {
  card: "28px",
} as const;

export const fontSize = {
  display: "34px",
  heading: "28px",
} as const;

export const letterSpacing = {
  label: "1.1px",
  display: "-0.8px",
} as const;

export const boxShadow = {
  card: "0 8px 24px rgba(0, 0, 0, 0.06)",
} as const;
