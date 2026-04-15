import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    elevation?: 'none' | 'sm' | 'md' | 'lg';
}

const shadowPresets: Record<string, ViewStyle> = {
    none: {},
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 },
};

export const Card = ({
    children,
    onPress,
    style,
    elevation = 'sm',
}: CardProps) => {
    const cardStyle = [styles.base, shadowPresets[elevation], style];

    if (onPress) {
        return (
            <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.9}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
});
