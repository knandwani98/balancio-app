import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { borderRadius } from "@/utils/constants";

const SHEET_MARGIN_X = 8;
const SHEET_MARGIN_BOTTOM = 16;
const SHEET_RADIUS = Number.parseInt(borderRadius.card, 10);
const DEFAULT_SNAP_POINTS = ["70%"];

export type SelectBottomSheetOption = {
  value: string;
  label: string;
};

export type SelectBottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type SelectBottomSheetProps = {
  title: string;
  options: SelectBottomSheetOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  snapPoints?: (string | number)[];
};

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

export const SelectBottomSheet = forwardRef<
  SelectBottomSheetRef,
  SelectBottomSheetProps
>(function SelectBottomSheet(
  { title, options, selectedValue, onSelect, snapPoints = DEFAULT_SNAP_POINTS },
  ref,
) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const sheetRef = useRef<BottomSheetModal>(null);
  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(60,60,67,0.18)";

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

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
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={false}
      detached
      bottomInset={SHEET_MARGIN_BOTTOM}
      style={{ marginHorizontal: SHEET_MARGIN_X }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        borderRadius: SHEET_RADIUS,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.2)",
        width: 36,
      }}
    >
      <BottomSheetView style={styles.container}>
        <Text className="px-4 pb-2 text-[13px] font-semibold uppercase tracking-label text-muted dark:text-[#AEAEB2]">
          {title}
        </Text>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {options.map((option, index) => {
            const selected = option.value === selectedValue;

            return (
              <View key={option.value}>
                {index > 0 ? <Hairline color={dividerColor} /> : null}
                <Pressable
                  onPress={() => {
                    onSelect(option.value);
                    sheetRef.current?.dismiss();
                  }}
                  className="flex-row items-center justify-between px-4 py-3.5"
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text className="text-[17px] text-foreground dark:text-white">
                    {option.label}
                  </Text>
                  {selected ? (
                    <MaterialIcons name="check" size={22} color="#007AFF" />
                  ) : null}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
});
