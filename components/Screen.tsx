import { type ReactNode } from "react";
import { View } from "react-native";

import { ScreenHeader } from "./ScreenHeader";

type ScreenProps = {
  title: string;
  children?: ReactNode;
};

export function Screen({ title, children }: ScreenProps) {
  return (
    <View className="flex-1 bg-canvas dark:bg-black">
      <ScreenHeader title={title} />
      <View className="flex-1">{children}</View>
    </View>
  );
}
