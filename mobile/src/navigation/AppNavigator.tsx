import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { View, Text } from 'react-native';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { KioskSelectionScreen } from '../screens/KioskSelectionScreen';
import { TableSelectionScreen } from '../screens/TableSelectionScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { OrderReviewScreen } from '../screens/OrderReviewScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { TabSummaryScreen } from '../screens/TabSummaryScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { PaymentConfirmationScreen } from '../screens/PaymentConfirmationScreen';

const DummyScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{name} Screen</Text>
    </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="KioskSelection" component={KioskSelectionScreen} />
                <Stack.Screen name="TableSelection" component={TableSelectionScreen} />
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="OrderReview" component={OrderReviewScreen} />
                <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
                <Stack.Screen name="TabSummary" component={TabSummaryScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
