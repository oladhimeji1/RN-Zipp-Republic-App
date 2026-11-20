import React, { useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Heart, ProductCard } from '@/components/ProductCard';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { QtyStepper } from '@/components/QtyStepper';
import { SectionHeader } from '@/components/Common';
import { Sheet } from '@/components/Sheet';
import { PRODUCTS, REVIEWS, Variant, discountPct, getProduct } from '@/lib/data';
import { naira } from '@/lib/format';
import { useCartCount, useStore } from '@/lib/store';
import { showToast } from '@/lib/toast';
import { PAD, W, colors, fonts, radius } from '@/lib/theme';
import { select, success, warn } from '@/lib/haptics';

const IMG_H = W * 1.22;
const AnimatedList = Animated.FlatList<Variant>;

function Dot({ i, x }: { i: number; x: { value: number } }) {
  const a = useAnimatedStyle(() => ({
    width: interpolate(x.value, [(i - 1) * W, i * W, (i + 1) * W], [6, 22, 6], 'clamp'),
    opacity: interpolate(x.value, [(i - 1) * W, i * W, (i + 1) * W], [0.4, 1, 0.4], 'clamp'),
  }));
  return <Animated.View style={[styles.dot, a]} />;
}

function Accordion({ title, children, open: initial = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <Animated.View layout={LinearTransition.duration(200)} style={styles.acc}>
      <PressableScale scaleTo={0.99} onPress={() => setOpen((o) => !o)} style={styles.accHead}>
        <Text style={styles.accTitle}>{title}</Text>
        <Ionicons name={open ? 'remove' : 'add'} size={20} color={colors.ink} />
      </PressableScale>
      {open ? (
        <Animated.View entering={FadeIn.duration(180)} style={{ paddingBottom: 16 }}>
          {children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const product = getProduct(String(id));
  const prefs = useStore((s) => s.prefs);
  const addToCart = useStore((s) => s.addToCart);
  const count = useCartCount();
  const x = useSharedValue(0);
  const listRef = useRef<FlatList<Variant>>(null);
  const shake = useSharedValue(0);

  const [ci, setCi] = useState(0);
  const [size, setSize] = useState<string | null>(() => {
    if (!product) return null;
    if (product.sizes.length === 1) return product.sizes[0];
    const pref = product.category === 'slides' ? prefs.slideSize : product.category === 'jewelry' || product.category === 'hats' ? null : prefs.topSize;
    return pref && product.sizes.includes(pref) ? pref : null;
  });
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.bold }}>Product not found</Text>
      </View>
    );
  }

  const pct = discountPct(product);
  const variant = product.variants[ci];
  const isPre = product.badge === 'Pre-Order';
  const related = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)).slice(0, 6);

  const pickColor = (i: number) => {
    select();
    setCi(i);
    listRef.current?.scrollToOffset({ offset: i * W, animated: true });
  };

  const add = () => {
    if (!size) {
      warn();
      showToast('Please select a size first');
      shake.value = withSequence(withTiming(-10, { duration: 60 }), withTiming(10, { duration: 60 }), withTiming(-8, { duration: 60 }), withTiming(0, { duration: 60 }));
      return;
    }
    addToCart(product.id, variant.color, size, qty);
    success();
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    showToast(`${product.name} added to bag`, 'VIEW BAG', () => router.push('/bag'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View>
          <AnimatedList
            ref={listRef as never}
            data={product.variants}
            keyExtractor={(v) => v.color}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => setCi(Math.round(e.nativeEvent.contentOffset.x / W))}
            renderItem={({ item }) => <Img uri={item.image} tone={item.hex + '40'} label={`${product.name} · ${item.color}`} style={{ width: W, height: IMG_H }} contentPosition="top" />}
          />
          {product.variants.length > 1 ? (
            <View style={styles.dots}>
              {product.variants.map((v, i) => (
                <Dot key={v.color} i={i} x={x} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.info}>
          <View style={styles.sheetPull} />
          <Animated.View entering={FadeInDown.duration(220)}>
            <View style={styles.vendorRow}>
              <Text style={styles.vendor}>ZIPP REPUBLIC{isPre ? ' · PRE-ORDER' : ''}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={colors.ink} />
                <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
                <Text style={styles.reviews}>({product.reviews})</Text>
              </View>
            </View>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{naira(product.price)}</Text>
              {product.compareAt ? <Text style={styles.compare}>{naira(product.compareAt)}</Text> : null}
              {pct ? (
                <View style={styles.pct}>
                  <Text style={styles.pctText}>SAVE {pct}%</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.blurb}>{product.blurb}</Text>
          </Animated.View>

          {/* COLOR */}
          <Text style={styles.label}>
            COLOR · <Text style={{ color: colors.ink }}>{variant.color}</Text>
          </Text>
          <View style={styles.swatches}>
            {product.variants.map((v, i) => (
              <PressableScale key={v.color} onPress={() => pickColor(i)} scaleTo={0.88} style={[styles.swatchRing, i === ci && { borderColor: colors.ink }]}>
                <View style={[styles.swatch, { backgroundColor: v.hex }]} />
              </PressableScale>
            ))}
          </View>

          {/* SIZE */}
          <View style={styles.sizeHead}>
            <Text style={styles.label}>SIZE</Text>
            {product.sizes.length > 1 ? (
              <PressableScale onPress={() => setGuide(true)} hitSlop={8}>
                <Text style={styles.guide}>Size guide</Text>
              </PressableScale>
            ) : null}
          </View>
          <Animated.View style={[styles.sizes, shakeStyle]}>
            {product.sizes.map((s) => (
              <PressableScale
                key={s}
                scaleTo={0.92}
                onPress={() => {
                  select();
                  setSize(s);
                }}
                style={[styles.size, size === s && styles.sizeOn]}
              >
                <Text style={[styles.sizeText, size === s && { color: '#fff' }]}>{s}</Text>
              </PressableScale>
            ))}
          </Animated.View>

          {/* QTY */}
          <View style={styles.qtyRow}>
            <Text style={styles.label}>QUANTITY</Text>
            <QtyStepper value={qty} onChange={setQty} />
          </View>

          {/* PERKS */}
          <View style={styles.perks}>
            <Perk icon="rocket-outline" text="Delivery across Nigeria" />
            <Perk icon="shield-checkmark-outline" text="100% high quality materials" />
            <Perk icon="refresh-outline" text="Easy returns" />
          </View>

          <Accordion title="Details" open>
            {product.details.map((d) => (
              <View key={d} style={styles.bulletRow}>
                <Text style={styles.bullet}>✱</Text>
                <Text style={styles.bulletText}>{d}</Text>
              </View>
            ))}
          </Accordion>
          <Accordion title="Shipping & returns">
            <Text style={styles.bulletText}>Standard delivery takes 3 to 5 working days and express takes 1 to 2. Orders above ₦150,000 ship free on standard. Pre-order items ship when the drop lands.</Text>
          </Accordion>
          <Accordion title={`Reviews (${product.reviews})`}>
            {REVIEWS.map((r) => (
              <View key={r.name} style={styles.review}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
                <Text style={styles.bulletText}>{r.text}</Text>
              </View>
            ))}
          </Accordion>
        </View>

        {related.length ? (
          <View style={{ marginTop: 30 }}>
            <SectionHeader title="You may also like" />
            <FlatList
              horizontal
              data={related}
              keyExtractor={(p) => p.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: PAD, gap: 14 }}
              renderItem={({ item, index }) => <ProductCard product={item} width={160} index={index} />}
            />
          </View>
        ) : null}
      </ScrollView>

      {/* floating header */}
      <View style={[styles.topBtns, { top: insets.top + 8 }]} pointerEvents="box-none">
        <PressableScale onPress={() => router.back()} style={styles.circle}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </PressableScale>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Heart id={product.id} size={20} onDark />
          <PressableScale onPress={() => router.push('/bag')} style={styles.circle}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.ink} />
            {count ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            ) : null}
          </PressableScale>
        </View>
      </View>

      {/* sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.ctaLabel}>TOTAL</Text>
          <Text style={styles.ctaPrice}>{naira(product.price * qty)}</Text>
        </View>
        <Button
          title={added ? 'Added ✓' : isPre ? 'Pre-order now' : 'Add to bag'}
          variant={added ? 'accent' : 'primary'}
          onPress={add}
          style={{ flex: 1, marginLeft: 18 }}
        />
      </View>

      <Sheet visible={guide} onClose={() => setGuide(false)}>
        <Text style={styles.sheetTitle}>Size guide</Text>
        {product.category === 'slides' ? (
          <GuideTable head={['EU', 'Foot length']} rows={product.sizes.map((s, i) => [s, `${(24.5 + i * 0.7).toFixed(1)} cm`])} />
        ) : (
          <GuideTable
            head={['Size', 'Chest', 'Length']}
            rows={[
              ['XS', '86 to 91 cm', '66 cm'],
              ['S', '91 to 96 cm', '69 cm'],
              ['M', '96 to 101 cm', '72 cm'],
              ['L', '101 to 106 cm', '75 cm'],
              ['XL', '106 to 111 cm', '78 cm'],
              ['XXL', '111 to 117 cm', '81 cm'],
            ]}
          />
        )}
        <Text style={styles.guideNote}>Measurements are approximate. If you are between sizes, size up for a relaxed fit.</Text>
      </Sheet>
    </View>
  );
}

function Perk({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.perk}>
      <Ionicons name={icon} size={20} color={colors.ink} />
      <Text style={styles.perkText}>{text}</Text>
    </View>
  );
}

function GuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}>
      <View style={[styles.tr, { backgroundColor: colors.soft }]}>
        {head.map((h) => (
          <Text key={h} style={[styles.td, { fontFamily: fonts.heavy }]}>
            {h}
          </Text>
        ))}
      </View>
      {rows.map((r) => (
        <View key={r[0]} style={styles.tr}>
          {r.map((c, i) => (
            <Text key={i} style={[styles.td, i === 0 && { fontFamily: fonts.heavy }]}>
              {c}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { position: 'absolute', bottom: 42, alignSelf: 'center', flexDirection: 'row', gap: 6, backgroundColor: 'rgba(0,0,0,0.28)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  dot: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
  info: { marginTop: -26, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: PAD, paddingTop: 12 },
  sheetPull: { width: 38, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 14 },
  vendorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vendor: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 2, color: colors.mute },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.soft, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  name: { fontFamily: fonts.black, fontSize: 25, lineHeight: 28, color: colors.ink, marginTop: 6, textTransform: 'uppercase' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  price: { fontFamily: fonts.black, fontSize: 22, color: colors.ink },
  compare: { fontFamily: fonts.medium, fontSize: 15, color: colors.mute, textDecorationLine: 'line-through' },
  pct: { backgroundColor: colors.accent, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 },
  pctText: { color: '#fff', fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 0.6 },
  rating: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink },
  reviews: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.mute },
  blurb: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21, color: colors.body, marginTop: 14 },
  label: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 2, color: colors.mute, marginTop: 24 },
  swatches: { flexDirection: 'row', gap: 12, marginTop: 12 },
  swatchRing: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.25)' },
  sizeHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  guide: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink, textDecorationLine: 'underline' },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  size: { minWidth: 56, height: 46, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  sizeOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  sizeText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.ink },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  perks: { marginVertical: 24, backgroundColor: colors.soft, borderRadius: 20, padding: 16, gap: 12 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkText: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink },
  acc: { borderTopWidth: 1, borderTopColor: colors.line },
  accHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 },
  accTitle: { fontFamily: fonts.black, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink },
  bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  bullet: { fontSize: 11, marginTop: 3, color: colors.ink },
  bulletText: { flex: 1, fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.body },
  review: { marginBottom: 14, gap: 4 },
  reviewName: { fontFamily: fonts.heavy, fontSize: 13, color: colors.ink },
  reviewDate: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  reviewStars: { fontSize: 13, color: colors.ink, letterSpacing: 1 },
  topBtns: { position: 'absolute', left: PAD, right: PAD, flexDirection: 'row', justifyContent: 'space-between' },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontFamily: fonts.black, fontSize: 10 },
  cta: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: PAD, paddingTop: 12, flexDirection: 'row', alignItems: 'center' },
  ctaLabel: { fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 2, color: colors.mute },
  ctaPrice: { fontFamily: fonts.black, fontSize: 18, color: colors.ink, marginTop: 1 },
  sheetTitle: { fontFamily: fonts.black, fontSize: 22, textTransform: 'uppercase', color: colors.ink, marginBottom: 14 },
  tr: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  td: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  guideNote: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, marginTop: 14, lineHeight: 17 },
});
