import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Icon, Label, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="home" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <Label>Transactions</Label>
        <Icon
          sf={{ default: "list.bullet.rectangle", selected: "list.bullet.rectangle.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="receipt-long" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wealth">
        <Label>Wealth</Label>
        <Icon
          sf={{ default: "chart.pie", selected: "chart.pie.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="pie-chart" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="recurring">
        <Label>Recurring</Label>
        <Icon
          sf={{ default: "arrow.triangle.2.circlepath", selected: "arrow.triangle.2.circlepath" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="autorenew" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="settings" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
