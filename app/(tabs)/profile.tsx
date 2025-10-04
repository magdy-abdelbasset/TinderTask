import React from 'react';
import { Text, View } from 'react-native';
import { sharedStyles } from '../../styles/sharedStyles';

export default function ProfileScreen() {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>👤 Profile</Text>
      <Text style={sharedStyles.subtitle}>Your profile information</Text>
      
      <View style={sharedStyles.content}>
        <Text style={sharedStyles.contentText}>
          Profile screen coming soon!
        </Text>
      </View>
    </View>
  );
}
