import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function BelanjaScreen() {
    // Ambil parameter produk dari navigasi
    const params = useLocalSearchParams();
    const shopName = params.shopName as string || "Toko Daur Ulang";
    const productName = params.productName as string || "Produk Tidak Dikenal";
    const productPriceString = params.productPrice as string || "0";
    const productImage = params.productImage as string;
    
    const productPrice = parseFloat(productPriceString);

    // State untuk kuantitas dan alamat
    const [quantity, setQuantity] = useState('1');
    const [address, setAddress] = useState('');

    const total = (parseFloat(quantity) || 0) * productPrice;

    // Fungsi untuk menangani proses checkout (dummy)
    const handleCheckout = () => {
        if (!address.trim()) {
            Alert.alert("Perhatian", "Mohon isi alamat pengiriman Anda.");
            return;
        }

        const quantityNum = parseFloat(quantity);
        if (quantityNum <= 0 || isNaN(quantityNum)) {
            Alert.alert("Perhatian", "Kuantitas harus lebih dari 0.");
            return;
        }

        // Lakukan simulasi proses pemesanan/pembayaran
        Alert.alert(
            "Konfirmasi Pesanan",
            `Anda yakin ingin memesan ${quantityNum}x ${productName} dari ${shopName} dengan total Rp ${total.toLocaleString('id-ID')}?`,
            [
                { text: "Batal", style: 'cancel' },
                { text: "Ya, Pesan", onPress: () => {
                    console.log('Pesanan dikirim:', { 
                        shopName, 
                        productName, 
                        quantity: quantityNum, 
                        total, 
                        address 
                    });
                    Alert.alert("Sukses", "Pesanan Anda telah berhasil dibuat!");
                    // Kembali ke halaman Toko Daur Ulang setelah sukses
                    router.back(); 
                }},
            ]
        );
    };

    return (
        <ScrollView style={styles.fullContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                
                <Text style={styles.title}>Konfirmasi Pesanan</Text>

                {/* Detail Produk */}
                <View style={styles.productDetailCard}>
                    <Text style={styles.sectionTitle}>Detail Produk</Text>
                    <View style={styles.productRow}>
                        <Image
                            source={{ uri: productImage }}
                            style={styles.productImage}
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{productName}</Text>
                            <Text style={styles.shopNameText}>dari {shopName}</Text>
                            <Text style={styles.productPriceText}>Harga Satuan: Rp {productPrice.toLocaleString('id-ID')}</Text>
                        </View>
                    </View>
                </View>

                {/* Formulir Kuantitas */}
                <View style={styles.formCard}>
                    <Text style={styles.label}>Kuantitas Pesanan:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setQuantity(text.replace(/[^0-9]/g, ''))} // Hanya angka
                        value={quantity}
                        keyboardType="numeric"
                        placeholder="Masukkan jumlah"
                    />
                </View>

                {/* Formulir Alamat */}
                <View style={styles.formCard}>
                    <Text style={styles.label}>Alamat Pengiriman:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        onChangeText={setAddress}
                        value={address}
                        multiline
                        numberOfLines={4}
                        placeholder="Masukkan alamat lengkap (Jalan, Nomor, RT/RW, Kelurahan, Kota)"
                    />
                </View>

                {/* Ringkasan Total */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Total Pembayaran:</Text>
                    <Text style={styles.totalAmount}>Rp {total.toLocaleString('id-ID')}</Text>
                </View>

                {/* Tombol Checkout */}
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <IconSymbol name="shop.fill" size={20} color="#fff" />
                    <Text style={styles.checkoutButtonText}>Lanjutkan Pembayaran</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

// Definisikan style dasar kartu di luar StyleSheet.create
const CARD_BASE = {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
};

const styles = StyleSheet.create({
    fullContainer: { 
        flex: 1, 
        backgroundColor: '#f4f4f4'
    },
    scrollContent: {
        paddingBottom: 30,
    },
    container: { 
        padding: 16 
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: '#333',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    // Card styles - Sekarang menggunakan CARD_BASE
    productDetailCard: {
        ...CARD_BASE,
        borderLeftWidth: 5,
        borderLeftColor: '#007bff',
    },
    formCard: CARD_BASE,
    totalCard: {
        ...CARD_BASE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e6f7ff', // Latar belakang biru muda
        borderWidth: 1,
        borderColor: '#007bff',
        paddingVertical: 20,
    },
    
    // Product styles
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    shopNameText: {
        fontSize: 12,
        color: '#6c757d',
    },
    productPriceText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#28a745',
        marginTop: 4,
    },

    // Form styles
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    // Total styles
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#dc3545', // Warna merah untuk jumlah total
    },
    
    // Button styles
    checkoutButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});