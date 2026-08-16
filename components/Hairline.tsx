import { StyleSheet, useColorScheme, View } from "react-native";

type HairlineProps = {
  color?: string;
  inset?: number;
};


export function Hairline({ color, inset }: HairlineProps) {
  const isDark = useColorScheme() === "dark";
  const dividerColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(60,60,67,0.18)";

  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: color ?? dividerColor,
        ...(inset != null ? { marginLeft: inset } : {}),
      }}
    />
  );
}
