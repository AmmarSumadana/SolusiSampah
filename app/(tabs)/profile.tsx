import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nama: Muhammad Ammar Sumadana</Text>
        <Text style={styles.label}>Email: user@gmail.com</Text>
        <Text style={styles.label}>Role: Pengguna</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3
  },
  label: { fontSize: 16, marginBottom: 4 }
});
