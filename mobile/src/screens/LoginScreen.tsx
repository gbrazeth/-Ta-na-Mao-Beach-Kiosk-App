import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen = ({ navigation }: Props) => {
    const setUser = useAppStore(state => state.setUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data;
            setUser(user, token);
            // Salvar token no axios para próximas requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            Alert.alert('Sucesso', 'Login realizado com sucesso!');
            navigation.navigate('KioskSelection');
        } catch (error: any) {
            Alert.alert('Erro no Login', error.response?.data?.error || 'Não foi possível acessar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Acessar Conta" showBack />
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.headerArea}>
                    <Text style={styles.iconBig}>👤</Text>
                    <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                    <Text style={styles.subtitle}>Entre com seus dados para continuar</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="seu@email.com" 
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="••••••••" 
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry 
                    />
                </View>

                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.registerLink}>Não tem conta? Comece Agora</Text>
                </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    headerArea: { alignItems: 'center', marginBottom: 40 },
    iconBig: { fontSize: 64, marginBottom: 16 },
    title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6B7280' },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 50, fontSize: 16, backgroundColor: '#F9FAFB' },
    primaryButton: { backgroundColor: '#1E3A8A', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 20 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    registerLink: { color: '#1E3A8A', textAlign: 'center', fontWeight: '600', fontSize: 14 },
});
