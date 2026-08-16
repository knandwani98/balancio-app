import { useSelectedCurrency } from "@/stores/settings";
import { formatMoney } from "@/utils/wealth";
import type { ReactNode } from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { themeColors } from "@/utils/constants";
import { cn } from "@/utils/cn";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { Hairline } from "../Hairline";

type WealthTabPanelProps = {
  tabKey: string;
  direction: number;
  title: string;
  amount?: number;
  showAmount?: boolean;
  initialLoading?: boolean;
  children: ReactNode;
  className?: string;
};

export function WealthTabPanel({
  tabKey,
  direction,
  title,
  amount = 0,
  showAmount = true,
  initialLoading = false,
  children,
  className,
}: WealthTabPanelProps) {
  const scheme = useColorScheme();
  const theme = themeColors(scheme);
  const currency = useSelectedCurrency();

  return (
    <GlassCard className={cn("mt-4 p-4", className)}>
      <Animated.View
        key={tabKey}
        entering={(direction >= 0 ? FadeInRight : FadeInLeft).duration(220)}
        exiting={(direction >= 0 ? FadeOutLeft : FadeOutRight).duration(160)}
      >
        <Text className="text-lg font-semibold text-foreground dark:text-white">
          {title}
        </Text>
        {showAmount ? (
          initialLoading ? (
            <View className="mb-3 min-h-8 justify-center">
              <ActivityIndicator size="small" color={theme.muted} />
            </View>
          ) : (
            <Text className="mb-3 text-2xl font-bold text-foreground dark:text-white">
              {formatMoney(amount, currency.symbol)}
            </Text>
          )
        ) : null}
        <Hairline />
        {children}
      </Animated.View>
    </GlassCard>
  );
}
