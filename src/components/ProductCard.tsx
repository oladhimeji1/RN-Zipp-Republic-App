import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { Img } from './Img';
import { PressableScale } from './PressableScale';
import { Product, discountPct } from '@/lib/data';
import { naira } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, fonts, radius } from '@/lib/theme';
import { tap } from '@/lib/haptics';

interface Props {
  product: Product;
  width: number;
  index?: number;
  ratio?: number; // height / width
}

export function Heart({ id, size = 18, onDark }: { id: string; size?: number; onDark?: boolean }) {
  const wished = useStore((s) => s.wishlist.includes(id));
  const toggle = useStore((s) => s.toggleWish);
  const sc = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <PressableScale
      hitSlop={10}
      onPress={() => {
        tap();
        sc.value = withSequence(withSpring(1.35, { damping: 6 }), withSpring(1));
        toggle(id);
      }}
      style={[styles.heart, onDark && { backgroundColor: 'rgba(255,255,255,0.9)' }]}
    >
      <Animated.View style={a}>
        <Ionicons name={wished ? 'heart' : 'heart-outline'} size={size} color={wished ? colors.accent : colors.ink} />
      </Animated.View>
    </PressableScale>
  );
}

export function ProductCard({ product: p, width, index = 0, ratio = 1.25 }: Props) {
  const router = useRouter();
  const v = p.variants[0];
  const pct = discountPct(p);
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 60).springify().damping(18)} style={{ width }}>
      <PressableScale onPress={() => router.push(`/product/${p.id}`)}>
        <View style={{ borderRadius: radius.md, overflow: 'hidden' }}>
          <Img uri={v.image} tone={v.hex + '33'} label={p.name} style={{ width, height: width * ratio }} />
          {p.badge ? (
            <View style={[styles.badge, p.badge === 'Pre-Order' && { backgroundColor: colors.ink }, p.badge === 'New' && { backgroundColor: '#fff' }]}>
              <Text style={[styles.badgeText, p.badge === 'New' && { color: colors.ink }]}>{p.badge === 'Sale' && pct ? `-${pct}%` : p.badge}</Text>
            </View>
          ) : null}
          <View style={styles.heartWrap}>
            <Heart id={p.id} />
          </View>
        </View>
        <Text style={styles.vendor}>ZIPP REPUBLIC</Text>
        <Text style={styles.name} numberOfLines={2}>
          {p.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{naira(p.price)}</Text>
          {p.compareAt ? <Text style={styles.compare}>{naira(p.compareAt)}</Text> : null}
        </View>
        {p.variants.length > 1 ? (
          <View style={styles.dots}>
            {p.variants.slice(0, 5).map((x) => (
              <View key={x.color} style={[styles.dot, { backgroundColor: x.hex }]} />
            ))}
          </View>
        ) : null}
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.accent, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  heartWrap: { position: 'absolute', top: 8, right: 8 },
  heart: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  vendor: { marginTop: 10, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.6, color: colors.mute },
  name: { marginTop: 3, fontFamily: fonts.semi, fontSize: 14, color: colors.ink, lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 8 },
  price: { fontFamily: fonts.heavy, fontSize: 14, color: colors.ink },
  compare: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, textDecorationLine: 'line-through' },
  dots: { flexDirection: 'row', gap: 5, marginTop: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.25)' },
});
