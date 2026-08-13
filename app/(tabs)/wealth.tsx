import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { styled } from "nativewind";
import { useState } from "react";
import { Platform, ScrollView, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/Screen";
import { TabCard } from "@/components/TabCard";
import { InvestmentTrackList } from "@/components/wealth/InvestmentTrackList";
import { NetWorthContent } from "@/components/wealth/NetWorthContent";
import { SectionHeading } from "@/components/wealth/SectionHeading";
import { WealthTabPanel } from "@/components/wealth/WealthTabPanel";
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

        <TabCard>
          <WealthTabs
            tabs={ASSET_TABS}
            activeTab={assetTab}
            onChange={handleAssetTabChange}
          />
        </TabCard>

        <WealthTabPanel
          tabKey={assetTab}
          direction={assetDirection}
          title={tabLabel(ASSET_TABS, assetTab)}
        >
          {assetTab === "investments" ? (
            <InvestmentTrackList />
          ) : (
            <Text className="text-sm text-muted dark:text-[#AEAEB2]">
              Coming soon
            </Text>
          )}
        </WealthTabPanel>

        <SectionHeading
          title="Liabilities"
          amount={WEALTH_TOTALS.liabilities}
          symbol="creditcard.fill"
          icon="credit-card"
          tone="liabilities"
          className="mt-6"
        />

        <TabCard>
          <WealthTabs
            tabs={LIABILITY_TABS}
            activeTab={liabilityTab}
            onChange={handleLiabilityTabChange}
          />
        </TabCard>

        <WealthTabPanel
          tabKey={liabilityTab}
          direction={liabilityDirection}
          title={tabLabel(LIABILITY_TABS, liabilityTab)}
          className="min-h-40"
        >
          <Text className="text-sm text-muted dark:text-[#AEAEB2]">
            Coming soon
          </Text>
        </WealthTabPanel>
      </ScrollView>
    </Screen>
  );
}

function tabLabel(tabs: WealthTabItem[], key: WealthTab) {
  return tabs.find((tab) => tab.key === key)?.label ?? key;
}
