import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import type { ReactNode } from "react";
import { Platform, StyleSheet, useColorScheme, View, type ViewStyle } from "react-native";

import { cn } from "@/utils/cn";
import { themeColors } from "@/utils/constants";

const useGlass =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

const CARD_RADIUS = 28;

function continuousRadius(radius: number): ViewStyle {
  return {
    borderRadius: radius,
    borderCurve: "continuous",
  };
}

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  radius?: number;
};

export function GlassCard({ children, className, radius = CARD_RADIUS }: GlassCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = themeColors(scheme);
  const shape = continuousRadius(radius);
  const rim = isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.9)";

  return (
    <View
      className={cn(
        "elevation-sm",
        !useGlass && "bg-card dark:bg-white/10",
        className,
      )}
      style={[
        shape,
        {
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 8,
              blurRadius: 24,
              color: "rgba(0, 0, 0, 0.06)",
            },
            {
              offsetX: 0,
              offsetY: 0,
              blurRadius: 1.75,
              spreadDistance: 0.5,
              color: rim,
            },
          ],
        },
      ]}
    >
      {useGlass ? (
        <GlassView
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, shape, { overflow: "hidden" }]}
          glassEffectStyle="regular"
          isInteractive
          tintColor={theme.glassTint}
        />
      ) : null}
      {children}
    </View>
  );
}
