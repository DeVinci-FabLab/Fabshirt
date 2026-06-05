import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SessionProvider } from '../components/SessionContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="activity-live" options={{ headerShown: false }} />
          <Stack.Screen name="activities-summary" options={{ headerShown: false }} />
          <Stack.Screen name="detail-bpm" options={{ headerShown: false }} />
          <Stack.Screen name="detail-imu" options={{ headerShown: false }} />
          <Stack.Screen name="detail-transpiration" options={{ headerShown: false }} />
          <Stack.Screen name="detail-temperature" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}