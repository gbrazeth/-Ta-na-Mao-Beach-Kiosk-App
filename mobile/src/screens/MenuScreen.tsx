import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Menu'>;
};

export const MenuScreen = ({ navigation }: Props) => {
    const { kioskId, kioskName, tableId, tableNumber, cart, updateCartQuantity, setProducts } = useAppStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setLocalProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (kioskId) {
            api.get(`/kiosks/${kioskId}/menu`)
                .then(response => {
                    const loadedCategories = response.data;
                    setCategories(loadedCategories);
                    if (loadedCategories.length > 0) {
                        setActiveCategory(loadedCategories[0].id);
                    }
                    
                    // Flatten products for easy local mapping and store sharing
                    const allProducts = loadedCategories.flatMap((c: any) => c.products);
                    setLocalProducts(allProducts);
                    setProducts(allProducts); // Share with OrderReviewScreen
                })
                .catch(e => console.error("Erro ao carregar menu:", e))
                .finally(() => setIsLoading(false));
        }
    }, [kioskId]);

    const filteredProducts = activeCategory 
        ? products.filter(p => p.categoryId === activeCategory)
        : products;

    const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartTotal = Object.entries(cart).reduce((sum, [productId, qty]) => {
        const product = products.find(p => p.id === productId);
        return sum + (product ? product.price * qty : 0);
    }, 0);

    const renderProduct = ({ item }: { item: any }) => {
        const quantity = cart[item.id] || 0;

        return (
            <Card style={styles.productCard}>
                <View style={styles.productRow}>
                    {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={[styles.productImage, { backgroundColor: '#F3F4F6' }]} resizeMode="cover" />
                    ) : (
                        <View style={styles.productIcon}>
                            <Text style={{ fontSize: 28 }}>{item.icon || '🍽️'}</Text>
                        </View>
                    )}
                    <View style={{ flex: 1, paddingLeft: item.imageUrl ? 16 : 0 }}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
                        <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginLeft: 8 }}>
                        {quantity > 0 ? (
                            <View style={styles.quantityControl}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateCartQuantity(item.id, quantity - 1)}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => updateCartQuantity(item.id, quantity + 1)}
                                >
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => updateCartQuantity(item.id, 1)}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <TopBar
                title="Cardápio"
                subtitle={kioskName || undefined}
                rightElement={
                    tableNumber ? (
                        <View style={styles.tableBadge}>
                            <Text style={styles.tableBadgeText}>Mesa {tableNumber}</Text>
                        </View>
                    ) : undefined
                }
            />

            {/* Categories */}
            <View style={styles.categoriesBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryChip,
                                activeCategory === category.id ? styles.categoryActive : styles.categoryInactive,
                            ]}
                            onPress={() => setActiveCategory(category.id)}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: activeCategory === category.id ? '#FFFFFF' : '#6B7280' },
                            ]}>
                                {category.icon} {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={renderProduct}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Cart */}
            {cartItemsCount > 0 && (
                <View style={styles.floatingCart}>
                    <TouchableOpacity
                        style={styles.floatingCartInner}
                        onPress={() => navigation.navigate('OrderReview')}
                    >
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                        </View>
                        <Text style={styles.cartLabel}>Ver itens selecionados</Text>
                        <Text style={styles.cartTotal}>R$ {cartTotal.toFixed(2).replace('.', ',')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    categoriesBar: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, zIndex: 10 },
    categoryChip: { marginRight: 12, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    categoryActive: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
    categoryInactive: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
    categoryText: { fontWeight: '500' },
    productCard: { padding: 16, marginBottom: 16 },
    productRow: { flexDirection: 'row', alignItems: 'center' },
    productImage: { width: 80, height: 80, borderRadius: 12 },
    productIcon: { width: 64, height: 64, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    productName: { fontSize: 18, fontWeight: '700', color: '#111827' },
    productDesc: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
    productPrice: { color: '#1E3A8A', fontWeight: '700' },
    quantityControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, height: 40 },
    quantityButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    quantityButtonText: { fontSize: 20, color: '#1E3A8A', fontWeight: '500' },
    quantityText: { fontWeight: '700', width: 24, textAlign: 'center' },
    addButton: { backgroundColor: 'rgba(30, 58, 138, 0.1)', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    addButtonText: { color: '#1E3A8A', fontSize: 20, fontWeight: '500' },
    tableBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    tableBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    floatingCart: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#1E3A8A', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8, padding: 4 },
    floatingCartInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    cartBadge: { backgroundColor: 'rgba(255,255,255,0.2)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    cartBadgeText: { color: '#FFFFFF', fontWeight: '700' },
    cartLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
    cartTotal: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
});
