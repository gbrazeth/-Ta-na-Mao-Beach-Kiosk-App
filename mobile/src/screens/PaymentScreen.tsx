import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
};

export const PaymentScreen = ({ navigation }: Props) => {
    const { tabItems, kioskName } = useAppStore();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [splitCount, setSplitCount] = useState(1);

    const totalAmount = tabItems.reduce((sum, order) => sum + order.total, 0);
    const perPersonAmount = totalAmount / splitCount;

    const methods = [
        { id: 'pix', title: 'Pix', icon: '📱', desc: 'Aprovação na hora' },
        { id: 'credit', title: 'Cartão de Crédito', icon: '💳', desc: 'Visa, Master, Elo' },
        { id: 'debit', title: 'Cartão de Débito', icon: '💳', desc: 'Visa, Master, Elo' },
        { id: 'cash', title: 'Dinheiro', icon: '💵', desc: 'Pagar no balcão' },
    ];

    const handlePay = () => {
        if (!selectedMethod) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            navigation.navigate('PaymentConfirmation');
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Pagamento" subtitle={kioskName || undefined} showBack />

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total a Pagar</Text>
                    <Text style={styles.totalValue}>R$ {totalAmount.toFixed(2).replace('.', ',')}</Text>
                </View>

                {/* Dividir conta */}
                <Card style={styles.splitCard}>
                    <Text style={styles.splitTitle}>Dividir a conta?</Text>
                    <View style={styles.splitRow}>
                        <View style={styles.splitControls}>
                            <Button
                                title="−"
                                variant="outline"
                                onPress={() => setSplitCount(Math.max(1, splitCount - 1))}
                                style={styles.splitButton}
                            />
                            <View style={styles.splitCountBox}>
                                <Text style={styles.splitCountText}>{splitCount}</Text>
                                <Text style={styles.splitCountLabel}>{splitCount === 1 ? 'pessoa' : 'pessoas'}</Text>
                            </View>
                            <Button
                                title="+"
                                variant="outline"
                                onPress={() => setSplitCount(Math.min(20, splitCount + 1))}
                                style={styles.splitButton}
                            />
                        </View>
                    </View>
                    {splitCount > 1 && (
                        <View style={styles.splitResult}>
                            <Text style={styles.splitResultLabel}>Valor por pessoa:</Text>
                            <Text style={styles.splitResultValue}>R$ {perPersonAmount.toFixed(2).replace('.', ',')}</Text>
                        </View>
                    )}
                </Card>

                <Text style={styles.sectionTitle}>Como você quer pagar?</Text>

                <View style={{ gap: 12 }}>
                    {methods.map(method => {
                        const isSelected = selectedMethod === method.id;
                        return (
                            <Card
                                key={method.id}
                                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                                onPress={() => setSelectedMethod(method.id)}
                            >
                                <View style={styles.methodRow}>
                                    <Text style={{ fontSize: 28, marginRight: 16 }}>{method.icon}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.methodTitle, isSelected && { color: '#1E3A8A' }]}>{method.title}</Text>
                                        <Text style={styles.methodDesc}>{method.desc}</Text>
                                    </View>
                                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                        {isSelected && <View style={styles.radioDot} />}
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                <View style={{ marginTop: 24, gap: 12 }}>
                    <Button
                        title={selectedMethod ? "Confirmar Pagamento" : "Selecione uma forma de pagamento"}
                        onPress={handlePay}
                        disabled={!selectedMethod || isProcessing}
                        isLoading={isProcessing}
                    />
                    <Button
                        title="🍽️ Pedir Mais"
                        variant="outline"
                        onPress={() => navigation.navigate('Menu')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, padding: 16 },
    totalSection: { alignItems: 'center', marginBottom: 24, marginTop: 16 },
    totalLabel: { color: '#6B7280', marginBottom: 4 },
    totalValue: { fontSize: 36, fontWeight: '700', color: '#1E3A8A' },
    splitCard: { padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
    splitTitle: { fontWeight: '700', color: '#1F2937', fontSize: 16, marginBottom: 16, textAlign: 'center' },
    splitRow: { alignItems: 'center' },
    splitControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    splitButton: { width: 48, height: 48 },
    splitCountBox: { alignItems: 'center', minWidth: 80 },
    splitCountText: { fontSize: 32, fontWeight: '700', color: '#1E3A8A' },
    splitCountLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    splitResult: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    splitResultLabel: { color: '#6B7280', fontWeight: '500' },
    splitResultValue: { fontSize: 22, fontWeight: '700', color: '#10B981' },
    sectionTitle: { fontWeight: '700', color: '#1F2937', marginBottom: 16, fontSize: 18 },
    methodCard: { padding: 16, borderWidth: 2, borderColor: 'transparent' },
    methodCardSelected: { borderColor: '#1E3A8A', backgroundColor: 'rgba(30, 58, 138, 0.05)' },
    methodRow: { flexDirection: 'row', alignItems: 'center' },
    methodTitle: { fontWeight: '700', fontSize: 16, color: '#1F2937' },
    methodDesc: { color: '#6B7280', fontSize: 14 },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    radioSelected: { borderColor: '#1E3A8A' },
    radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1E3A8A' },
});
