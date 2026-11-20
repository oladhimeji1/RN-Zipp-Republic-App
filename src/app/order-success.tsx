import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { Easing, FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuccessBadge } from '@/components/AuthBits';
import { Button } from '@/components/Button';
import { H, PAD, W, colors, fonts } from '@/lib/theme';

const COLORS = ['#0A0A0A', '#E5231B', '#12B76A', '#F2A6C0', '#2F6FDE', '#C9A24B'];

function Piece({ i }: { i: number }) {
  const cfg = useMemo(
    () => ({
      x: Math.random() * W,
      drift: (Math.random() - 0.5) * 120,
      delay: Math.random() * 500,
      dur: 1800 + Math.random() * 1400,
      size: 8 + Math.random() * 8,
      rot: Math.random() * 720,
      color: COLORS[i % COLORS.length],
      star: i % 3 === 0,
    }),
    [i]
  );
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(cfg.delay, withTiming(1, { duration: cfg.dur, easing: Easing.out(Easing.quad) }));
  }, [p, cfg]);
  const a = useAnimatedStyle(() => ({
    opacity: 1 - p.value * 0.9,
    transform: [{ translateY: p.value * H * 0.7 }, { translateX: p.value * cfg.drift }, { rotate: `${p.value * cfg.rot}deg` }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', top: -20, left: cfg.x }, a]}>
      {cfg.star ? (
        <Text style={{ color: cfg.color, fontSize: cfg.size + 6, fontFamily: fonts.black }}>✱</Text>
      ) : (
        <View style={{ width: cfg.size, height: cfg.size * 0.5, backgroundColor: cfg.color, borderRadius: 2 }} />
      )}
    </Animated.View>
  );
}

export default function OrderSuccess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 28 }).map((_, i) => (
          <Piece key={i} i={i} />
        ))}
      </View>
      <View style={styles.mid}>
        <Animated.View entering={ZoomIn.delay(150).springify().damping(8)}>
          <SuccessBadge size={110} />
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.title}>
          Order placed
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(650).springify()} style={styles.text}>
          Thank you for shopping the Republic. Your order is confirmed and we are getting it ready.
        </Animated.Text>
        <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.box}>
          <Text style={styles.boxLabel}>ORDER NUMBER</Text>
          <Text style={styles.boxValue}>{id}</Text>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(950).springify()} style={{ gap: 12 }}>
        <Button title="Track order" onPress={() => router.replace(`/orders/${id}`)} />
        <Button title="Continue shopping" variant="outline" onPress={() => router.replace('/(tabs)')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', paddingHorizontal: PAD },
  mid: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.black, fontSize: 32, textTransform: 'uppercase', color: colors.ink, marginTop: 26 },
  text: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.mute, textAlign: 'center', marginTop: 10, paddingHorizontal: 12 },
  box: { marginTop: 28, backgroundColor: colors.soft, borderRadius: 22, paddingVertical: 16, paddingHorizontal: 30, alignItems: 'center' },
  boxLabel: { fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 2.5, color: colors.mute },
  boxValue: { fontFamily: fonts.black, fontSize: 24, color: colors.ink, marginTop: 4, letterSpacing: 1 },
});
