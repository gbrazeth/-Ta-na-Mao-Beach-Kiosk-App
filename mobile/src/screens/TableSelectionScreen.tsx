import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { PromoBanner } from '../components/PromoBanner';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'TableSelection'>;
    route: RouteProp<RootStackParamList, 'TableSelection'>;
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 64) / 3;

export const TableSelectionScreen = ({ navigation, route }: Props) => {
    const { kioskId } = route.params;
    const setKioskAndTable = useAppStore(state => state.setKioskAndTable);
    
    const [tables, setTables] = useState<any[]>([]);
    const [kioskName, setKioskName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/kiosks')
           .then(response => {
               const kiosk = response.data.find((k: any) => k.id === kioskId);
               if (kiosk) {
                   setKioskName(kiosk.name || '');
                   if (kiosk.tables) {
                       const sortedTables = kiosk.tables.sort((a: any, b: any) => a.number - b.number);
                       setTables(sortedTables);
                   }
               }
           })
           .catch(error => {
               console.error("Erro ao carregar mesas:", error);
           })
           .finally(() => {
               setIsLoading(false);
           });
    }, [kioskId]);

    const handleSelectTable = (tableId: string) => {
        setKioskAndTable(kioskId, kioskName, tableId);
        navigation.navigate('Menu');
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Selecione sua Mesa" subtitle={kioskName} showBack />

            <View style={styles.content}>
                <PromoBanner
                    icon="🍺"
                    title="Happy Hour até 18h!"
                    description="Chopp e Long Neck com 20% OFF"
                />

                <Text style={styles.description}>
                    Em qual mesa você vai assentar?
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#1E3A8A" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={tables}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isAvailable = item.status === 'AVAILABLE';
                            return (
                                <Card
                                    style={[
                                        styles.tableCard,
                                        { width: cardWidth },
                                        isAvailable ? styles.availableCard : styles.occupiedCard,
                                    ]}
                                    onPress={() => isAvailable ? handleSelectTable(item.id) : undefined}
                                    elevation={isAvailable ? 'sm' : 'none'}
                                >
                                    <Text style={{ fontSize: 24, marginBottom: 4 }}>🏖️</Text>
                                    <Text style={[styles.tableNumber, !isAvailable && { color: '#9CA3AF' }]}>
                                        Mesa {item.number}
                                    </Text>
                                    {!isAvailable && (
                                        <Text style={styles.occupiedText}>Ocupada</Text>
                                    )}
                                </Card>
                            );
                        }}
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
        textAlign: 'center',
    },
    tableCard: {
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    availableCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(30, 58, 138, 0.2)',
    },
    occupiedCard: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tableNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    occupiedText: {
        fontSize: 10,
        color: '#EF4444',
        fontWeight: '500',
        marginTop: 4,
    },
});
