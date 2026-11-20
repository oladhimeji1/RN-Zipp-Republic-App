import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { HERO_IMAGE } from '@/lib/data';
import { PAD, fonts } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const zoom = useSharedValue(1.12);
  useEffect(() => {
    zoom.value = withTiming(1, { duration: 6000, easing: Easing.out(Easing.quad) });
  }, [zoom]);
  const bg = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, bg]}>
        <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
      </Animated.View>
      <LinearGradient colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.92)']} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />

      <Animated.View entering={FadeInDown.duration(350)} style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <View style={styles.brand}>
          <Text style={styles.star}>✱</Text>
          <Text style={styles.brandText}>ZIPP REPUBLIC</Text>
        </View>
        <PressableScale onPress={() => router.replace('/(tabs)')} style={styles.guestPill}>
          <Text style={styles.guestText}>Explore as Guest</Text>
        </PressableScale>
      </Animated.View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.kickerPill}>
          <View style={styles.liveDot} />
          <Text style={styles.kicker}>DROP 02 · ZIPP 2.0 LIVE</Text>
        </Animated.View>
        <Animated.Text entering={FadeInUp.delay(180).duration(320)} style={styles.headline}>
          Affordable luxury.{'\n'}Street culture.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(250).duration(320)} style={styles.sub}>
          App-exclusive drops, instant restock alerts and one-tap checkout across Nigeria.
        </Animated.Text>
        <Animated.View entering={FadeInUp.delay(320).duration(320)} style={styles.buttons}>
          <Button title="Create account" variant="light" style={{ flex: 1 }} onPress={() => router.push('/signup')} />
          <Button title="Sign in" variant="outlineLight" style={{ flex: 1 }} onPress={() => router.push('/signin')} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  star: { color: '#fff', fontSize: 20, fontFamily: fonts.black },
  brandText: { color: '#fff', fontFamily: fonts.black, fontSize: 15, letterSpacing: 2.5 },
  guestPill: { backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999 },
  guestText: { color: '#fff', fontFamily: fonts.bold, fontSize: 12 },
  bottom: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: PAD },
  kickerPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#12B76A' },
  kicker: { color: '#fff', fontFamily: fonts.heavy, fontSize: 10.5, letterSpacing: 1.8 },
  headline: { color: '#fff', fontFamily: fonts.black, fontSize: 38, lineHeight: 40, marginTop: 12, textTransform: 'uppercase' },
  sub: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.medium, fontSize: 14.5, lineHeight: 20, marginTop: 10, maxWidth: 320 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
