import { View } from "react-native";

export default function NavigationHint({direction}: {direction: 'left' | 'right'}) {
  return (
    <View className={`absolute top-0 ${direction}-0 w-1/2 h-full`}>
    </View>
  );
}
