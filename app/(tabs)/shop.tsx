import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router'; // Import router untuk navigasi

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Interface untuk mendefinisikan struktur data Toko/Item (Struktur sama dengan LocationItem)
interface LocationItem {
    id: string;
    name: string;
    type: 'bank' | 'shop' | string;
    // Di sini kita asumsikan properti "address" atau "description" toko ada di DB
    address?: string; 
    coordinates?: string;
    // Tambahkan properti lain yang relevan untuk toko, misalnya item yang dijual
    items?: string[]; 
}

// Konfigurasi Firebase (Harus sama dengan di file lain)
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


export default function ShopScreen() {
    const [shops, setShops] = useState<LocationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(db, 'points');
        
        // Listener real-time untuk /points
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const loadedShops: LocationItem[] = [];

            if (data) {
                // Iterasi dan filter hanya untuk tipe 'shop'
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    if (item.type === 'shop') {
                        loadedShops.push({
                            id: key,
                            name: item.name || "Toko Daur Ulang (Nama Tidak Diketahui)",
                            // Menggunakan address jika ada, jika tidak, gunakan koordinat sebagai fallback
                            address: item.address || (item.coordinates ? `Koordinat: ${item.coordinates}` : 'Alamat tidak tersedia'), 
                            type: item.type,
                            coordinates: item.coordinates
                            // Properti 'items' dapat diisi di sini jika ada di DB
                        });
                    }
                });
            }

            // Urutkan berdasarkan nama
            loadedShops.sort((a, b) => a.name.localeCompare(b.name));

            setShops(loadedShops);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching shop data:", error);
            setIsLoading(false);
            Alert.alert("Error", "Gagal memuat data Toko Daur Ulang dari database.");
        });

        // Cleanup function untuk melepaskan listener saat komponen di-unmount
        return () => unsubscribe();
    }, []); 

    // Fungsi untuk navigasi ke halaman detail toko
    const handleViewShop = (shopId: string, shopName: string) => {
        router.push({
            pathname: '/toko', 
            params: { 
                id: shopId, 
                name: shopName 
            },       
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Memuat daftar Toko Daur Ulang...</Text>
            </View>
        );
    }
    
    return (
        <ScrollView style={styles.fullContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <IconSymbol name="shop.fill" size={28} color="#007bff" />
                    <Text style={styles.title}>Toko Daur Ulang</Text>
                </View>

                {shops.length === 0 ? (
                    <Text style={styles.emptyText}>Tidak ada Toko Daur Ulang yang terdaftar saat ini.</Text>
                ) : (
                    shops.map((shop) => (
                        <View key={shop.id} style={styles.card}>
                            <View style={styles.row}>
                                <IconSymbol name="shop.fill" size={22} color="#007bff" /> 
                                <Text style={styles.cardTitle}>{shop.name}</Text>
                            </View>
                            <Text style={styles.addressText}>{shop.address}</Text>
                            
                            {/* Tombol Lihat Toko dengan navigasi */}
                            <TouchableOpacity 
                                style={styles.detailButton} 
                                onPress={() => handleViewShop(shop.id, shop.name)}
                            >
                                <Text style={styles.detailButtonText}>Lihat Toko</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fullContainer: { 
        flex: 1, 
        backgroundColor: '#f4f4f4'
    },
    scrollContent: {
        paddingBottom: 20,
    },
    container: { 
        padding: 16 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10, 
        marginBottom: 16 
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: '#333'
    },
    row: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10,
        marginBottom: 4,
    },
    card: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 4, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#007bff', // Warna penanda Toko Daur Ulang (Biru)
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: "700",
        color: '#0056b3',
        flexShrink: 1,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 32, // Sesuaikan dengan ukuran ikon
        marginBottom: 8,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555'
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20
    },
    detailButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    detailButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
});