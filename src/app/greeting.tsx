import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpinningStar } from '@/components/Common';
import { firstName } from '@/lib/format';
import { useStore } from '@/lib/store';
import { PAD, fonts } from '@/lib/theme';

export default function Greeting() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/personalise'), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Pressable style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]} onPress={() => router.replace('/personalise')}>
      <Animated.View entering={FadeIn.duration(350)}>
        <SpinningStar size={34} color="#fff" />
      </Animated.View>
      <View style={styles.mid}>
        <Animated.Text entering={FadeInDown.delay(150).duration(300)} style={styles.hi}>
          Hi
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(260).duration(320)} style={styles.name} numberOfLines={2} adjustsFontSizeToFit>
          {firstName(user?.name ?? '')}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(380).duration(320)} style={styles.text}>
          Welcome to the Republic. Give us a minute and we will tailor the store to you.
        </Animated.Text>
      </View>
      <Animated.Text entering={FadeInUp.delay(500).duration(320)} style={styles.since}>
        MEMBER SINCE {user?.since ?? new Date().getFullYear()}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: PAD },
  mid: { flex: 1, justifyContent: 'center' },
  hi: { color: '#9d9a93', fontFamily: fonts.medium, fontSize: 18 },
  name: { color: '#fff', fontFamily: fonts.black, fontSize: 52, marginTop: 4, textTransform: 'uppercase' },
  text: { color: '#8c8982', fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, marginTop: 14, maxWidth: 290 },
  since: { color: '#6d6a64', fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 3 },
});
