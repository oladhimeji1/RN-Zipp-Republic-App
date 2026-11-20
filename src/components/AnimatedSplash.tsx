import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LOGO_WHITE } from '@/lib/data';
import { colors, fonts } from '@/lib/theme';

export function AnimatedSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const scale = useSharedValue(0.84);
  const opacity = useSharedValue(0);
  const out = useSharedValue(1);
  const minElapsed = useRef(false);
  const exited = useRef(false);

  const tryExit = () => {
    if (exited.current || !minElapsed.current) return;
    exited.current = true;
    out.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.quad) }, (fin) => {
      if (fin) runOnJS(onDone)();
    });
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 360 });
    scale.value = withSpring(1, { damping: 22, stiffness: 240, mass: 0.7 });
    const t = setTimeout(() => {
      minElapsed.current = true;
      tryExit();
    }, 1350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) tryExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const bg = useAnimatedStyle(() => ({
    opacity: out.value,
    backgroundColor: colors.ink,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.root, bg]} pointerEvents={exited.current ? 'none' : 'auto'}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image source={LOGO_WHITE} style={styles.logo} contentFit="contain" />
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(420).duration(350)} style={styles.sub}>
        AFFORDABLE LUXURY · STREET CULTURE
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  logo: { width: 220, height: 42 },
  sub: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 3.5,
    marginTop: 18,
  },
});
