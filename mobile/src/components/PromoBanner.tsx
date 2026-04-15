import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PromoBannerProps {
    icon?: string;
    title: string;
    description?: string;
}

export const PromoBanner = ({ icon = '🎉', title, description }: PromoBannerProps) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F59E0B', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.icon}>{icon}</Text>
                <View style={styles.textArea}>
                    <Text style={styles.title}>{title}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    textArea: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    description: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        marginTop: 2,
    },
});
