import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, StyleSheet, View } from "react-native";
export default function HeaderApp() {
  return (
    <View className="px-6 pt-10 pb-4 items-center flex flex-row justify-between items-end bg-white">
      <Image
        source={require('@/assets/images/icons/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View className="flex flex-row gap-2 mr-2 items-center">
        <FontAwesome6 name="smile-beam" size={20} color="#9599a0" />
        <Ionicons name="ellipsis-vertical-circle-outline" size={24} color="#9599a0" />
        <MaterialIcons color="#dc4ef0" name="electric-bolt" size={24}  />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 40,
    tintColor: '#fd4555', // Make logo white to stand out on red background

  },
});
