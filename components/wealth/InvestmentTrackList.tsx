import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Hairline } from "@/components/Hairline";
import type { InvestmentPlanSummary } from "@/lib/investmentPlans";
import { sortPlansByValue } from "@/lib/investmentPlans";
import { useSelectedCurrency } from "@/stores/settings";
import { borderRadius, themeColors } from "@/utils/constants";
import {
  formatMoney,
  INVESTMENT_ASSET_PREVIEW_COUNT,
  INVESTMENT_ASSET_TYPES,
  isPlanNameTracked,
  type InvestmentAssetType
} from "@/utils/wealth";

const SHEET_RADIUS = Number.parseInt(borderRadius.card, 10);
const TRACK_GREEN = "#0A7A4B";
const TRACK_GREEN_DARK = "#34C759";

/** Starts tracking an untracked asset type. */
function TrackButton({ onPress }: { onPress: () => void }) {
  const isDark = useColorScheme() === "dark";
  const tint = isDark ? TRACK_GREEN_DARK : TRACK_GREEN;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Track"
      className="flex-row items-center gap-1 rounded-full px-3.5 py-1.5"
      style={{
        backgroundColor: isDark
          ? "rgba(52, 199, 89, 0.16)"
          : "rgba(10, 122, 75, 0.10)",
      }}
    >
      <MaterialIcons name="add" size={16} color={tint} />
      <Text className="text-[14px] font-semibold" style={{ color: tint }}>
        Track
      </Text>
    </Pressable>
  );
}

/** Sheet row: asset type + Track CTA for untracked types. */
function AssetRow({
  item,
  showDivider,
  onTrack,
}: {
  item: InvestmentAssetType;
  showDivider: boolean;
  onTrack: (item: InvestmentAssetType) => void;
}) {
  return (
    <View>
      {showDivider ? <Hairline /> : null}
      <View className="flex-row items-center justify-between py-3.5">
        <Text className="mr-3 flex-1 text-[17px] text-foreground dark:text-white">
          {item.label}
        </Text>
        <TrackButton onPress={() => onTrack(item)} />
      </View>
    </View>
  );
}

/** List row: tracked plan with holdings count and current value. */
function PlanRow({
  plan,
  showDivider,
  symbol,
}: {
  plan: InvestmentPlanSummary;
  showDivider: boolean;
  symbol: string;
}) {
  return (
    <View>
      {showDivider ? <Hairline /> : null}
      <View className="flex-row items-center justify-between py-3.5">
        <View className="mr-3 min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-[17px] text-foreground dark:text-white"
              numberOfLines={1}
            >
              {plan.name}
            </Text>
            {plan.holding_count > 0 && <Text className="text-sm font-semibold bg-foreground text-white rounded-full px-2 py-1">
              {plan.holding_count}
            </Text>}
          </View>
        </View>
        <Text className="text-[17px] font-semibold tabular-nums text-foreground dark:text-white">
          {formatMoney(plan.current_value, symbol)}
        </Text>
      </View>
    </View>
  );
}

type InvestmentTrackListProps = {
  plans?: InvestmentPlanSummary[];
  loading?: boolean;
  onTrack?: (item: InvestmentAssetType) => void;
};

export function InvestmentTrackList({
  plans = [],
  loading = false,
  onTrack,
}: InvestmentTrackListProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = themeColors(scheme);
  const currency = useSelectedCurrency();
  const sheetRef = useRef<BottomSheetModal>(null);

  const sortedPlans = useMemo(() => sortPlansByValue(plans), [plans]);
  const trackedNames = useMemo(() => plans.map((plan) => plan.name), [plans]);
  // Asset types that do not yet have a matching plan.
  const untrackedItems = useMemo(
    () =>
      INVESTMENT_ASSET_TYPES.filter(
        (item) => !isPlanNameTracked(item.label, trackedNames),
      ),
    [trackedNames],
  );
  const planByAssetKey = useMemo(() => {
    const map = new Map<string, InvestmentPlanSummary>();
    for (const item of INVESTMENT_ASSET_TYPES) {
      const plan = plans.find((candidate) =>
        isPlanNameTracked(item.label, [candidate.name]),
      );
      if (plan) map.set(item.key, plan);
    }
    return map;
  }, [plans]);

  const previewPlans = sortedPlans.slice(0, INVESTMENT_ASSET_PREVIEW_COUNT);
  // Pad the preview to INVESTMENT_ASSET_PREVIEW_COUNT with untracked types.
  const previewAssets = untrackedItems.slice(
    0,
    Math.max(0, INVESTMENT_ASSET_PREVIEW_COUNT - previewPlans.length),
  );
  const remainingUntracked = untrackedItems.slice(previewAssets.length);
  // Empty state lists every type; otherwise only types not already in the preview.
  const sheetItems = INVESTMENT_ASSET_TYPES;
  const moreLabel = "View All";
  const showMore = remainingUntracked.length > 0;

  const handleTrack = useCallback(
    (item: InvestmentAssetType) => {
      onTrack?.(item);
    },
    [onTrack],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  if (loading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="small" color={theme.muted} />
      </View>
    );
  }

  return (
    <>
      <View>
        {/* Always show PREVIEW_COUNT rows: plans first, then untracked types. */}
        {previewPlans.map((plan, index) => (
          <PlanRow
            key={plan.id}
            plan={plan}
            showDivider={index > 0}
            symbol={currency.symbol}
          />
        ))}
        {previewAssets.map((item, index) => (
          <AssetRow
            key={item.key}
            item={item}
            showDivider={previewPlans.length + index > 0}
            onTrack={handleTrack}
          />
        ))}

        {showMore ? (
          <>
            {previewPlans.length + previewAssets.length > 0 ? <Hairline /> : null}
            <Pressable
              onPress={() => sheetRef.current?.present()}
              accessibilityRole="button"
              accessibilityLabel={moreLabel}
              className="flex-row items-center justify-center gap-1 pt-8 pb-3.5"
            >
              <Text
                className="text-[15px] font-semibold"
                style={{ color: isDark ? TRACK_GREEN_DARK : TRACK_GREEN }}
              >
                {moreLabel}
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={16}
                color={isDark ? TRACK_GREEN_DARK : TRACK_GREEN}
              />
            </Pressable>
          </>
        ) : null}
      </View>

      {/* Full catalog of types the user can still start tracking. */}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["75%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableHandlePanningGesture={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderRadius: SHEET_RADIUS,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.2)",
        }}
      >
        <Text className="px-4 pb-2 text-[13px] font-semibold uppercase tracking-label text-muted dark:text-[#AEAEB2]">
          All assets
        </Text>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {sheetItems.map((item, index) => {
            const plan = planByAssetKey.get(item.key);
            if (plan) {
              return (
                <PlanRow
                  key={item.key}
                  plan={plan}
                  showDivider={index > 0}
                  symbol={currency.symbol}
                />
              );
            }

            return (
              <AssetRow
                key={item.key}
                item={item}
                showDivider={index > 0}
                onTrack={handleTrack}
              />
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
