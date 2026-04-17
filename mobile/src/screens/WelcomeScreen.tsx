import React, { useState } from 'react';
import { View, Text, ImageBackground, Image, Dimensions, TouchableOpacity, StyleSheet, Modal, ScrollView, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PromoBanner } from '../components/PromoBanner';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { height } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }: Props) => {
    const [showInfo, setShowInfo] = useState(false);
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/beach-hero.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.safeArea}>
                        {/* Top section - Logo and branding */}
                        <TouchableOpacity style={styles.topSection} onPress={() => setShowInfo(true)} activeOpacity={0.8}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <Text style={styles.arrowHint}>☝️</Text>
                            </Animated.View>
                            <Image
                                source={require('../../assets/app-logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.subtitle}>
                                Use e faça seu pedido agora!
                            </Text>
                        </TouchableOpacity>

                        {/* Bottom section - Promo + CTA buttons */}
                        <View style={styles.bottomSection}>
                            <PromoBanner
                                icon="🍺"
                                title="Cadastre-se e ganhe uma Long Neck!"
                                description="Oferta válida para o primeiro cadastro"
                            />

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => navigation.navigate('Login')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryButtonText}>Entrar na minha conta</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => navigation.navigate('Registration')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.outlineButtonText}>Criar uma conta</Text>
                            </TouchableOpacity>

                            <Text style={styles.termsText}>
                                Ao continuar, você concorda com nossos Termos de Uso
                            </Text>
                        </View>
                    </SafeAreaView>
                </View>
            </ImageBackground>

            {/* Modal de funcionalidades */}
            <Modal transparent visible={showInfo} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInfo(false)}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Tá na Mão 🏖️</Text>
                        <Text style={styles.modalFeature}>✅  Faça pedidos direto da mesa</Text>
                        <Text style={styles.modalFeature}>✅  Acompanhe o preparo em tempo real</Text>
                        <Text style={styles.modalFeature}>✅  Veja a comanda completa</Text>
                        <Text style={styles.modalFeature}>✅  Divida a conta com os amigos</Text>
                        <Text style={styles.modalFeature}>✅  Pague pelo app sem fila</Text>
                        <TouchableOpacity style={styles.modalClose} onPress={() => setShowInfo(false)}>
                            <Text style={styles.modalCloseText}>Entendi!</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        alignItems: 'center',
        paddingTop: height * 0.06,
    },
    arrowHint: {
        fontSize: 24,
        marginBottom: 4,
    },
    logo: {
        width: 240,
        height: 240,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 36,
    },
    primaryButton: {
        backgroundColor: '#1E3A8A',
        borderRadius: 14,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderRadius: 14,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    outlineButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    termsText: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 13,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 28,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalFeature: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 12,
        lineHeight: 22,
    },
    modalClose: {
        backgroundColor: '#1E3A8A',
        borderRadius: 12,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    modalCloseText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
