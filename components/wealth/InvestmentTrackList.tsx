import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { borderRadius } from "@/utils/constants";
import {
  INVESTMENT_ASSET_PREVIEW_COUNT,
  INVESTMENT_ASSET_TYPES,
  type InvestmentAssetType,
} from "@/utils/wealth";

const SHEET_RADIUS = Number.parseInt(borderRadius.card, 10);
const TRACK_GREEN = "#0A7A4B";
const TRACK_GREEN_DARK = "#34C759";

function Hairline({ color }: { color: string }) {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: color,
      }}
    />
  );
}

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

function AssetRow({
  item,
  showDivider,
  dividerColor,
  onTrack,
}: {
  item: InvestmentAssetType;
  showDivider: boolean;
  dividerColor: string;
  onTrack: (item: InvestmentAssetType) => void;
}) {
  return (
    <View>
      {showDivider ? <Hairline color={dividerColor} /> : null}
      <View className="flex-row items-center justify-between py-3.5">
        <Text className="mr-3 flex-1 text-[17px] text-foreground dark:text-white">
          {item.label}
        </Text>
        <TrackButton onPress={() => onTrack(item)} />
      </View>
    </View>
  );
}

type InvestmentTrackListProps = {
  onTrack?: (item: InvestmentAssetType) => void;
};

export function InvestmentTrackList({ onTrack }: InvestmentTrackListProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const sheetRef = useRef<BottomSheetModal>(null);
  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(60,60,67,0.18)";

  const previewItems = INVESTMENT_ASSET_TYPES.slice(
    0,
    INVESTMENT_ASSET_PREVIEW_COUNT,
  );
  const moreItems = INVESTMENT_ASSET_TYPES.slice(INVESTMENT_ASSET_PREVIEW_COUNT);

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

  return (
    <>
      <View>
        {previewItems.map((item, index) => (
          <AssetRow
            key={item.key}
            item={item}
            showDivider={index > 0}
            dividerColor={dividerColor}
            onTrack={handleTrack}
          />
        ))}

        {moreItems.length > 0 ? (
          <>
            <Hairline color={dividerColor} />
            <Pressable
              onPress={() => sheetRef.current?.present()}
              accessibilityRole="button"
              accessibilityLabel="View more asset types"
              className="flex-row items-center justify-center gap-1 pt-8 pb-3.5"
            >
              <Text
                className="text-[15px] font-semibold"
                style={{ color: isDark ? TRACK_GREEN_DARK : TRACK_GREEN }}
              >
                View All
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color={isDark ? TRACK_GREEN_DARK : TRACK_GREEN} />
            </Pressable>
          </>
        ) : null}
      </View>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["55%"]}
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
          More assets
        </Text>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {moreItems.map((item, index) => (
            <AssetRow
              key={item.key}
              item={item}
              showDivider={index > 0}
              dividerColor={dividerColor}
              onTrack={handleTrack}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
