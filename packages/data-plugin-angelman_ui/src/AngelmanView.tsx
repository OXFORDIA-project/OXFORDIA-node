import { View, StyleSheet } from 'react-native';
import { Text } from 'linked-data-browser';

export function AngelmanView() {
  return (
    <View style={styles.container}>
      <Text>Cannot render on this platform.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});
