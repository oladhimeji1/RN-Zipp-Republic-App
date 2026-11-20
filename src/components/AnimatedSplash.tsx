import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeIn,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';

const WORD = 'ZIPP REPUBLIC'.split('');

export function AnimatedSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const star = useSharedValue(0);
  const tone = useSharedValue(0);
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
    star.value = withSpring(1, { damping: 20, stiffness: 260, mass: 0.7 });
    tone.value = withDelay(750, withTiming(1, { duration: 380 }));
    const t = setTimeout(() => {
      minElapsed.current = true;
      tryExit();
    }, 1450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) tryExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const bg = useAnimatedStyle(() => ({
    opacity: out.value,
    backgroundColor: interpolateColor(tone.value, [0, 1], ['#FFFFFF', colors.ink]),
  }));
  const fg = useAnimatedStyle(() => ({ color: interpolateColor(tone.value, [0, 1], [colors.ink, '#FFFFFF']) }));
  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.2 + star.value * 0.8 }, { rotate: `${(1 - star.value) * -200}deg` }],
    opacity: star.value,
  }));

  return (
    <Animated.View style={[styles.root, bg]} pointerEvents={exited.current ? 'none' : 'auto'}>
      <Animated.Text style={[styles.star, fg, starStyle]}>✱</Animated.Text>
      <View style={styles.word}>
        {WORD.map((c, i) => (
          <Animated.Text
            key={i}
            entering={FadeInDown.delay(220 + i * 28).duration(240)}
            style={[styles.letter, fg, c === ' ' && { width: 12 }]}
          >
            {c}
          </Animated.Text>
        ))}
      </View>
      <Animated.Text entering={FadeIn.delay(680).duration(350)} style={[styles.sub, fg]}>
        AFFORDABLE LUXURY
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 74, fontFamily: fonts.black },
  word: { flexDirection: 'row', marginTop: 14 },
  letter: { fontFamily: fonts.black, fontSize: 30, letterSpacing: 3 },
  sub: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 5, marginTop: 14, opacity: 0.7 },
});
