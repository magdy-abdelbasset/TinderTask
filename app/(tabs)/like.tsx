import { StyleSheet, Text, View } from 'react-native';

export default function HotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Likes</Text>
      <Text style={styles.description}>Trending content and popular matches</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
