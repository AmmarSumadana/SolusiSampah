import { View, Text, StyleSheet, Button } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ShopScreen() {
  const dummyItems = [
    { name: "Pot Plastik Daur Ulang", price: 20000 },
    { name: "Kompos Organik", price: 15000 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <IconSymbol name="shop.fill" size={28} color="#22543D" />
        <Text style={styles.title}>Toko Daur Ulang</Text>
      </View>

      {dummyItems.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text>Harga: Rp {item.price}</Text>
          <Button title="Detail" onPress={() => {}} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 12,
    marginTop: 12
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
});
