import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  Pressable,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { Hairline } from "@/components/Hairline";
import {
  SelectBottomSheet,
  type SelectBottomSheetRef,
} from "@/components/SelectBottomSheet";
import { updateProjectCurrency } from "@/lib/project";
import { useSelectedCurrency, useSettingsStore } from "@/stores/settings";
import { toast } from "@/stores/toast";
import { themeColors } from "@/utils/constants";
import { CURRENCIES, formatCurrencyLabel } from "@/utils/currencies";

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: formatCurrencyLabel(currency),
}));

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = themeColors(scheme);
  const currencySheetRef = useRef<SelectBottomSheetRef>(null);
  const { getToken } = useAuth();
  const [isUpdatingCurrency, setIsUpdatingCurrency] = useState(false);

  const currencyCode = useSettingsStore((state) => state.currencyCode);
  const setCurrencyCode = useSettingsStore((state) => state.setCurrencyCode);
  const selectedLabel = formatCurrencyLabel(useSelectedCurrency());

  const handleCurrencySelect = useCallback(
    async (code: string) => {
      if (code === currencyCode) {
        return;
      }

      const previousCode = currencyCode;
      const nextCurrency = CURRENCIES.find((currency) => currency.code === code);
      setCurrencyCode(code);
      setIsUpdatingCurrency(true);

      try {
        const token = await getToken();
        await updateProjectCurrency(token, code);
        toast.success(
          nextCurrency
            ? `Currency updated to ${formatCurrencyLabel(nextCurrency)}`
            : "Currency updated",
        );
      } catch (error) {
        setCurrencyCode(previousCode);
        toast.error("Couldn't update currency");
        throw error;
      } finally {
        setIsUpdatingCurrency(false);
      }
    },
    [currencyCode, getToken, setCurrencyCode],
  );

  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(60,60,67,0.18)";

  const rows = (
    <>
      <View className="flex-row items-center justify-between px-4 py-3.5">
        <Text className="text-[17px] font-normal text-foreground dark:text-white">
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={(value) => {
            Appearance.setColorScheme(value ? "dark" : "light");
          }}
        />
      </View>
      <Hairline color={dividerColor} inset={16} />
      <Pressable
        onPress={() => {
          if (isUpdatingCurrency) {
            return;
          }
          currencySheetRef.current?.present();
        }}
        className="flex-row items-center justify-between px-4 py-3.5"
        accessibilityRole="button"
        accessibilityState={{ busy: isUpdatingCurrency, disabled: isUpdatingCurrency }}
        accessibilityLabel={`Currency, ${selectedLabel}`}
      >
        <Text className="text-[17px] font-normal text-foreground dark:text-white">
          Currency
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text style={{ color: theme.muted, fontSize: 17 }}>{selectedLabel}</Text>
          {isUpdatingCurrency ? (
            <ActivityIndicator size="small" color={theme.muted} />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" size={22} color={theme.muted} />
          )}
        </View>
      </Pressable>
    </>
  );

  return (
    <Screen title="Settings">
      <View className="px-4 pt-1">
        <GlassCard radius={16}>{rows}</GlassCard>
      </View>

      <SelectBottomSheet
        ref={currencySheetRef}
        title="Currency"
        options={CURRENCY_OPTIONS}
        selectedValue={currencyCode}
        onSelect={handleCurrencySelect}
      />
    </Screen>
  );
}
