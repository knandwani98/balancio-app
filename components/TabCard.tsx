import type { ReactNode } from "react";
import { View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/utils/cn";

type TabCardProps = {
  children: ReactNode;
  className?: string;
};

export function TabCard({ children, className }: TabCardProps) {
  return (
    <GlassCard className={cn("mt-4", className)}>
      <View className="p-1">{children}</View>
    </GlassCard>
  );
}
