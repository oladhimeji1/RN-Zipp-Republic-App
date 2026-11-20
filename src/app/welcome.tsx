import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { Easing, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Ticker } from '@/components/Ticker';
import { HERO_IMAGE, TICKER_A } from '@/lib/data';
import { PAD, fonts } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const zoom = useSharedValue(1.18);
  useEffect(() => {
    zoom.value = withTiming(1, { duration: 9000, easing: Easing.out(Easing.quad) });
  }, [zoom]);
  const bg = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, bg]}>
        <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" transition={600} />
      </Animated.View>
      <LinearGradient colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.85)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />

      <View style={{ paddingTop: insets.top }}>
        <Ticker items={TICKER_A} />
      </View>

      <Animated.View entering={FadeInDown.delay(250).duration(700)} style={styles.brand}>
        <Text style={styles.star}>✱</Text>
        <Text style={styles.brandText}>ZIPP REPUBLIC</Text>
      </Animated.View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Animated.Text entering={FadeInUp.delay(500).springify().damping(16)} style={styles.kicker}>
          NEW DROP · ZIPP 2.0
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(650).springify().damping(16)} style={styles.headline}>
          Affordable luxury.{'\n'}Premium lifestyle.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(800).springify().damping(16)} style={styles.sub}>
          Every drop, restock and exclusive design, all in one place.
        </Animated.Text>
        <Animated.View entering={FadeInUp.delay(950).springify().damping(16)} style={styles.buttons}>
          <Button title="Sign up" variant="light" style={{ flex: 1 }} onPress={() => router.push('/signup')} />
          <Button title="Sign in" variant="outlineLight" style={{ flex: 1 }} onPress={() => router.push('/signin')} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: PAD, marginTop: 18 },
  star: { color: '#fff', fontSize: 22, fontFamily: fonts.black },
  brandText: { color: '#fff', fontFamily: fonts.black, fontSize: 16, letterSpacing: 3 },
  bottom: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: PAD },
  kicker: { color: '#fff', fontFamily: fonts.heavy, fontSize: 12, letterSpacing: 3, opacity: 0.8 },
  headline: { color: '#fff', fontFamily: fonts.black, fontSize: 40, lineHeight: 42, marginTop: 10, textTransform: 'uppercase' },
  sub: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, marginTop: 12, maxWidth: 300 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 26 },
});
