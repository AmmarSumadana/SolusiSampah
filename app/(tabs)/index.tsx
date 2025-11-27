import { StyleSheet } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#9AE6B4', dark: '#22543D' }}
      headerImage={<IconSymbol name="map.marker" size={120} color="white" />}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Solusi Sampah</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Selamat Datang</ThemedText>
        <ThemedText>
          Aplikasi untuk menemukan bank sampah, belajar mengolah sampah,
          dan menjual hasil olahan secara online.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#22543D" },
  section: { marginBottom: 16, gap: 8 },
});
