import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeOut, LinearTransition, SlideOutLeft, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/Common';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { QtyStepper } from '@/components/QtyStepper';
import { FREE_SHIPPING_AT, PROMO_CODES, getProduct } from '@/lib/data';
import { naira } from '@/lib/format';
import { computeTotals, useStore } from '@/lib/store';
import { showToast } from '@/lib/toast';
import { PAD, TAB_SPACE, colors, fonts } from '@/lib/theme';
import { success, warn } from '@/lib/haptics';

export default function Bag() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cart = useStore((s) => s.cart);
  const promo = useStore((s) => s.promo);
  const setQty = useStore((s) => s.setQty);
  const removeItem = useStore((s) => s.removeItem);
  const applyPromo = useStore((s) => s.applyPromo);
  const clearPromo = useStore((s) => s.clearPromo);
  const [code, setCode] = useState('');

  const t = computeTotals(cart, promo);
  const remaining = Math.max(0, FREE_SHIPPING_AT - (t.subtotal - t.discount));
  const prog = useSharedValue(0);
  useEffect(() => {
    prog.value = withSpring(Math.min(1, (t.subtotal - t.discount) / FREE_SHIPPING_AT), { damping: 18 });
  }, [t.subtotal, t.discount, prog]);
  const barStyle = useAnimatedStyle(() => ({ width: `${prog.value * 100}%` }));

  const submitPromo = () => {
    if (applyPromo(code)) {
      success();
      showToast(`Code ${code.trim().toUpperCase()} applied`);
      setCode('');
    } else {
      warn();
      showToast('That code is not valid. Try ZIPP10');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_SPACE + 30 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ paddingHorizontal: PAD }}>
        <Text style={styles.title}>Bag</Text>
        <Text style={styles.sub}>{cart.length ? `${cart.reduce((n, c) => n + c.qty, 0)} items` : 'Your bag is empty'}</Text>
      </View>

      {cart.length === 0 ? (
        <EmptyState title="Your bag is empty" text="Looks like you have not picked anything yet. New drops are waiting." cta="Start shopping" onPress={() => router.push('/shop')} />
      ) : (
        <>
          <View style={styles.ship}>
            <Text style={styles.shipText}>
              {remaining === 0 ? 'You unlocked free standard delivery 🎉' : `Add ${naira(remaining)} more for free standard delivery`}
            </Text>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, barStyle]} />
            </View>
          </View>

          <View style={{ paddingHorizontal: PAD, marginTop: 8 }}>
            {cart.map((c) => {
              const p = getProduct(c.productId)!;
              const v = p.variants.find((x) => x.color === c.color) ?? p.variants[0];
              return (
                <Animated.View key={c.key} layout={LinearTransition.springify().damping(18)} exiting={SlideOutLeft.duration(220)} entering={FadeInDown.springify().damping(18)} style={styles.item}>
                  <PressableScale onPress={() => router.push(`/product/${p.id}`)}>
                    <Img uri={v.image} tone={v.hex + '33'} label={p.name} style={styles.thumb} />
                  </PressableScale>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.name} numberOfLines={2}>
                        {p.name}
                      </Text>
                      <PressableScale hitSlop={10} onPress={() => removeItem(c.key)}>
                        <Ionicons name="close" size={20} color={colors.mute} />
                      </PressableScale>
                    </View>
                    <Text style={styles.meta}>
                      {c.color} · {c.size}
                    </Text>
                    <View style={styles.itemBottom}>
                      <QtyStepper value={c.qty} min={0} onChange={(n) => setQty(c.key, n)} />
                      <Text style={styles.price}>{naira(p.price * c.qty)}</Text>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <Animated.View exiting={FadeOut} style={{ paddingHorizontal: PAD, marginTop: 8 }}>
            {promo ? (
              <View style={styles.promoOn}>
                <Ionicons name="pricetag" size={16} color={colors.success} />
                <Text style={styles.promoOnText}>
                  {promo} applied · {Math.round((PROMO_CODES[promo] ?? 0) * 100)}% off
                </Text>
                <PressableScale onPress={clearPromo} hitSlop={10}>
                  <Text style={styles.remove}>Remove</Text>
                </PressableScale>
              </View>
            ) : (
              <View style={styles.promoRow}>
                <TextInput value={code} onChangeText={setCode} placeholder="Promo code" placeholderTextColor="#A9A59D" autoCapitalize="characters" style={styles.promoInput} />
                <PressableScale onPress={submitPromo} style={styles.apply}>
                  <Text style={styles.applyText}>Apply</Text>
                </PressableScale>
              </View>
            )}

            <View style={styles.summary}>
              <Row label="Subtotal" value={naira(t.subtotal)} />
              {t.discount > 0 ? <Row label="Discount" value={`-${naira(t.discount)}`} green /> : null}
              <Row label="Delivery" value={t.shipping === 0 ? 'Free' : naira(t.shipping)} />
              <View style={styles.hr} />
              <Row label="Total" value={naira(t.total)} big />
            </View>
            <Button title="Checkout" icon="lock-closed-outline" onPress={() => router.push('/checkout')} style={{ marginTop: 18 }} />
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
}

function Row({ label, value, big, green }: { label: string; value: string; big?: boolean; green?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, big && styles.sumBig]}>{label}</Text>
      <Text style={[styles.sumValue, big && styles.sumBig, green && { color: colors.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.black, fontSize: 34, color: colors.ink, textTransform: 'uppercase' },
  sub: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute, marginTop: 4, marginBottom: 18 },
  ship: { marginHorizontal: PAD, backgroundColor: colors.soft, borderRadius: 18, padding: 16 },
  shipText: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink },
  track: { height: 6, borderRadius: 3, backgroundColor: '#fff', marginTop: 10, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.ink },
  item: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  thumb: { width: 92, height: 116, borderRadius: 14 },
  name: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginRight: 8, lineHeight: 19 },
  meta: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, marginTop: 4 },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  price: { fontFamily: fonts.black, fontSize: 15, color: colors.ink },
  promoRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  promoInput: { flex: 1, height: 50, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, paddingHorizontal: 18, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  apply: { paddingHorizontal: 22, height: 50, borderRadius: 999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  applyText: { color: '#fff', fontFamily: fonts.heavy, fontSize: 13, letterSpacing: 1 },
  promoOn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, backgroundColor: '#E8F8F0', padding: 14, borderRadius: 16 },
  promoOnText: { flex: 1, fontFamily: fonts.bold, fontSize: 13, color: '#0b7a47' },
  remove: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink, textDecorationLine: 'underline' },
  summary: { marginTop: 22, gap: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.body },
  sumValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sumBig: { fontFamily: fonts.black, fontSize: 19, color: colors.ink },
  hr: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
});
