import React, { useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'OrderReview'>;
};

export const OrderReviewScreen = ({ navigation }: Props) => {
    const { cart, tableId, kioskName, products, addOrderToTab, clearCart, updateCartQuantity } = useAppStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cartItems = Object.entries(cart)
        .filter(([_, qty]) => qty > 0)
        .map(([productId, qty]) => {
            const product = products.find(p => p.id === productId);
            return { ...product!, qty };
        });

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleConfirmOrder = async () => {
        if (!tableId) {
            Alert.alert('Erro', 'Você precisa selecionar uma mesa inicial primeiro.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/orders', { tableId, cart });
            addOrderToTab(response.data.id, cartTotal);
            navigation.navigate('OrderStatus', { orderId: response.data.id });
        } catch (error: any) {
            console.error(error);
            Alert.alert('Erro', error.response?.data?.error || 'Problema ao despachar o pedido para a cozinha.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelOrder = () => {
        Alert.alert(
            'Cancelar Pedido',
            'Tem certeza que deseja cancelar os itens atuais?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim, Cancelar', style: 'destructive', onPress: () => { clearCart(); navigation.navigate('Menu'); } }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Pedido Atual" subtitle={kioskName || undefined} showBack />

            <View style={styles.content}>
                <Text style={styles.hint}>Revise os itens antes de enviar para a cozinha</Text>

                {cartItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={{ fontSize: 40, marginBottom: 16 }}>🛒</Text>
                        <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
                        <Button title="Voltar ao Cardápio" onPress={() => navigation.navigate('Menu')} style={{ marginTop: 24, width: '100%' }} />
                    </View>
                ) : (
                    <>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={cartItems}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Card style={styles.itemCard}>
                                        <View style={styles.itemRow}>
                                            <View style={styles.itemLeft}>
                                                <Text style={{ fontSize: 20, marginRight: 8 }}>{item.icon}</Text>
                                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                            </View>
                                            <View style={styles.itemRight}>
                                                {/* Controles +/− */}
                                                <View style={styles.quantityControl}>
                                                    <TouchableOpacity
                                                        style={styles.qtyButton}
                                                        onPress={() => updateCartQuantity(item.id, item.qty - 1)}
                                                    >
                                                        <Text style={styles.qtyButtonText}>−</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.qtyText}>{item.qty}</Text>
                                                    <TouchableOpacity
                                                        style={styles.qtyButton}
                                                        onPress={() => updateCartQuantity(item.id, item.qty + 1)}
                                                    >
                                                        <Text style={styles.qtyButtonText}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={styles.itemPrice}>
                                                    R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                                                </Text>
                                            </View>
                                        </View>
                                    </Card>
                                )}
                            />

                            <Card style={styles.totalCard}>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total do Pedido</Text>
                                    <Text style={styles.totalValue}>R$ {cartTotal.toFixed(2).replace('.', ',')}</Text>
                                </View>
                                <View style={styles.estimateRow}>
                                    <Text style={styles.estimateLabel}>⏱️ Prazo Estimado</Text>
                                    <Text style={styles.estimateValue}>20 Minutos</Text>
                                </View>
                            </Card>
                        </View>

                        <View style={styles.actions}>
                            <Button title="✓ Enviar para Cozinha" variant="success" onPress={handleConfirmOrder} isLoading={isSubmitting} style={{ marginBottom: 12 }} />
                            <Button title="Voltar ao Cardápio" variant="outline" onPress={() => navigation.navigate('Menu')} disabled={isSubmitting} style={{ marginBottom: 12 }} />
                            <Button title="Cancelar Pedido" variant="danger" onPress={handleCancelOrder} disabled={isSubmitting} />
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, padding: 16 },
    hint: { color: '#6B7280', marginBottom: 16, fontSize: 14, textAlign: 'center' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#6B7280', fontSize: 18 },
    itemCard: { padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
    itemName: { fontSize: 15, fontWeight: '500', color: '#111827', flexShrink: 1 },
    itemRight: { alignItems: 'flex-end' },
    itemPrice: { color: '#1E3A8A', fontWeight: '700', marginTop: 6 },
    quantityControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, height: 36 },
    qtyButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    qtyButtonText: { fontSize: 18, color: '#1E3A8A', fontWeight: '600' },
    qtyText: { fontWeight: '700', width: 24, textAlign: 'center', fontSize: 15 },
    totalCard: { padding: 16, marginTop: 8, marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    totalLabel: { color: '#6B7280' },
    totalValue: { fontSize: 24, fontWeight: '700', color: '#1E3A8A' },
    estimateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    estimateLabel: { color: '#6B7280', fontSize: 14 },
    estimateValue: { color: '#F59E0B', fontWeight: '700', fontSize: 14 },
    actions: { paddingTop: 8, paddingBottom: 24 },
});
