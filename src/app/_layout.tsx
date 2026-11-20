import React, { useEffect, useRef, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { CormorantGaramond_600SemiBold_Italic } from '@expo-google-fonts/cormorant-garamond';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { ToastHost } from '@/components/ToastHost';
import { useStore } from '@/lib/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    CormorantGaramond_600SemiBold_Italic,
  });
  const hydrated = useStore((s) => s.hydrated);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const routed = useRef(false);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  // Route beneath the opaque AnimatedSplash BEFORE it begins fading out so the
  // Home tab never flashes when launching into Welcome or Greeting.
  useEffect(() => {
    if (!loaded || !hydrated || routed.current) return;
    routed.current = true;
    const s = useStore.getState();
    if (!s.user) router.replace('/welcome');
    else if (!s.onboarded) router.replace('/greeting');
  }, [loaded, hydrated, router]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#fff' } }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="welcome" options={{ animation: 'none', gestureEnabled: false }} />
        <Stack.Screen name="greeting" options={{ animation: 'none', gestureEnabled: false }} />
        <Stack.Screen name="personalise" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="order-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <ToastHost />
      {!splashDone && (
        <AnimatedSplash
          ready={hydrated}
          onDone={() => {
            setSplashDone(true);
          }}
        />
      )}
    </GestureHandlerRootView>
  );
}
