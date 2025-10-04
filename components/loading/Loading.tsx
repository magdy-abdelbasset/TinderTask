import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { loadingStyles } from './Loading.styles';

export default function Loading({ message }: { message: string; }) {
  return (
    <>
     <View style={loadingStyles.loadingNextContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={loadingStyles.loadingNextText}>{message}</Text>
        </View>
    </>
  );
}
