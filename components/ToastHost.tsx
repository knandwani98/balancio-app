import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { type ReactNode, useEffect } from "react";
import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";

import { useToastStore, type ToastVariant } from "@/stores/toast";

const TOAST_DURATION_MS = 2800;

const VARIANT_ICON: Record<
  ToastVariant,
  { name: keyof typeof MaterialIcons.glyphMap }
> = {
  success: { name: "check-circle" },
  error: { name: "error" },
};

function Overlay({ children }: { children: ReactNode }) {
  if (Platform.OS === "ios") {
    return <FullWindowOverlay>{children}</FullWindowOverlay>;
  }

  return <>{children}</>;
}

export function ToastHost() {
  const current = useToastStore((state) => state.current);
  const hide = useToastStore((state) => state.hide);
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    if (!current) {
      return;
    }

    void Haptics.notificationAsync(
      current.variant === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );

    const timer = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [current, hide]);

  if (!current) {
    return null;
  }

  const backgroundColor = isDark ? "#F5F5F7" : "#1C1C1E";
  const textColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const iconColor =
    current.variant === "success" ? (isDark ? "#248A3D" : "#32D74B") : isDark ? "#D70015" : "#FF453A";

  return (
    <Overlay>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <Animated.View
          key={current.id}
          entering={FadeInDown.duration(220)}
          pointerEvents="none"
          style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <View
            style={[
              styles.toast,
              {
                backgroundColor,
                boxShadow: [
                  {
                    offsetX: 0,
                    offsetY: 10,
                    blurRadius: 28,
                    color: "rgba(0, 0, 0, 0.28)",
                  },
                ],
              },
            ]}
          >
            <MaterialIcons
              name={VARIANT_ICON[current.variant].name}
              size={20}
              color={iconColor}
            />
            <Text style={[styles.message, { color: textColor }]}>{current.message}</Text>
          </View>
        </Animated.View>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});
