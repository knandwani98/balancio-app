import { Text, View } from "react-native";

export default function SSOCallbackScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-canvas dark:bg-black">
      <Text className="text-sm text-muted dark:text-[#AEAEB2]">
        Signing you in...
      </Text>
    </View>
  );
}
