import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentConfirmation'>;
};

export const PaymentConfirmationScreen = ({ navigation }: Props) => {
    const { closeTab } = useAppStore();

    // Gerar código de voucher decorativo
    const voucherCode = 'PRAIA' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const handleFinish = () => {
        closeTab();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.iconCircle}>
                    <Text style={styles.checkIcon}>✓</Text>
                </View>

                <Text style={styles.title}>Pagamento Aprovado!</Text>

                <Text style={styles.desc}>
                    Obrigado pela preferência. Esperamos que tenha aproveitado o seu dia na praia! 🌊
                </Text>

                {/* Voucher decorativo */}
                <View style={styles.voucherContainer}>
                    <View style={styles.voucherDivider} />
                    <Text style={styles.voucherTitle}>🎁 Voucher de Desconto</Text>
                    <Text style={styles.voucherDesc}>
                        Use o código abaixo na sua próxima visita e ganhe 10% de desconto!
                    </Text>
                    <View style={styles.voucherCodeBox}>
                        <Text style={styles.voucherCode}>{voucherCode}</Text>
                    </View>
                    <Text style={styles.voucherExpiry}>Válido por 30 dias</Text>
                </View>

                <Button title="Voltar ao Início" onPress={handleFinish} style={{ width: '100%' }} />
            </Card>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    checkIcon: {
        fontSize: 40,
        color: '#10B981',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    desc: {
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    // Voucher
    voucherContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    voucherDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 20,
    },
    voucherTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F59E0B',
        marginBottom: 8,
    },
    voucherDesc: {
        color: '#6B7280',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 12,
    },
    voucherCodeBox: {
        backgroundColor: '#FEF3C7',
        borderWidth: 2,
        borderColor: '#F59E0B',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    voucherCode: {
        fontSize: 22,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 3,
    },
    voucherExpiry: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});
