import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions // Import untuk mendapatkan dimensi layar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { router } from 'expo-router';
// Asumsi komponen ini ada di proyek Anda:
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// --- PENGHITUNGAN SKALA RELATIF ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375; // Lebar standar desain (misal, iPhone 8)

// Skala untuk menyesuaikan ukuran berdasarkan lebar layar
const scale = SCREEN_WIDTH / BASE_WIDTH; 

/**
 * Fungsi untuk menskalakan ukuran (terutama font dan padding)
 * @param size Ukuran desain
 * @returns Ukuran yang diskalakan
 */
const normalize = (size: number) => Math.round(size * scale);
// ------------------------------------

export default function HomeScreen() {
  const dummyPoints = 450;
  const totalSaved = 125.5;

  const quickActions = [
    { 
        name: "Cari Lokasi", 
        icon: "map.fill", 
        target: "/map",
        color: "#48BB78" 
    },
    { 
        name: "Tukar Poin", 
        icon: "shop.fill", 
        target: "/shop",
        color: "#3182CE" 
    },
    { 
        name: "Daftar Sampah", 
        icon: "list.banksampah", 
        target: "/bank",
        color: "#9F7AEA" 
    },
  ];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER & STATUS PENGGUNA */}
        <ThemedView style={styles.headerCard}>
          <View style={styles.row}>
            <IconSymbol name="profile.fill" size={normalize(30)} color="#fff" />
            <ThemedText style={styles.greetingText}>Halo, Ammar!</ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Total Poin Anda</ThemedText>
              <ThemedText style={styles.statValue}>{dummyPoints}</ThemedText>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Sampah Terselamatkan</ThemedText>
              <ThemedText style={styles.statValue}>{totalSaved} kg</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* 2. FITUR UTAMA (QUICK ACTIONS) */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Akses Cepat & Layanan</ThemedText>
        <View style={styles.actionContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.name}
              style={styles.actionButton}
              onPress={() => router.push(action.target as any)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: action.color + '20', borderColor: action.color }]}>
                <IconSymbol name={action.icon} size={normalize(24)} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* 3. BAGIAN EDUKASI/INFORMASI */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Edukasi Lingkungan</ThemedText>
        <ThemedView style={styles.infoCard}>
          <View style={styles.row}>
            <IconSymbol name="lightbulb.fill" size={normalize(20)} color="#3182CE" />
            <ThemedText type="defaultSemiBold" style={[styles.infoTitle, { color: '#2D3748' }]}>Pilah Sampah, Raih Poin!</ThemedText>
          </View>
          <Text style={styles.infoText}>
            Setiap sampah yang Anda pilah dan tukarkan di Bank Sampah terdekat akan diubah menjadi poin berharga. Mulai pilah sekarang!
          </Text>
          <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/bank")}>
              <Text style={styles.infoButtonText}>Lihat Daftar Bank Sampah</Text>
          </TouchableOpacity>
        </ThemedView>

        <View style={{ height: normalize(50) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: normalize(16),
    paddingTop: 0, 
    backgroundColor: '#fff',
  },
  
  // 1. HEADER
  headerCard: {
    backgroundColor: '#48BB78', 
    paddingHorizontal: normalize(20), 
    paddingVertical: normalize(30),
    borderRadius: normalize(15),
    marginBottom: normalize(20),
    marginTop: normalize(10),
    elevation: 8,
    shadowColor: '#1A202C',
    shadowOpacity: 0.1,
    shadowRadius: normalize(10),
    shadowOffset: { width: 0, height: normalize(5) },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
  },
  greetingText: {
    fontSize: normalize(20), // Skala
    fontWeight: '700',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(25), 
    paddingTop: normalize(15),
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderTopWidth: 1, // Border width biasanya dibiarkan 1 atau 0.5
  },
  statBox: {
    alignItems: 'flex-start',
    flex: 1,
  },
  statLabel: {
    fontSize: normalize(12), // Skala
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: normalize(2),
  },
  statValue: {
    fontSize: normalize(26), // Skala
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignSelf: 'center',
    marginHorizontal: normalize(15),
  },

  // 2. QUICK ACTIONS
  sectionTitle: {
    fontSize: normalize(17), // Skala
    fontWeight: 'bold',
    marginBottom: normalize(12),
    color: '#2D3748',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(25),
    gap: normalize(10),
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: normalize(15),
    borderRadius: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: normalize(5),
    shadowOffset: { width: 0, height: normalize(2) },
  },
  iconWrapper: {
    width: normalize(55), // Skala
    height: normalize(55), // Skala
    borderRadius: normalize(12),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  actionText: {
    fontSize: normalize(13), // Skala
    fontWeight: '600',
    textAlign: 'center',
    color: '#2D3748',
  },

  // 3. EDUKASI
  infoCard: {
    backgroundColor: '#E6FFFA', 
    padding: normalize(15),
    borderRadius: normalize(12),
    borderLeftWidth: normalize(5),
    borderLeftColor: '#48BB78',
    marginBottom: normalize(20),
    elevation: 1,
  },
  infoTitle: {
    fontSize: normalize(14),
  },
  infoText: {
    marginTop: normalize(10),
    fontSize: normalize(14), // Skala
    color: '#4A5568',
    marginBottom: normalize(10),
  },
  infoButton: {
      backgroundColor: '#3182CE',
      padding: normalize(10),
      borderRadius: normalize(8),
      marginTop: normalize(5),
  },
  infoButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: normalize(14), // Skala
  }
});