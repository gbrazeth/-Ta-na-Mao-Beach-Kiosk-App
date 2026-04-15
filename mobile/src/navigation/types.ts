export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Registration: undefined;
    Home: undefined;
    KioskSelection: undefined;
    TableSelection: { kioskId: string };
    Menu: undefined;
    OrderReview: undefined;
    OrderStatus: { orderId?: string };
    TabSummary: undefined;
    Payment: undefined;
    PaymentConfirmation: undefined;
};
