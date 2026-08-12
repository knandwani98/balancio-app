import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Text, useColorScheme, View } from "react-native";

import { useSelectedCurrency } from "@/stores/settings";
import { formatMoney } from "@/utils/wealth";

const SECTION_TONES = {
  assets: {
    icon: "#0A7A4B",
    iconDark: "#34C759",
    wash: "rgba(10, 122, 75, 0.10)",
    washDark: "rgba(52, 199, 89, 0.14)",
  },
  liabilities: {
    icon: "#C2410C",
    iconDark: "#FF9F0A",
    wash: "rgba(194, 65, 12, 0.10)",
    washDark: "rgba(255, 149, 0, 0.14)",
  },
} as const;

type SectionHeadingProps = {
  title: string;
  amount: number;
  symbol: SFSymbol;
  icon: keyof typeof MaterialIcons.glyphMap;
  tone: keyof typeof SECTION_TONES;
  className?: string;
};

export function SectionHeading({
  title,
  amount,
  symbol,
  icon,
  tone,
  className,
}: SectionHeadingProps) {
  const isDark = useColorScheme() === "dark";
  const currency = useSelectedCurrency();
  const accent = SECTION_TONES[tone];
  const tint = isDark ? accent.iconDark : accent.icon;
  const wash = isDark ? accent.washDark : accent.wash;

  return (
    <View
      className={`w-full overflow-hidden rounded-card shadow-card elevation-sm dark:border-white/10 ${className ?? ""}`}
      style={{ backgroundColor: wash }}
    >
      <View className="flex-row items-center gap-3.5 px-4 py-3.5 pl-5">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.72)",
          }}
        >
          <SymbolView
            name={symbol}
            size={22}
            tintColor={tint}
            weight="semibold"
            fallback={<MaterialIcons name={icon} size={22} color={tint} />}
          />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="text-[11px] font-bold uppercase tracking-label"
            style={{ color: tint }}
          >
            {title}
          </Text>
          <Text className="mt-1 text-[22px] font-bold tabular-nums tracking-display text-foreground dark:text-white">
            {formatMoney(amount, currency.symbol)}
          </Text>
        </View>
      </View>
    </View>
  );
}
