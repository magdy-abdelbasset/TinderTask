import React from 'react';
import { Text, View } from 'react-native';
import { errorFetchStyles } from './ErrorFetch.styles';

export default function ErrorFetch({ message, isError }: { message: any; isError: boolean; }) {
  return (
    <>
      {isError ? (
        <View style={errorFetchStyles.errorContainer}>
          <Text style={errorFetchStyles.errorText}>{message}</Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
