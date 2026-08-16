import { useAuth, useUser } from "@clerk/clerk-expo";
import { useLayoutEffect } from "react";

import { useUserStore } from "@/stores/user";

export function useSyncUserFromClerk() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;
  const firstName = clerkUser?.firstName ?? null;
  const lastName = clerkUser?.lastName ?? null;
  const imageUrl = clerkUser?.imageUrl ?? null;

  useLayoutEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      setUser({
        id: userId,
        email,
        firstName,
        lastName,
        imageUrl,
      });
      return;
    }

    clearUser();
  }, [isLoaded, isSignedIn, userId, email, firstName, lastName, imageUrl, setUser, clearUser]);
}
