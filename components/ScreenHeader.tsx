import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenHeaderProps = {
  title: string;
};

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="px-5 pb-3" style={{ paddingTop: insets.top + 8 }}>
      <Text className="text-heading font-bold text-ink dark:text-white">{title}</Text>
    </View>
  );
}
