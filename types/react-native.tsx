import type { ComponentType } from "react";
import type {
  ActivityIndicatorProps,
  PressableProps,
  RefreshControlProps,
  ScrollViewProps,
  SwitchProps,
  TextProps,
  View as RNView,
  ViewProps,
} from "../node_modules/react-native";

// Resolve the runtime module directly so this shim does not circularly import itself.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const RN = require("../node_modules/react-native");

export * from "../node_modules/react-native";

export const ActivityIndicator =
  RN.ActivityIndicator as unknown as ComponentType<ActivityIndicatorProps>;
export const Text = RN.Text as unknown as ComponentType<TextProps>;
export type View = RNView;
export const View = RN.View as unknown as ComponentType<ViewProps>;
export const Pressable = RN.Pressable as unknown as ComponentType<PressableProps>;
export const ScrollView = RN.ScrollView as unknown as ComponentType<ScrollViewProps>;
export const RefreshControl =
  RN.RefreshControl as unknown as ComponentType<RefreshControlProps>;
export const Switch = RN.Switch as unknown as ComponentType<SwitchProps>;
