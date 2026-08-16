import { useSSO } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const redirectUrl = AuthSession.makeRedirectUri({
  path: "sso-callback",
});

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { startSSOFlow } = useSSO();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onGoogle = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google sign-in failed.";
      const isRedirectError = message.includes("redirect URL");
      Alert.alert(
        "Sign in failed",
        isRedirectError
          ? `${message}\n\nAllowlist this redirect URL in Clerk → Native applications:\n${redirectUrl}`
          : message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-canvas px-6 dark:bg-black"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text className="text-[28px] font-bold tracking-display text-foreground dark:text-white">
        Sign in to Balancio
      </Text>
      <Text className="mt-2 text-sm text-muted dark:text-[#AEAEB2]">
        Track your net worth in one place.
      </Text>

      <Pressable
        onPress={() => void onGoogle()}
        disabled={submitting}
        className="mt-8 flex-row items-center rounded-card border border-card-border bg-card px-4 py-3.5 dark:border-white/10 dark:bg-white/10"
        style={{ opacity: submitting ? 0.5 : 1 }}
      >
        <AntDesign name="google" size={20} color="#4285F4" />
        <Text className="flex-1 text-center text-[16px] font-semibold text-foreground dark:text-white">
          Continue with Google
        </Text>
        <View className="w-5" />
      </Pressable>
    </View>
  );
}
