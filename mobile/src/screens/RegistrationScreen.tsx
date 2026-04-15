import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { api } from '../services/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Registration'>;
};

export const RegistrationScreen = ({ navigation }: Props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            Alert.alert('Sucesso 🎉', 'Conta criada maravilhosamente bem! Faça login.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.error || 'Erro ao tentar registrar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Cadastro" showBack />
            <ScrollView style={styles.content} contentContainerStyle={{ paddingVertical: 24 }} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.subtitle}>Crie sua conta no Tá na Mão para continuar</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Ex: João da Silva" 
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Ex: joao@email.com" 
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
                        placeholder="No mínimo 6 caracteres" 
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry 
                    />
                </View>

                <Text style={styles.termsText}>
                    Ao cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </Text>

                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Cadastrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Já tem conta? Entrar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    content: { flex: 1, paddingHorizontal: 24 },
    subtitle: { fontSize: 16, color: '#374151', marginBottom: 24, fontWeight: '500' },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 50, fontSize: 16, backgroundColor: '#F9FAFB' },
    termsText: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
    primaryButton: { backgroundColor: '#1E3A8A', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    loginLink: { color: '#1E3A8A', textAlign: 'center', fontWeight: '600', fontSize: 14, marginTop: 8, paddingBottom: 40 },
});
