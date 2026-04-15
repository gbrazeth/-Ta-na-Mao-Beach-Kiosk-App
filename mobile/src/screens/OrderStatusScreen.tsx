import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'OrderStatus'>;
    route: RouteProp<RootStackParamList, 'OrderStatus'>;
};

export const OrderStatusScreen = ({ navigation, route }: Props) => {
    const { tabItems, kioskName, updateOrderStatus } = useAppStore();
    const orderId = route.params?.orderId;
    const currentOrder = tabItems.find(o => o.orderId === orderId) || tabItems[tabItems.length - 1];

    useEffect(() => {
        if (!currentOrder || !currentOrder.orderId) return;

        // Poll the server every 3 seconds to check the actual order status
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/orders/${currentOrder.orderId}`);
                const serverStatus = response.data.status?.toLowerCase();
                if (serverStatus && serverStatus !== currentOrder.status) {
                    updateOrderStatus(currentOrder.orderId, serverStatus);
                }
            } catch (error) {
                console.log("Polling error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentOrder?.orderId, currentOrder?.status]);

    if (!currentOrder) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Nenhum pedido ativo encontrado.</Text>
                <Button title="Voltar" onPress={() => navigation.navigate('Home')} style={{ marginTop: 16 }} />
            </SafeAreaView>
        );
    }

    const steps = [
        { id: 'preparing', title: 'Em Preparo', desc: 'Estamos preparando seu pedido', icon: '🍳' },
        { id: 'ready', title: 'Pronto', desc: 'Pedido pronto no balcão', icon: '✅' },
        { id: 'delivering', title: 'Em Entrega', desc: 'Garçom a caminho da mesa', icon: '🚶' },
        { id: 'completed', title: 'Finalizado', desc: 'Pedido entregue', icon: '🎉' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentOrder.status);
    const isDelivering = currentOrder?.status === 'delivering';

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Status do Pedido" subtitle={kioskName || undefined} />

            <View style={styles.content}>
                <Card style={styles.successCard}>
                    <Text style={styles.successTitle}>Pedido Recebido! ✓</Text>
                    <Text style={styles.successDesc}>A cozinha já está preparando seu pedido.</Text>
                </Card>

                <View style={styles.timeline}>
                    {steps.map((step, index) => {
                        const isActive = index === currentStepIndex;
                        const isCompleted = index < currentStepIndex;

                        return (
                            <View key={step.id} style={styles.timelineStep}>
                                {index < steps.length - 1 && (
                                    <View style={[styles.connector, { backgroundColor: isCompleted ? '#10B981' : '#E5E7EB' }]} />
                                )}
                                <View style={[
                                    styles.stepCircle,
                                    { backgroundColor: isCompleted ? '#10B981' : isActive ? '#F59E0B' : '#E5E7EB' },
                                ]}>
                                    <Text style={[styles.stepIcon, (isCompleted || isActive) && { color: '#FFFFFF' }]}>
                                        {isCompleted ? '✓' : step.icon}
                                    </Text>
                                </View>
                                <View style={styles.stepText}>
                                    <Text style={[styles.stepTitle, !(isCompleted || isActive) && { color: '#9CA3AF' }]}>{step.title}</Text>
                                    <Text style={[styles.stepDesc, !(isCompleted || isActive) && { color: '#9CA3AF' }]}>{step.desc}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ gap: 12, marginTop: 16 }}>
                    {/* Botão inline de confirmação de entrega */}
                    {isDelivering && (
                        <Button
                            title="✅ Confirmar recebimento do pedido"
                            variant="success"
                            onPress={() => updateOrderStatus(currentOrder.orderId, 'completed')}
                        />
                    )}
                    <Button title="📋 Ver sua comanda" variant="secondary" onPress={() => navigation.navigate('TabSummary')} />
                    <Button title="🍽️ Pedir Mais Itens" variant="primary" onPress={() => navigation.navigate('Menu')} />
                </View>
            </View>

            {/* Modal de confirmação de entrega do garçom */}
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
                            onPress={() => updateOrderStatus(currentOrder.orderId, 'completed')} 
                            style={{ width: '100%' }}
                        />
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, padding: 16 },
    successCard: { padding: 24, marginBottom: 24, alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
    successTitle: { fontSize: 20, fontWeight: '700', color: '#10B981', marginBottom: 8 },
    successDesc: { color: '#6B7280', textAlign: 'center' },
    timeline: { flex: 1, paddingLeft: 16 },
    timelineStep: { flexDirection: 'row', marginBottom: 32, position: 'relative' },
    connector: { position: 'absolute', left: 19, top: 40, bottom: -40, width: 2 },
    stepCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    stepIcon: { fontSize: 18, opacity: 0.5 },
    stepText: { marginLeft: 16, flex: 1, justifyContent: 'center' },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    stepDesc: { fontSize: 14, color: '#6B7280' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalCard: { padding: 24, alignItems: 'center' },
    modalIconCircle: { width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
    modalDesc: { color: '#6B7280', textAlign: 'center', marginBottom: 24, fontSize: 16 },
});
