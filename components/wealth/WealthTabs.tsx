import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, useColorScheme, View } from "react-native";
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { themeColors } from "@/utils/constants";

export type WealthTab = string;

export type WealthTabItem = {
  key: WealthTab;
  label: string;
};

export const ASSET_TABS: WealthTabItem[] = [
  { key: "investments", label: "Investments" },
  { key: "banks", label: "Banks" },
];

export const LIABILITY_TABS: WealthTabItem[] = [
  { key: "credit-card", label: "Credit Card" },
  { key: "bills", label: "Bills" },
];

const SPRING = {
  damping: 22,
  stiffness: 280,
  mass: 0.7,
};

type TabLayout = { x: number; width: number };

type WealthTabsProps = {
  tabs: WealthTabItem[];
  activeTab: WealthTab;
  onChange: (tab: WealthTab) => void;
};

export function WealthTabs({ tabs, activeTab, onChange }: WealthTabsProps) {
  const scheme = useColorScheme();
  const theme = themeColors(scheme);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === activeTab),
  );
  const [layouts, setLayouts] = useState<TabLayout[]>([]);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const progress = useSharedValue(activeIndex);
  const ready = useSharedValue(0);
  const previousIndex = useRef(activeIndex);

  useEffect(() => {
    const layout = layouts[activeIndex];
    if (!layout) return;

    const isFirst = ready.value === 0;
    const indexChanged = previousIndex.current !== activeIndex;
    previousIndex.current = activeIndex;

    if (isFirst) {
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
      progress.value = activeIndex;
      ready.value = 1;
      return;
    }

    if (!indexChanged) return;

    indicatorX.value = withSpring(layout.x, SPRING);
    indicatorWidth.value = withSpring(layout.width, SPRING);
    progress.value = withSpring(activeIndex, SPRING);
  }, [
    activeIndex,
    indicatorWidth,
    indicatorX,
    layouts,
    progress,
    ready,
  ]);

  const onTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => {
      if (prev[index]?.x === x && prev[index]?.width === width) return prev;
      const next = [...prev];
      next[index] = { x, width };
      return next;
    });
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: ready.value,
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    backgroundColor: theme.tabIndicator,
  }));

  return (
    <View className="relative flex-row">
      <Animated.View
        pointerEvents="none"
        className="absolute bottom-0 top-0"
        style={[
          indicatorStyle,
          { borderCurve: "continuous", borderRadius: 999 },
        ]}
      />

      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key}
          onLayout={(event) => onTabLayout(index, event)}
          onPress={() => {
            if (tab.key === activeTab) return;
            void Haptics.selectionAsync();
            onChange(tab.key);
          }}
          className="flex-1 items-center justify-center rounded-xl px-2 py-2.5"
        >
          <TabLabel
            label={tab.label}
            index={index}
            progress={progress}
            activeColor={theme.tabActive}
            inactiveColor={theme.tabInactive}
          />
        </Pressable>
      ))}
    </View>
  );
}

function TabLabel({
  label,
  index,
  progress,
  activeColor,
  inactiveColor,
}: {
  label: string;
  index: number;
  progress: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    const t = Math.max(0, 1 - distance);

    return {
      color: interpolateColor(t, [0, 1], [inactiveColor, activeColor]),
    };
  });

  return (
    <Animated.Text className="text-sm font-semibold" style={style}>
      {label}
    </Animated.Text>
  );
}
