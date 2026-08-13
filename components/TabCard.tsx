import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { styled } from "nativewind";
import type { ReactNode } from "react";
import { Platform, useColorScheme, View } from "react-native";

import { themeColors } from "@/utils/constants";

const StyledGlassView = styled(GlassView);

const useGlass =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

type TabCardProps = {
  children: ReactNode;
  className?: string;
};

export function TabCard({ children, className }: TabCardProps) {
  const scheme = useColorScheme();
  const theme = themeColors(scheme);
  const baseClassName = `mt-4 overflow-hidden rounded-card border border-card-border p-1 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10 ${className ?? ""}`;

  if (useGlass) {
    return (
      <StyledGlassView
        className={`${baseClassName} bg-card`}
        glassEffectStyle="regular"
        isInteractive
        tintColor={theme.glassTint}
      >
        {children}
      </StyledGlassView>
    );
  }

  return (
    <View className={`${baseClassName} bg-transparent`}>{children}</View>
  );
}
