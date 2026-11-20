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
import { showToast } from '@/lib/toast';
import { colors, fonts, radius, spring } from '@/lib/theme';
import { success, tap } from '@/lib/haptics';

interface Props {
  product: Product;
  width: number;
  index?: number;
  ratio?: number; // height / width
  quickAdd?: boolean;
}

export function Heart({ id, size = 17, onDark }: { id: string; size?: number; onDark?: boolean }) {
  const wished = useStore((s) => s.wishlist.includes(id));
  const toggle = useStore((s) => s.toggleWish);
  const sc = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <PressableScale
      hitSlop={10}
      onPress={() => {
        tap();
        sc.value = withSequence(withSpring(1.3, { damping: 14, stiffness: 450 }), withSpring(1, spring.snappy));
        toggle(id);
      }}
      style={[styles.heart, onDark && { backgroundColor: 'rgba(255,255,255,0.94)' }]}
    >
      <Animated.View style={a}>
        <Ionicons name={wished ? 'heart' : 'heart-outline'} size={size} color={wished ? colors.accent : colors.ink} />
      </Animated.View>
    </PressableScale>
  );
}

export function ProductCard({ product: p, width, index = 0, ratio = 1.24, quickAdd = true }: Props) {
  const router = useRouter();
  const addToCart = useStore((s) => s.addToCart);
  const prefs = useStore((s) => s.prefs);
  const v = p.variants[0];
  const pct = discountPct(p);

  const onQuickAdd = () => {
    const defaultSize =
      p.sizes.length === 1
        ? p.sizes[0]
        : p.category === 'slides' && prefs.slideSize && p.sizes.includes(prefs.slideSize)
        ? prefs.slideSize
        : prefs.topSize && p.sizes.includes(prefs.topSize)
        ? prefs.topSize
        : null;

    if (defaultSize) {
      addToCart(p.id, v.color, defaultSize, 1);
      success();
      showToast(`${p.name} (${defaultSize}) added`, 'BAG', () => router.push('/bag'));
    } else {
      tap();
      router.push(`/product/${p.id}`);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 35).duration(240)} style={{ width }}>
      <PressableScale scaleTo={0.97} onPress={() => router.push(`/product/${p.id}`)}>
        <View style={{ borderRadius: radius.md + 2, overflow: 'hidden', backgroundColor: colors.soft }}>
          <Img uri={v.image} tone={v.hex + '33'} label={p.name} style={{ width, height: width * ratio }} />
          {p.badge ? (
            <View style={[styles.badge, p.badge === 'Pre-Order' && { backgroundColor: colors.ink }, p.badge === 'New' && { backgroundColor: '#fff' }]}>
              <Text style={[styles.badgeText, p.badge === 'New' && { color: colors.ink }]}>{p.badge === 'Sale' && pct ? `-${pct}%` : p.badge}</Text>
            </View>
          ) : null}
          <View style={styles.heartWrap}>
            <Heart id={p.id} />
          </View>
          {quickAdd ? (
            <PressableScale hitSlop={8} scaleTo={0.88} onPress={onQuickAdd} style={styles.quickBtn}>
              <Ionicons name="add" size={18} color={colors.ink} />
            </PressableScale>
          ) : null}
        </View>
        <View style={styles.metaTop}>
          <Text style={styles.cat}>{p.category === 'jackets-hoodies' ? 'OUTERWEAR' : p.category.toUpperCase()}</Text>
          {p.variants.length > 1 ? (
            <View style={styles.dots}>
              {p.variants.slice(0, 4).map((x) => (
                <View key={x.color} style={[styles.dot, { backgroundColor: x.hex }]} />
              ))}
            </View>
          ) : null}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {p.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{naira(p.price)}</Text>
          {p.compareAt ? <Text style={styles.compare}>{naira(p.compareAt)}</Text> : null}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  badgeText: { color: '#fff', fontFamily: fonts.heavy, fontSize: 9.5, letterSpacing: 0.8, textTransform: 'uppercase' },
  heartWrap: { position: 'absolute', top: 8, right: 8 },
  heart: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  quickBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  metaTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  cat: { fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 1.4, color: colors.mute },
  name: { marginTop: 2, fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, lineHeight: 17 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  price: { fontFamily: fonts.black, fontSize: 14, color: colors.ink },
  compare: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.mute, textDecorationLine: 'line-through' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.2)' },
});
