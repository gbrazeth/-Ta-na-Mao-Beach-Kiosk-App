import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

export const GlobalDeliveryModal = () => {
    const { tabItems, updateOrderStatus } = useAppStore();
    
    // Encontrar se tem ALGUM pedido no status 'delivering'
    const deliveringOrder = tabItems.find(o => o.status === 'delivering');
    const isDelivering = !!deliveringOrder;

    if (!isDelivering || !deliveringOrder) return null;

    return (
        <Modal
            transparent={true}
            visible={isDelivering}
            animationType="fade"
        >
            <View style={styles.modalOverlay}>
                <Card style={styles.modalCard}>
                    <View style={styles.modalIconCircle}>
                        <Text style={{ fontSize: 40 }}>🏖️</Text>
                    </View>
                    <Text style={styles.modalTitle}>Seu pedido chegou?</Text>
                    <Text style={styles.modalDesc}>O garçom já saiu com seu pedido e deveria estar chegando à sua mesa. Por favor, confirme o recebimento.</Text>
                    <Button 
                        title="Sim, recebi meu pedido!" 
                        variant="success" 
                        onPress={async () => {
                            try {
                                // Otimista
                                updateOrderStatus(deliveringOrder.orderId, 'completed');
                                await api.put(`/orders/${deliveringOrder.orderId}/status`, { status: 'COMPLETED' });
                            } catch (error) {
                                console.error("Erro ao confirmar entrega global:", error);
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                </Card>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24, zIndex: 9999 },
    modalCard: { padding: 24, alignItems: 'center' },
    modalIconCircle: { width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
    modalDesc: { color: '#6B7280', textAlign: 'center', marginBottom: 24, fontSize: 16 },
});
