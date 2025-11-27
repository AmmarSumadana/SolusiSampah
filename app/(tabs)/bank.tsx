import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function BankScreen() {
  const dummyBanks = [
    { name: "Bank Sampah Sejahtera", address: "Yogyakarta" },
    { name: "Bank Sampah Melati", address: "Sleman" },
    { name: "Bank Sampah Mandiri", address: "Bantul" }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Bank Sampah</Text>

      {dummyBanks.map((bank, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <IconSymbol name="list.banksampah" size={22} color="#22543D" />
            <Text style={styles.cardTitle}>{bank.name}</Text>
          </View>
          <Text>{bank.address}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
});
