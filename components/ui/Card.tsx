import { View, StyleSheet } from 'react-native';

export function Card({ children }: any) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    elevation: 3,
    marginBottom: 12,
  },
});
