import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

const COLORS = {
    primary: '#1E3A8A',
    secondary: '#F59E0B',
    success: '#10B981',
    danger: '#EF4444',
    white: '#FFFFFF',
};

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    style,
    icon,
}: ButtonProps) => {
    const variantStyles: Record<string, ViewStyle> = {
        primary: { backgroundColor: COLORS.primary },
        secondary: { backgroundColor: COLORS.secondary },
        outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary },
        danger: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.danger },
        success: { backgroundColor: COLORS.success },
    };

    const textColors: Record<string, string> = {
        primary: COLORS.white,
        secondary: COLORS.white,
        outline: COLORS.primary,
        danger: COLORS.danger,
        success: COLORS.white,
    };

    const sizeStyles: Record<string, ViewStyle> = {
        sm: { paddingVertical: 8, paddingHorizontal: 16 },
        md: { paddingVertical: 12, paddingHorizontal: 24, height: 48 },
        lg: { paddingVertical: 16, paddingHorizontal: 32, height: 56 },
    };

    const textSizes: Record<string, TextStyle> = {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                variantStyles[variant],
                sizeStyles[size],
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={textColors[variant]} />
            ) : (
                <>
                    {icon && icon}
                    <Text style={[
                        styles.text,
                        textSizes[size],
                        { color: textColors[variant] },
                        icon ? { marginLeft: 8 } : undefined,
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    text: {
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.5,
    },
});
