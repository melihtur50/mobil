import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '@/services/notificationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  useEffect(() => {
    registerForPushNotificationsAsync();
    const cleanup = setupNotificationListeners();
    return cleanup;
  }, []);

  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="agency-auth" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  );
}
