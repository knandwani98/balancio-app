import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/** Same key Clerk uses internally for the cached session JWT. */
const CLERK_JWT_KEY = "__clerk_client_jwt";

const secureStoreOpts = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
} as const;

/** True when a prior session token exists (returning user). */
export async function hasCachedClerkSession(): Promise<boolean> {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const token = await SecureStore.getItemAsync(CLERK_JWT_KEY, secureStoreOpts);
    return Boolean(token);
  } catch {
    return false;
  }
}
