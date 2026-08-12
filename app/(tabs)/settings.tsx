import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { styled } from "nativewind";
import { useRef } from "react";
import {
  Appearance,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Screen } from "@/components/Screen";
import {
  SelectBottomSheet,
  type SelectBottomSheetRef,
} from "@/components/SelectBottomSheet";
import { useSelectedCurrency, useSettingsStore } from "@/stores/settings";
import { themeColors } from "@/utils/constants";
import { CURRENCIES, formatCurrencyLabel } from "@/utils/currencies";

const StyledGlassView = styled(GlassView);

const useGlass =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: formatCurrencyLabel(currency),
}));

function Hairline({ color }: { color: string }) {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: color,
        marginLeft: 16,
      }}
    />
  );
}

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = themeColors(scheme);
  const currencySheetRef = useRef<SelectBottomSheetRef>(null);

  const currencyCode = useSettingsStore((state) => state.currencyCode);
  const setCurrencyCode = useSettingsStore((state) => state.setCurrencyCode);
  const selectedLabel = formatCurrencyLabel(useSelectedCurrency());

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
      <Hairline color={dividerColor} />
      <Pressable
        onPress={() => currencySheetRef.current?.present()}
        className="flex-row items-center justify-between px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel={`Currency, ${selectedLabel}`}
      >
        <Text className="text-[17px] font-normal text-foreground dark:text-white">
          Currency
        </Text>
        <View className="flex-row items-center gap-0.5">
          <Text style={{ color: theme.muted, fontSize: 17 }}>{selectedLabel}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={22} color={theme.muted} />
        </View>
      </Pressable>
    </>
  );

  return (
    <Screen title="Settings">
      <View className="px-4 pt-1">
        {useGlass ? (
          <StyledGlassView
            className="overflow-hidden rounded-2xl"
            glassEffectStyle="regular"
            isInteractive
            tintColor={theme.glassTint}
          >
            {rows}
          </StyledGlassView>
        ) : (
          <View className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-card elevation-sm dark:border-white/10 dark:bg-white/10">
            {rows}
          </View>
        )}
      </View>

      <SelectBottomSheet
        ref={currencySheetRef}
        title="Currency"
        options={CURRENCY_OPTIONS}
        selectedValue={currencyCode}
        onSelect={setCurrencyCode}
      />
    </Screen>
  );
}
