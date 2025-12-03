import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth, signInAnonymously, onAuthStateChanged, User, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { router } from 'expo-router';

// PENTING: Variabel global ini harus disediakan oleh lingkungan eksekusi (misalnya, Canvas).
// Jika Anda menjalankan kode ini secara lokal, ganti dengan konfigurasi Firebase Anda yang sebenarnya.
declare const __firebase_config: string;
declare const __initial_auth_token: string;
declare const __app_id: string;

// Mock Komponen IconSymbol karena aslinya tidak ada di file ini
const IconSymbol = ({ name, size, color }: { name: string, size: number, color: string }) => 
    <Text style={{ fontSize: size, color: color, marginRight: 5 }}>{name.substring(0, 1)}</Text>;

// Inisialisasi Firebase dan Firestore
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let isFirebaseInitialized = false;

try {
    const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    if (Object.keys(firebaseConfig).length > 0) {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseInitialized = true;
    }
} catch (error) {
    console.error("Gagal menginisialisasi Firebase di auth.tsx:", error);
}

export default function AuthScreen() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    // 1. Inisialisasi dan Listener Otentikasi Anonim
    useEffect(() => {
        if (!isFirebaseInitialized) {
            setAuthError("Firebase belum diinisialisasi. Cek konfigurasi.");
            setLoading(false);
            return;
        }

        const initialAuth = async () => {
            try {
                // Coba masuk menggunakan token kustom atau anonim
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Gagal masuk awal:", error);
                setAuthError("Gagal masuk awal. Coba reset identitas.");
            }
        };

        // Listener perubahan status otentikasi
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Jika sudah terotentikasi, langsung arahkan ke halaman toko
                router.replace('/toko'); 
            } else {
                setLoading(false);
            }
        });

        initialAuth(); // Panggil fungsi inisialisasi
        return () => unsubscribe();
    }, []);

    // Fungsi Sign Out (untuk reset identitas anonim)
    const handleSignOut = async () => {
        if (!auth) return;
        setLoading(true);
        try {
            await auth.signOut();
            // Sign in lagi untuk mendapatkan UID anonim baru
            await signInAnonymously(auth); 
        } catch (error) {
            console.error("Gagal Keluar:", error);
            setAuthError("Gagal keluar.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Memuat Otentikasi Anonim...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Status Aplikasi Guest</Text>
            
            {user && (
                <View style={styles.userInfo}>
                    <IconSymbol name="user.circle" size={48} color={'#6c757d'} />
                    <Text style={styles.statusText}>Status: Guest (Anonim)</Text>
                    <Text style={styles.uidText}>UID Anda: {user.uid}</Text>
                    <Text style={styles.noteText}>UID ini menentukan toko yang dapat Anda kelola.</Text>
                </View>
            )}

            {authError && <Text style={styles.errorText}>{authError}</Text>}

            <TouchableOpacity 
                style={styles.signOutButton} 
                onPress={handleSignOut}
                disabled={loading}
            >
                <IconSymbol name="logout" size={20} color="#fff" />
                <Text style={styles.buttonText}>Reset Identitas Anonim</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#007bff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f8f9fa',
        width: '100%',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: '#6c757d',
    },
    uidText: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 5,
        textAlign: 'center',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff', 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 15,
        width: '80%',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#dc3545',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    noteText: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
    }
});