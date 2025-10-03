import { UserInterface } from "@/types/User";
import { Text, View } from "react-native";

export default function UserInfo({ user }: { user: UserInterface }) {
    return (
        <View className="absolute bottom-12 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <Text className="text-white text-3xl font-bold mb-1">
                {user.name}, {user.age}
            </Text>
            {user.location && (
                <Text className="text-white/90 text-lg">
                    📍 {user.location}
                </Text>
            )}
        </View>
    );
}
