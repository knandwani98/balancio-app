import "../global.css";

import { ClerkProvider, getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { resourceCache } from "@clerk/clerk-expo/resource-cache";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ToastHost } from "@/components/ToastHost";
import { hasCachedClerkSession } from "@/lib/clerkBootstrap";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

const clerkOptions = {
  publishableKey,
  tokenCache,
  __experimental_resourceCache: resourceCache,
} as const;

if (publishableKey) {
  getClerkInstance(clerkOptions);
}

function AuthBootstrap({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth();
  const [awaitingSession, setAwaitingSession] = useState<boolean | null>(null);

  useEffect(() => {
    void hasCachedClerkSession().then(setAwaitingSession);
  }, []);

  useEffect(() => {
    const canShowUi =
      awaitingSession === false || (awaitingSession === true && isLoaded);

    if (canShowUi) {
      void SplashScreen.hideAsync();
    }
  }, [awaitingSession, isLoaded]);

  if (awaitingSession === null) {
    return null;
  }

  if (awaitingSession && !isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isLoaded && isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isLoaded || !isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider {...clerkOptions}>
        <AuthBootstrap>
          <RootNavigator />
        </AuthBootstrap>
      </ClerkProvider>
      <ToastHost />
    </GestureHandlerRootView>
  );
}
