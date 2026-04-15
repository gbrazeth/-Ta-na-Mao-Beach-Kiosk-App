import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { PromoBanner } from '../components/PromoBanner';
import { api } from '../services/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'KioskSelection'>;
};

export const KioskSelectionScreen = ({ navigation }: Props) => {
    const [kiosks, setKiosks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/kiosks')
           .then(response => {
               setKiosks(response.data);
           })
           .catch(error => {
               console.error("Erro ao carregar quiosques:", error);
           })
           .finally(() => {
               setIsLoading(false);
           });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Selecione o Quiosque" showBack />

            <View style={styles.content}>
                <PromoBanner
                    icon="🎁"
                    title="Promoção do dia: 2 Caipirinhas por R$35!"
                    description="Aproveite em qualquer quiosque parceiro"
                />

                <Text style={styles.description}>
                    Onde você está? Selecione o quiosque mais próximo para continuar.
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#1E3A8A" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={kiosks}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Card
                                style={styles.card}
                                onPress={() => navigation.navigate('TableSelection', { kioskId: item.id })}
                            >
                                <View style={styles.cardContent}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.kioskName}>{item.name}</Text>
                                        <Text style={styles.kioskLocation}>{item.description}</Text>
                                        <Text style={styles.distanceText}>📍 ~200m de você</Text>
                                    </View>
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.ratingText}>⭐ Novo</Text>
                                    </View>
                                </View>
                            </Card>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    description: {
        color: '#6B7280',
        marginBottom: 24,
        fontSize: 16,
    },
    card: {
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    kioskName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    kioskLocation: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    distanceText: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: '500',
    },
    ratingBadge: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: '#F59E0B',
        fontWeight: '700',
        fontSize: 14,
    },
});
