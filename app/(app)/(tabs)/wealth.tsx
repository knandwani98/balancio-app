import { useState } from "react";
import { RefreshControl, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
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
import { useInvestmentPlans } from "@/hooks/useInvestmentPlans";
import { useNetworth } from "@/hooks/useNetworth";
import type { WealthTotals } from "@/lib/networth";

const ASSET_TAB_ORDER = ASSET_TABS.map((tab) => tab.key);
const LIABILITY_TAB_ORDER = LIABILITY_TABS.map((tab) => tab.key);

export default function WealthScreen() {
  const insets = useSafeAreaInsets();
  const { totals, initialLoading, error, reload } = useNetworth();
  const {
    plans,
    initialLoading: plansLoading,
    error: plansError,
    reload: reloadPlans,
  } = useInvestmentPlans();
  const [assetTab, setAssetTab] = useState<WealthTab>("investments");
  const [liabilityTab, setLiabilityTab] = useState<WealthTab>("credit-card");
  const [assetDirection, setAssetDirection] = useState(1);
  const [liabilityDirection, setLiabilityDirection] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([reload(), reloadPlans()]);
    setRefreshing(false);
  };

  const netWorthCard = (
    <NetWorthContent amount={totals.networth} initialLoading={initialLoading} />
  );

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
      >
        <GlassCard>{netWorthCard}</GlassCard>

        {error ? (
          <Text className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </Text>
        ) : null}

        {plansError ? (
          <Text className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {plansError}
          </Text>
        ) : null}



        {/* Assets */}

        <SectionHeading
          title="Assets"
          amount={totals.assets}
          symbol="chart.pie.fill"
          icon="pie-chart"
          tone="assets"
          initialLoading={initialLoading}
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
          amount={assetTabAmount(assetTab, totals, plans)}
          initialLoading={initialLoading}
        >
          {assetTab === "investments" ? (
            <InvestmentTrackList plans={plans} loading={plansLoading} />
          ) : (
            <Text className="text-sm text-muted dark:text-[#AEAEB2]">
              Coming soon
            </Text>
          )}
        </WealthTabPanel>


        {/* Liabilities */}

        <SectionHeading
          title="Liabilities"
          amount={totals.liabilities}
          symbol="creditcard.fill"
          icon="credit-card"
          tone="liabilities"
          initialLoading={initialLoading}
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
          amount={liabilityTabAmount(liabilityTab, totals)}
          initialLoading={initialLoading}
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

function assetTabAmount(
  tab: WealthTab,
  totals: WealthTotals,
  plans: { current_value: number }[],
) {
  switch (tab) {
    case "investments":
      return plans.reduce((sum, plan) => sum + plan.current_value, 0);
    case "banks":
      return Math.max(0, totals.assets - plans.reduce((sum, plan) => sum + plan.current_value, 0));
    default:
      return 0;
  }
}

function liabilityTabAmount(tab: WealthTab, totals: WealthTotals) {
  switch (tab) {
    case "credit-card":
    case "bills":
      return totals.liabilities;
    default:
      return 0;
  }
}
