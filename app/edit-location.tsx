// app/edit-location.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router'; 
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, DatabaseReference } from "firebase/database";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// KOREKSI PATH: Naik satu tingkat dari app/ ke assets/html/...
const webmapEdit = require('../assets/html/map-edit.html');

// Konfigurasi Firebase (Harus sama dengan di map.tsx)
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

let app;
try { app = initializeApp(firebaseConfig); } catch (e) { /* Already initialized */ }
const db = getDatabase(app);

interface LocationData {
    name: string;
    type: 'bank' | 'shop' | 'other';
    coordinates: string; // "lat,lng"
}

export default function EditLocationScreen() {
    const { id } = useLocalSearchParams(); 
    const locationId = Array.isArray(id) ? id[0] : id;

    // INISIALISASI DENGAN 0 (NUMBER) SEBAGAI NILAI DEFAULT AMAN
    const [loading, setLoading] = useState(true);
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState<'bank' | 'shop' | 'other'>('bank');
    const [editLat, setEditLat] = useState<number>(0); // NILAI AMAN
    const [editLng, setEditLng] = useState<number>(0); // NILAI AMAN
    const webViewRef = useRef<WebView>(null);


    useEffect(() => {
        if (locationId) {
            fetchLocationData(String(locationId));
        } else {
            setLoading(false);
            Alert.alert("Error", "ID Lokasi tidak ditemukan.");
            router.back();
        }
    }, [locationId]);

    const fetchLocationData = async (key: string) => {
        setLoading(true);
        try {
            const pointRef: DatabaseReference = ref(db, `/points/${key}`);
            const snapshot = await get(pointRef);

            if (snapshot.exists()) {
                const data = snapshot.val() as LocationData;
                // Pastikan koordinat diparsing sebagai Number
                const [lat, lng] = data.coordinates.split(",").map(c => Number(c));
                
                setLocationData(data);
                setEditName(data.name);
                setEditType(data.type || 'bank');
                
                // Set state koordinat
                setEditLat(lat);
                setEditLng(lng);
                
                // Kirim koordinat awal ke WebView
                const sendInitialData = setTimeout(() => {
                    const message = JSON.stringify({ 
                        action: 'initial_marker', 
                        lat: lat, 
                        lng: lng 
                    });
                    webViewRef.current?.postMessage(message);
                }, 500); 

                return () => clearTimeout(sendInitialData);
            } else {
                Alert.alert("Error", "Data lokasi tidak ditemukan.");
                router.back();
            }
        } catch (error) {
            console.error("Gagal mengambil data lokasi:", error);
            Alert.alert("Error", "Gagal memuat data lokasi.");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            const { action, lat, lng } = data; 
            
            if (action === 'update_coordinate') {
                // Pastikan nilai yang diterima adalah Number
                setEditLat(Number(lat));
                setEditLng(Number(lng));
            }
        } catch (e) {
            console.error("Kesalahan saat mengurai pesan WebView:", e);
        }
    };

    const handleSave = async () => {
        if (!locationId || !editName || editLat === 0 || editLng === 0) {
            Alert.alert("Peringatan", "Nama dan Koordinat tidak boleh kosong.");
            return;
        }

        setLoading(true);
        const updatedData = {
            name: editName,
            type: editType,
            coordinates: `${editLat},${editLng}`,
            updatedAt: new Date().toISOString()
        };

        try {
            const pointRef = ref(db, `/points/${locationId}`);
            await update(pointRef, updatedData); 
            
            Alert.alert("Sukses", `Lokasi ${editName} berhasil diperbarui.`);
            router.back(); 
        } catch (error) {
            console.error("Gagal menyimpan perubahan:", error);
            Alert.alert("Error", "Gagal menyimpan perubahan lokasi.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#28a745" />
                <Text style={{ marginTop: 10 }}>Memuat data lokasi...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Lokasi: {locationData?.name}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Bagian Input Form */}
                <Text style={styles.label}>Nama Lokasi:</Text>
                <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Masukkan Nama Lokasi"
                />

                <Text style={styles.label}>Tipe Lokasi:</Text>
                <View style={styles.typeContainer}>
                    <TouchableOpacity
                        style={[styles.typeButton, editType === 'bank' && styles.typeButtonActive]}
                        onPress={() => setEditType('bank')}
                    >
                        <Text style={[styles.typeText, editType === 'bank' && styles.typeTextActive]}>Bank Sampah</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, editType === 'shop' && styles.typeButtonActive]}
                        onPress={() => setEditType('shop')}
                    >
                        <Text style={[styles.typeText, editType === 'shop' && styles.typeTextActive]}>Toko Daur Ulang</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Koordinat (Sentuh Titik di Peta):</Text>
                <View style={styles.coordinateDisplay}>
                    {/* IMPLEMENTASI GUARDING KODE YANG LEBIH KUAT */}
                    <Text style={styles.coordText}>
                        Lat: **{editLat !== null && editLat !== undefined ? editLat.toFixed(6) : 'Memuat...'}**
                    </Text>
                    <Text style={styles.coordText}>
                        Lng: **{editLng !== null && editLng !== undefined ? editLng.toFixed(6) : 'Memuat...'}**
                    </Text>
                </View>

                {/* Bagian Peta WebView */}
                <View style={styles.mapContainer}>
                    <WebView
                        ref={webViewRef}
                        source={webmapEdit}
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
                    <Text style={styles.mapHint}>Sentuh peta untuk mengatur ulang posisi lokasi.</Text>
                </View>

                {/* Tombol Simpan */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    typeButtonActive: {
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    typeTextActive: {
        color: '#fff',
    },
    coordinateDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
    },
    coordText: {
        fontSize: 14,
        color: '#333',
    },
    mapContainer: {
        height: 300, 
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    webview: {
        flex: 1,
        minHeight: 1,
    },
    mapHint: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        textAlign: 'center',
        padding: 5,
        fontSize: 12,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});