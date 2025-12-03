import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert, // Menggunakan Alert dari RN
} from "react-native";
import { useState, useRef } from "react";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Pastikan konfigurasi Firebase tetap sama
const firebaseConfig = {
  apiKey: "AIzaSyBrsvLRqGgNRZF-3uAupeOD5sWzAtq9Udg",
  authDomain: "solusisampah.firebaseapp.com",
  databaseURL: "https://solusisampah-default-rtdb.firebaseio.com",
  projectId: "solusisampah",
  storageBucket: "solusisampah.firebasestorage.app",
  messagingSenderId: "734428801724",
  appId: "1:734428801724:web:734c6c0c54c2ff9b027eb9",
  measurementId: "G-9TKYHL1ZM0",
};

initializeApp(firebaseConfig);
const db = getDatabase();

export default function AddLocationScreen() {
  const [name, setName] = useState("");
  const [coords, setCoords] = useState("");
  const [type, setType] = useState("bank");

  const webviewRef = useRef<WebView>(null); // Ref untuk WebView

  // --- GET CURRENT DEVICE COORDINATES ---
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin lokasi ditolak.", "Kami butuh akses lokasi Anda untuk mendapatkan koordinat otomatis.");
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const newCoords = `${loc.coords.latitude}, ${loc.coords.longitude}`;
      setCoords(newCoords);

      // Kirim koordinat ke WebView untuk memindahkan marker (opsional, tetapi bagus)
      const script = `
        setMarkerAndCenter('${loc.coords.latitude}', '${loc.coords.longitude}');
        true; // Perlu mengembalikan boolean agar injectJavaScript bekerja
      `;
      webviewRef.current?.injectJavaScript(script);

    } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
        Alert.alert("Gagal", "Tidak dapat mengambil lokasi perangkat saat ini.");
    }
  };

  // --- SAVE DATA TO FIREBASE ---
  const savePoint = () => {
    if (!name || !coords) {
      Alert.alert("Perhatian", "Nama & Koordinat wajib diisi.");
      return;
    }

    push(ref(db, "points"), {
      name,
      coordinates: coords,
      type,
    })
      .then(() => {
        Alert.alert("Berhasil", "Lokasi berhasil disimpan!");
        router.back();
      })
      .catch((error) => {
        console.error("Gagal menyimpan data:", error);
        Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan lokasi ke database.");
      });
  };

  // --- HANDLER UNTUK KOORDINAT DARI WEBVIEW ---
  const handleMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    if (data.startsWith('COORDS:')) {
        const newCoords = data.replace('COORDS:', '');
        setCoords(newCoords);
    } else if (data === 'RESET') {
        setCoords('');
    }
  };

  // --- RESET MARKER FUNCTIONALITY ---
  const resetMarker = () => {
    setCoords('');
    const script = 'resetMarker(); true;';
    webviewRef.current?.injectJavaScript(script);
  };
  
  // --- FIX WEBVIEW SOURCE (PENTING) ---
  const htmlSource = require("../assets/html/map-add.html");


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Tambah Lokasi Baru</Text>

      {/* TIPE LOKASI */}
      <Text style={styles.label}>Jenis Lokasi</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === "bank" && styles.typeActiveGreen]}
          onPress={() => setType("bank")}
        >
          <Text style={[styles.typeText, type === "bank" && styles.typeTextActive]}>
            Bank Sampah
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === "shop" && styles.typeActiveBlue]}
          onPress={() => setType("shop")}
        >
          <Text style={[styles.typeText, type === "shop" && styles.typeTextActive]}>
            Toko
          </Text>
        </TouchableOpacity>
      </View>

      {/* INPUT NAMA */}
      <Text style={styles.label}>Nama Lokasi</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* INPUT KOORDINAT */}
      <Text style={styles.label}>Koordinat Lokasi</Text>
      <TextInput
        style={styles.input}
        value={coords}
        onChangeText={setCoords}
        placeholder="Lat, Lng"
      />

      <TouchableOpacity style={styles.locButton} onPress={getUserLocation}>
        <Text style={styles.locButtonText}>Ambil Lokasi Otomatis</Text>
      </TouchableOpacity>

      <Text style={styles.mapLabel}>Klik peta untuk memilih titik lokasi</Text>

      {/* MAP WEBVIEW */}
      <View style={styles.mapBox}>
        <WebView
          ref={webviewRef} // Set ref ke WebView
          source={htmlSource}
          onMessage={handleMessage} // Gunakan handler terpusat
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          mixedContentMode="always"
          style={{ flex: 1 }}
        />
        
        {/* Tombol Reset Marker */}
        {coords ? (
            <TouchableOpacity style={styles.resetButton} onPress={resetMarker}>
                <FontAwesome name="times-circle" size={20} color="#DC3545" />
                <Text style={styles.resetButtonText}>Reset Marker</Text>
            </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={savePoint}>
        <Text style={styles.saveText}>Simpan Lokasi</Text>
      </TouchableOpacity>

      <View style={{ height: 70 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 18 },
  label: { marginTop: 16, fontWeight: "600", fontSize: 16 },

  // TYPE BUTTONS
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  typeActiveGreen: { backgroundColor: "#2F855A" },
  typeActiveBlue: { backgroundColor: "#3182CE" },
  typeText: { fontSize: 16, color: "#2D3748" },
  typeTextActive: { color: "#fff", fontWeight: "bold" },

  // INPUT
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },

  // AUTO LOCATION BUTTON
  locButton: {
    backgroundColor: "#4A5568",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  locButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },

  // MAP
  mapLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },
  mapBox: {
    height: 380,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    marginBottom: 20,
    position: 'relative', // Tambahkan ini
  },
  
  // RESET BUTTON
  resetButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    zIndex: 10, // Pastikan di atas WebView
    gap: 5,
  },
  resetButtonText: {
      color: '#DC3545',
      fontWeight: '600'
  },


  // SAVE BUTTON
  saveButton: {
    backgroundColor: "#2B6CB0",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveText: { textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" },
});