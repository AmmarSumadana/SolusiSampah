import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState, useEffect } from 'react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Interface untuk mendefinisikan struktur data Bank Sampah
interface LocationItem {
    id: string;
    name: string;
    type: 'bank' | 'shop' | string;
    // Asumsi 'address' adalah properti yang ada di DB untuk ditampilkan di list
    address?: string; 
    coordinates?: string;
    // Tambahkan properti lain yang mungkin ada (e.g., hours, phone)
}

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

// Pastikan inisialisasi hanya sekali
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    // Already initialized
}
const db = getDatabase(app);


export default function BankScreen() {
    const [banks, setBanks] = useState<LocationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(db, 'points');
        
        // Listener real-time untuk /points
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const loadedBanks: LocationItem[] = [];

            if (data) {
                // Iterasi dan filter hanya untuk tipe 'bank'
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    if (item.type === 'bank') {
                        loadedBanks.push({
                            id: key,
                            name: item.name || "Bank Sampah (Nama Tidak Diketahui)",
                            // Menggunakan address jika ada, jika tidak, gunakan koordinat sebagai fallback
                            address: item.address || (item.coordinates ? `Koordinat: ${item.coordinates}` : 'Alamat tidak tersedia'), 
                            type: item.type,
                            coordinates: item.coordinates
                        });
                    }
                });
            }

            // Urutkan berdasarkan nama
            loadedBanks.sort((a, b) => a.name.localeCompare(b.name));

            setBanks(loadedBanks);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching bank data:", error);
            setIsLoading(false);
            Alert.alert("Error", "Gagal memuat data Bank Sampah dari database.");
        });

        // Cleanup function untuk melepaskan listener saat komponen di-unmount
        return () => unsubscribe();
    }, []); 

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#28a745" />
                <Text style={styles.loadingText}>Memuat daftar Bank Sampah...</Text>
            </View>
        );
    }
    
    return (
        <ScrollView style={styles.fullContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <Text style={styles.title}>Daftar Bank Sampah</Text>

                {banks.length === 0 ? (
                    <Text style={styles.emptyText}>Tidak ada Bank Sampah yang terdaftar saat ini.</Text>
                ) : (
                    banks.map((bank) => (
                        <View key={bank.id} style={styles.card}>
                            <View style={styles.row}>
                                {/* Menggunakan ikon recycle untuk bank sampah */}
                                <IconSymbol name="list.banksampah" size={22} color="#28a745" /> 
                                <Text style={styles.cardTitle}>{bank.name}</Text>
                            </View>
                            <Text style={styles.addressText}>{bank.address}</Text>
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
        backgroundColor: '#f4f4f4' // Latar belakang yang lebih menarik
    },
    scrollContent: {
        paddingBottom: 20, // Tambahkan padding bawah agar tidak terpotong
    },
    container: { 
        padding: 16 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold",
        marginTop: 15, 
        marginBottom: 16,
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
        elevation: 4, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#28a745', // Warna penanda Bank Sampah
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: "700",
        color: '#22543D',
        flexShrink: 1,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 32, // Sesuaikan dengan ukuran ikon
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
    }
});