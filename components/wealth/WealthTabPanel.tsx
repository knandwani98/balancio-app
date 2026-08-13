import type { ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";

type WealthTabPanelProps = {
  tabKey: string;
  direction: number;
  title: string;
  children: ReactNode;
  className?: string;
};

export function WealthTabPanel({
  tabKey,
  direction,
  title,
  children,
  className,
}: WealthTabPanelProps) {
  return (
    <View
      className={`mt-4 overflow-hidden rounded-card border border-card-border bg-card p-4 shadow-card elevation-sm dark:border-white/10 dark:bg-white/10 ${className ?? ""}`}
    >
      <Animated.View
        key={tabKey}
        entering={(direction >= 0 ? FadeInRight : FadeInLeft).duration(220)}
        exiting={(direction >= 0 ? FadeOutLeft : FadeOutRight).duration(160)}
      >
        <Text className="mb-3 text-[17px] font-semibold text-foreground dark:text-white">
          {title}
        </Text>
        {children}
      </Animated.View>
    </View>
  );
}
