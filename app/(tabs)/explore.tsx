import React from 'react';
import { Text, View } from 'react-native';
import { sharedStyles } from '../../styles/sharedStyles';

export default function ExploreScreen() {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>🔍 Explore</Text>
      <Text style={sharedStyles.subtitle}>Discover new people</Text>
      
      <View style={sharedStyles.content}>
        <Text style={sharedStyles.contentText}>
          Explore screen coming soon!
        </Text>
      </View>
    </View>
  );
}
