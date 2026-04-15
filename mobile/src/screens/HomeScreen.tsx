import React, { useState } from 'react';
import { View, Text, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('KioskSelection');
        }, 800);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../../assets/app-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.subtitle}>
                            Faça login para gerenciar seus pedidos nos quiosques da praia.
                        </Text>
                    </View>

                    <View style={{ gap: 16 }}>
                        <View>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu e-mail"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Sua senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Button
                            title="Entrar na minha conta"
                            onPress={handleLogin}
                            isLoading={isLoading}
                            style={{ marginTop: 8 }}
                        />

                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Não tem uma conta? </Text>
                            <TouchableOpacity>
                                <Text style={styles.signupLink}>Cadastre-se</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    signupText: {
        color: '#6B7280',
    },
    signupLink: {
        color: '#1E3A8A',
        fontWeight: '700',
    },
});
