import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

import { useSelectedCurrency } from "@/stores/settings";
import { themeColors } from "@/utils/constants";
import { formatMoney } from "@/utils/wealth";

type NetWorthContentProps = {
  amount: number;
  initialLoading?: boolean;
};

export function NetWorthContent({
  amount,
  initialLoading = false,
}: NetWorthContentProps) {
  const scheme = useColorScheme();
  const theme = themeColors(scheme);
  const currency = useSelectedCurrency();

  return (
    <View className="p-card">
      <View className="mb-2.5 flex-row items-center gap-1.5">
        <SymbolView
          name="chart.line.uptrend.xyaxis"
          size={13}
          tintColor={theme.muted}
          weight="semibold"
          fallback={
            <MaterialIcons name="trending-up" size={14} color={theme.muted} />
          }
        />
        <Text className="text-xs font-semibold uppercase tracking-label text-muted dark:text-[#AEAEB2]">
          My Net Worth
        </Text>
      </View>
      {initialLoading ? (
        <View className="min-h-[41px] justify-center">
          <ActivityIndicator size="small" color={theme.muted} />
        </View>
      ) : (
        <Text className="text-display font-bold tracking-display text-foreground tabular-nums dark:text-white">
          {formatMoney(amount, currency.symbol)}
        </Text>
      )}
    </View>
  );
}
