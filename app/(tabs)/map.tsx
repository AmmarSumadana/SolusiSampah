import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from 'expo-router';

// LOKASI FILE HTML DENGAN REQUIRE()
const webmap = require('../../assets/html/map.html');

// Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBrsvLRqGgNRZF-3uAupeOD5sWzAtq9Udg",
    authDomain: "solusisampah.firebaseapp.com",
    databaseURL: "https://solusisampah-default-rtdb.firebaseio.com",
    projectId: "solusisampah",
    storageBucket: "solusisampah.firebasestorage.app",
    messagingSenderId: "734428801724",
    appId: "1:734428801724:web:734c6c0c54c2ff9b027eb9",
    measurementId: "G-9TKYHL1ZM0"
};

// Pastikan inisialisasi hanya sekali
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    // Already initialized
}
const db = getDatabase(app);


export default function MapScreen() {

    // FUNGSI UNTUK MENGHAPUS DATA DARI FIREBASE
    const deleteLocation = async (id: string) => {
        try {
            const pointRef = ref(db, `/points/${id}`);
            await remove(pointRef);
            console.log(`Titik ${id} berhasil dihapus.`);
            // Karena menggunakan listener Realtime DB, peta otomatis diperbarui.
            Alert.alert("Berhasil!", "Lokasi berhasil dihapus.");
        } catch (error) {
            console.error("Gagal menghapus titik:", error);
            Alert.alert("Error", "Gagal menghapus lokasi. Silakan coba lagi.");
        }
    };


    // FUNGSI UNTUK MENANGANI PESAN DARI WEBVIEW
    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            // Menerima 'name' (nama lokasi) dari HTML
            const { action, id, name } = data; 

            if (action === 'edit') {
                console.log('Navigating to edit:', id);
                router.push({
                    pathname: '/edit-location', 
                    params: { id: id },       
                });

            } else if (action === 'delete') {
                console.log('Received delete request for:', id, 'Name:', name);

                // --- Implementasi Alert Keren & Native ---
                Alert.alert(
                    "Konfirmasi Penghapusan",
                    `Anda yakin ingin menghapus lokasi "${name}"? Aksi ini tidak dapat dibatalkan.`,
                    [
                        {
                            text: "Batal",
                            style: "cancel"
                        },
                        { 
                            text: "Hapus", 
                            onPress: () => deleteLocation(id), 
                            style: 'destructive' // Warna merah/destruktif
                        }
                    ],
                    { cancelable: true }
                );
            }
        } catch (e) {
            console.error("Kesalahan saat mengurai pesan WebView:", e);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.mapContainer}>
                {/* Map Viewer */}
                <WebView
                    source={webmap}
                    style={styles.webview}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}
                    mixedContentMode="always"
                    scalesPageToFit={true}
                    onMessage={handleWebViewMessage}
                />

                {/* Floating Button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push("/add-location")}
                >
                    <FontAwesome name="plus" size={28} color="#fff" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
        minHeight: 1,
    },

    fab: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#28a745",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    }
});