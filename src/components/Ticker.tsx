import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';

interface Props {
  items: string[];
  dark?: boolean;
  speed?: number; // px per second
  outline?: boolean;
}

export function Ticker({ items, dark = true, speed = 55, outline }: Props) {
  const [w, setW] = useState(0);
  const x = useSharedValue(0);

  useEffect(() => {
    if (!w) return;
    cancelAnimation(x);
    x.value = 0;
    x.value = withRepeat(withTiming(-w, { duration: (w / speed) * 1000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(x);
  }, [w, speed, x]);

  const a = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fg = dark ? '#fff' : colors.ink;

  const set = (
    <View style={styles.set}>
      {items.concat(items).map((t, i) => (
        <View key={i} style={styles.item}>
          <Text style={[styles.text, { color: fg }, outline && i % 2 === 1 && { opacity: 0.55 }]}>{t}</Text>
          <Text style={[styles.star, { color: fg }]}>✱</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.bar, { backgroundColor: dark ? colors.ink : colors.soft }]}>
      <Animated.View style={[styles.row, a]}>
        <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>{set}</View>
        {set}
        {set}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 40, overflow: 'hidden', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  set: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center' },
  text: { fontFamily: fonts.heavy, fontSize: 12, letterSpacing: 2 },
  star: { marginHorizontal: 18, fontSize: 12 },
});
