import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import HeaderApp from '@/components/layouts/HeaderApp';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1 ,backgroundColor:"white"}} >
      <HeaderApp />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#f10c51ff",
          tabBarInactiveTintColor: "#979aa1",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: "white", // adjust as needed
          },
        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('@/assets/images/icons/1.png')} // update path if needed
              style={{
                width: 34,
                height: 34,
                tintColor: focused ? undefined : "#527194", // applies color from tabBarActiveTintColor
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('@/assets/images/icons/2.png')} // update path if needed
              style={{
                width: 34,
                height: 34,
                tintColor: color, // applies color from tabBarActiveTintColor
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="like"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color, focused }) => (
            focused ? (

              <AntDesign
                name="heart" size={24}
                color={color} />
            ) : (
              <Entypo name="heart-outlined" size={24} color={color} />
            )
          ),
          tabBarIconStyle: {
            transform: [{ scale: 1.3 }],
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={24}
              color={color}
              style={{ transform: [{ scaleX: -1 }], direction: 'ltr' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            focused ?(
              <FontAwesome6 name="user-large" size={24} color={color} />
            ) : (
              <Feather name="user" size={24} color={color} />
            )
          ),
        }}
      />
    </Tabs>
    </View>
  );
}