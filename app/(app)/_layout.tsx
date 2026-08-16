import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";

import { useSyncProjectCurrency } from "@/hooks/useSyncProjectCurrency";
import { useSyncUserFromClerk } from "@/hooks/useSyncUserFromClerk";

export default function AppLayout() {
  useSyncUserFromClerk();
  useSyncProjectCurrency();

  return (
    <BottomSheetModalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </BottomSheetModalProvider>
  );
}
