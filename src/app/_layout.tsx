import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
  Archivo_900Black,
} from '@expo-google-fonts/archivo';
import { DMSerifDisplay_400Regular_Italic } from '@expo-google-fonts/dm-serif-display';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { ToastHost } from '@/components/ToastHost';
import { useStore } from '@/lib/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
    Archivo_900Black,
    DMSerifDisplay_400Regular_Italic,
  });
  const hydrated = useStore((s) => s.hydrated);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#fff' } }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="greeting" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="personalise" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="order-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <ToastHost />
      {!splashDone && (
        <AnimatedSplash
          ready={hydrated}
          onDone={() => {
            if (!useStore.getState().user) router.replace('/welcome');
            setSplashDone(true);
          }}
        />
      )}
    </GestureHandlerRootView>
  );
}
