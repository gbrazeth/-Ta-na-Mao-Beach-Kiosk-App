import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'TabSummary'>;
};

export const TabSummaryScreen = ({ navigation }: Props) => {
    const { tableId, tableNumber, kioskName, tabItems, products } = useAppStore();

    // Calcula o total geral consumido
    const tabTotal = tabItems.reduce((sum, order) => sum + order.total, 0);

    const getProductDetails = (productId: string) => {
        return products.find(p => p.id === productId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Sua Comanda" subtitle={kioskName || undefined} showBack />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerLabel}>Mesa {tableNumber}</Text>
                    <Text style={styles.headerCount}>{tabItems.length} Pedidos</Text>
                </View>

                {tabItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Sua comanda está vazia.</Text>
                        <Button title="Fazer um Pedido" onPress={() => navigation.navigate('Menu')} />
                    </View>
                ) : (
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {tabItems.map((order, index) => (
                            <Card key={order.orderId} style={styles.orderCard}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderTitle} numberOfLines={1}>Pedido #{index + 1}</Text>
                                    <Text style={styles.orderTotal}>R$ {order.total.toFixed(2).replace('.', ',')}</Text>
                                </View>

                                {Object.entries(order.items).map(([productId, quantity]) => {
                                    if (quantity === 0) return null;
                                    const product = getProductDetails(productId);
                                    return (
                                        <View key={productId} style={styles.itemRow}>
                                            <Text style={styles.itemText} numberOfLines={1}>{quantity}x {product?.name}</Text>
                                            <Text style={styles.itemPrice}>R$ {((product?.price || 0) * quantity).toFixed(2).replace('.', ',')}</Text>
                                        </View>
                                    );
                                })}

                                <View style={styles.orderFooter}>
                                    <Text style={styles.timeText}>
                                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>
                                            {order.status === 'completed' ? 'Entregue' : order.status}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </ScrollView>
                )}

                {tabItems.length > 0 && (
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Acumulado</Text>
                            <Text style={styles.totalValue}>R$ {tabTotal.toFixed(2).replace('.', ',')}</Text>
                        </View>
                        <Button title="💳 Fechar Mesa e Pagar" onPress={() => navigation.navigate('Payment')} style={{ marginBottom: 12 }} />
                        <Button title="Pedir Mais" variant="outline" onPress={() => navigation.navigate('Menu')} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, padding: 16 },
    header: { marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 },
    headerLabel: { color: '#6B7280', fontWeight: '500' },
    headerCount: { color: '#6B7280', fontSize: 14 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#6B7280', marginBottom: 16 },
    orderCard: { padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8, marginBottom: 8 },
    orderTitle: { fontWeight: '700', color: '#111827', flexShrink: 1 },
    orderTotal: { color: '#1E3A8A', fontWeight: '500' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    itemText: { color: '#6B7280', flex: 1, marginRight: 8 },
    itemPrice: { color: '#6B7280' },
    orderFooter: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between' },
    timeText: { fontSize: 12, color: '#9CA3AF' },
    statusBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: '500', color: '#6B7280', textTransform: 'capitalize' },
    footer: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
    totalLabel: { fontSize: 18, fontWeight: '700', color: '#374151' },
    totalValue: { fontSize: 28, fontWeight: '700', color: '#1E3A8A' },
});
