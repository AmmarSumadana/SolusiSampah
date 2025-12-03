import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'; // Tambahkan router
import { IconSymbol } from '@/components/ui/icon-symbol';

// Interface untuk Produk
interface Product {
    id: string;
    name: string;
    price: number;
    material: string;
    imageUrl: string;
}

// Data dummy produk toko dengan URL gambar yang lebih deskriptif
const dummyProducts: Product[] = [
    { 
        id: 'p1', 
        name: "Pot Bunga dari Botol Plastik", 
        price: 25000, 
        material: "Plastik PET Daur Ulang", 
        imageUrl: "https://placehold.co/100x100/28a745/ffffff?text=Pot+Daur+Ulang" 
    },
    { 
        id: 'p2', 
        name: "Tas Belanja dari Kain Bekas", 
        price: 45000, 
        material: "Limbah Tekstil", 
        imageUrl: "https://placehold.co/100x100/ffc107/333333?text=Tas+Kain" 
    },
    { 
        id: 'p3', 
        name: "Kerajinan Dekoratif dari Kaca", 
        price: 35000, 
        material: "Kaca Bekas", 
        imageUrl: "https://placehold.co/100x100/17a2b8/ffffff?text=Pajangan+Kaca" 
    },
    { 
        id: 'p4', 
        name: "Kompos Organik Super", 
        price: 18000, 
        material: "Limbah Organik", 
        imageUrl: "https://placehold.co/100x100/dc3545/ffffff?text=Kompos+Super" 
    },
];

export default function TokoScreen() {
    // Ambil parameter dari navigasi
    const params = useLocalSearchParams();
    const shopId = params.id as string;
    const shopName = params.name as string || "Toko Daur Ulang";

    // Fungsi untuk menangani klik beli dan navigasi ke halaman belanja
    const handleBuy = (product: Product) => {
        // Navigasi ke halaman belanja dan kirim detail produk
        router.push({
            pathname: '/belanja',
            params: {
                shopId: shopId,
                shopName: shopName,
                productId: product.id,
                productName: product.name,
                productPrice: product.price.toString(), // Kirim sebagai string karena parameter navigasi adalah string
                productImage: product.imageUrl,
            }
        });
    };

    return (
        <ScrollView style={styles.fullContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                
                {/* Header Toko */}
                <View style={styles.header}>
                    {/* Menggunakan ikon shop.fill (asumsi ikon tersedia) */}
                    <IconSymbol name="shop.fill" size={32} color="#007bff" /> 
                    <Text style={styles.shopTitle}>{shopName}</Text>
                    <Text style={styles.shopAddress}>ID Toko: {shopId ? shopId.substring(0, 8) : 'N/A'}... | Produk Daur Ulang Terbaik</Text>
                </View>

                <Text style={styles.sectionTitle}>Produk Daur Ulang (Recycled Goods)</Text>

                {/* Daftar Produk */}
                {dummyProducts.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                        <Image
                            source={{ uri: product.imageUrl }}
                            style={styles.productImage}
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productMaterial}>Bahan: {product.material}</Text>
                            <Text style={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
                        </View>
                        <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(product)}>
                            <Text style={styles.buyButtonText}>Beli</Text>
                        </TouchableOpacity>
                    </View>
                ))}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fullContainer: { 
        flex: 1, 
        backgroundColor: '#fff'
    },
    scrollContent: {
        paddingBottom: 30,
    },
    container: { 
        padding: 16 
    },
    header: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 20,
        alignItems: 'center',
    },
    shopTitle: { 
        fontSize: 28, 
        fontWeight: "bold", 
        color: '#007bff',
        marginTop: 5,
    },
    shopAddress: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
        paddingLeft: 10,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#ccc', // Placeholder color
        resizeMode: 'cover',
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    productMaterial: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 2,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745', // Warna harga hijau
        marginTop: 5,
    },
    buyButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
});