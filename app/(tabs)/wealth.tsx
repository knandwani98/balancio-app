import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { styled } from "nativewind";
import { useState, type ReactNode } from "react";
import { Platform, ScrollView, Text, useColorScheme, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/Screen";
import { NetWorthContent } from "@/components/wealth/NetWorthContent";
import { SectionHeading } from "@/components/wealth/SectionHeading";
import {
  ASSET_TABS,
  LIABILITY_TABS,
  WealthTabs,
  type WealthTab,
  type WealthTabItem,
} from "@/components/wealth/WealthTabs";
import { themeColors } from "@/utils/constants";
import { WEALTH_TOTALS } from "@/utils/wealth";

const StyledGlassView = styled(GlassView);

const useGlass =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

const ASSET_TAB_ORDER = ASSET_TABS.filter((tab) => !tab.disabled).map((tab) => tab.key);
const LIABILITY_TAB_ORDER = LIABILITY_TABS.map((tab) => tab.key);

export default function WealthScreen() {
  const scheme = useColorScheme();
  const theme = themeColors(scheme);
  const insets = useSafeAreaInsets();
  const [assetTab, setAssetTab] = useState<WealthTab>("investments");
  const [liabilityTab, setLiabilityTab] = useState<WealthTab>("credit-card");
  const [assetDirection, setAssetDirection] = useState(1);
  const [liabilityDirection, setLiabilityDirection] = useState(1);

  const handleAssetTabChange = (tab: WealthTab) => {
    setAssetDirection(
      ASSET_TAB_ORDER.indexOf(tab) >= ASSET_TAB_ORDER.indexOf(assetTab) ? 1 : -1,
    );
    setAssetTab(tab);
  };

  const handleLiabilityTabChange = (tab: WealthTab) => {
    setLiabilityDirection(
      LIABILITY_TAB_ORDER.indexOf(tab) >= LIABILITY_TAB_ORDER.indexOf(liabilityTab)
        ? 1
        : -1,
    );
    setLiabilityTab(tab);
  };

  return (
    <Screen title="Wealth">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 16) + 88,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {useGlass ? (
          <StyledGlassView
            className="overflow-hidden rounded-card"
            glassEffectStyle="regular"
            isInteractive
            tintColor={theme.glassTint}
          >
            <NetWorthContent />
          </StyledGlassView>
        ) : (
          <View className="overflow-hidden rounded-card border border-card-border bg-card shadow-card elevation-sm dark:border-white/10 dark:bg-white/10">
            <NetWorthContent />
          </View>
        )}

        <SectionHeading
          title="Assets"
          amount={WEALTH_TOTALS.assets}
          symbol="chart.pie.fill"
          icon="pie-chart"
          tone="assets"
          className="mt-6"
        />

        <TabCard tintColor={theme.glassTint}>
          <WealthTabs
            tabs={ASSET_TABS}
            activeTab={assetTab}
            onChange={handleAssetTabChange}
          />
        </TabCard>

        <View className="mt-4 min-h-80 overflow-hidden rounded-card border border-card-border bg-card p-4 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10">
          <Animated.View
            key={assetTab}
            entering={(assetDirection >= 0 ? FadeInRight : FadeInLeft).duration(220)}
            exiting={(assetDirection >= 0 ? FadeOutLeft : FadeOutRight).duration(160)}
          >
            <Text className="text-sm text-muted dark:text-[#AEAEB2]">
              {tabLabel(ASSET_TABS, assetTab)}
            </Text>
          </Animated.View>
        </View>

        <SectionHeading
          title="Liabilities"
          amount={WEALTH_TOTALS.liabilities}
          symbol="creditcard.fill"
          icon="credit-card"
          tone="liabilities"
          className="mt-6"
        />

        <TabCard tintColor={theme.glassTint}>
          <WealthTabs
            tabs={LIABILITY_TABS}
            activeTab={liabilityTab}
            onChange={handleLiabilityTabChange}
          />
        </TabCard>

        <View className="mt-4 min-h-40 overflow-hidden rounded-card border border-card-border bg-card p-4 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10">
          <Animated.View
            key={liabilityTab}
            entering={(liabilityDirection >= 0 ? FadeInRight : FadeInLeft).duration(220)}
            exiting={(liabilityDirection >= 0 ? FadeOutLeft : FadeOutRight).duration(160)}
          >
            <Text className="text-sm text-muted dark:text-[#AEAEB2]">
              {tabLabel(LIABILITY_TABS, liabilityTab)}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function tabLabel(tabs: WealthTabItem[], key: WealthTab) {
  return tabs.find((tab) => tab.key === key)?.label ?? key;
}

function TabCard({
  children,
  tintColor,
}: {
  children: ReactNode;
  tintColor: string;
}) {
  if (useGlass) {
    return (
      <StyledGlassView
        className="mt-4 overflow-hidden rounded-card border border-card-border bg-card p-1 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10"
        glassEffectStyle="regular"
        isInteractive
        tintColor={tintColor}
      >
        {children}
      </StyledGlassView>
    );
  }

  return (
    <View className="mt-4 overflow-hidden rounded-card border border-card-border bg-transparent p-1 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10">
      {children}
    </View>
  );
}
