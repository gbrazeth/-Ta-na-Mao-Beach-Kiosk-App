import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

interface TopBarProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export const TopBar = ({ title, subtitle, showBack = false, rightElement }: TopBarProps) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.side}>
                {showBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.titleArea}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={[styles.side, { alignItems: 'flex-end' }]}>
                {rightElement && rightElement}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E3A8A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        minHeight: 64,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
    },
    side: {
        width: 40,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    titleArea: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 18,
    },
    subtitle: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        marginTop: 2,
    },
});
