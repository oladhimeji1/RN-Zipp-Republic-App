import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/Common';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { Ticker } from '@/components/Ticker';
import { COLLECTIONS, HERO_IMAGE, TESTIMONIALS, TICKER_A, TICKER_B, productsIn } from '@/lib/data';
import { firstName, initials } from '@/lib/format';
import { useCartCount, useStore } from '@/lib/store';
import { showToast } from '@/lib/toast';
import { H, PAD, TAB_SPACE, W, colors, fonts } from '@/lib/theme';
import { success, warn } from '@/lib/haptics';

const HERO_H = H * 0.74;
const CARD_W = 170;
const TILE_W = (W - PAD * 2 - 12) / 2;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const count = useCartCount();
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    y.value = e.contentOffset.y;
  });

  const heroImg = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(y.value, [-200, 0, HERO_H], [-100, 0, HERO_H * 0.45], Extrapolation.CLAMP) },
      { scale: interpolate(y.value, [-200, 0], [1.4, 1], Extrapolation.CLAMP) },
    ],
  }));
  const heroText = useAnimatedStyle(() => ({
    opacity: interpolate(y.value, [0, HERO_H * 0.5], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(y.value, [0, HERO_H], [0, -60], Extrapolation.CLAMP) }],
  }));
  const bar = useAnimatedStyle(() => ({
    backgroundColor: `rgba(10,10,10,${interpolate(y.value, [HERO_H * 0.5, HERO_H - 80], [0, 0.94], Extrapolation.CLAMP)})`,
  }));

  const newDrops = productsIn('new');
  const slides = productsIn('slides');
  const jackets = productsIn('jackets-hoodies');
  const tiles = ['tshirts', 'jackets-hoodies', 'slides', 'men', 'women', 'accessories'].map((s) => COLLECTIONS.find((c) => c.slug === s)!);
  const slidesCol = COLLECTIONS.find((c) => c.slug === 'slides')!;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_SPACE + 20 }}>
        {/* HERO */}
        <View style={{ height: HERO_H, overflow: 'hidden', backgroundColor: '#111' }}>
          <Animated.View style={[StyleSheet.absoluteFill, heroImg]}>
            <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" transition={600} />
          </Animated.View>
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.78)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.heroText, heroText]}>
            <Animated.Text entering={FadeInUp.delay(300).springify().damping(16)} style={styles.kicker}>
              NEW DROP · ZIPP 2.0
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(420).springify().damping(16)} style={styles.h1}>
              LUXURY
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(540).springify().damping(16)} style={styles.h2}>
              & Lifestyle
            </Animated.Text>
            <Animated.View entering={FadeInUp.delay(700).springify().damping(16)} style={styles.heroBtns}>
              <Button title="Shop men" variant="light" small style={{ flex: 1 }} onPress={() => router.push('/collection/men')} />
              <Button title="Shop women" variant="outlineLight" small style={{ flex: 1 }} onPress={() => router.push('/collection/women')} />
            </Animated.View>
          </Animated.View>
        </View>

        <View style={styles.sheet}>
          <Ticker items={TICKER_A} dark={false} />

          {/* NEW ARRIVALS */}
          <View style={{ height: 28 }} />
          <SectionHeader title="New arrivals" sub="Explore the newest drops from Zipp Republic" action="View all" onAction={() => router.push('/collection/new')} />
          <FlatList
            horizontal
            data={newDrops}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 14 }}
            snapToInterval={CARD_W + 14}
            decelerationRate="fast"
            renderItem={({ item, index }) => <ProductCard product={item} width={CARD_W} index={index} />}
          />

          {/* CATEGORIES */}
          <View style={{ height: 36 }} />
          <SectionHeader title="Shop by category" />
          <View style={styles.tiles}>
            {tiles.map((c, i) => (
              <Animated.View key={c.slug} entering={FadeInDown.delay(i * 70).springify().damping(18)}>
                <PressableScale onPress={() => router.push(`/collection/${c.slug}`)} style={{ width: TILE_W, height: TILE_W * 1.1, borderRadius: 20, overflow: 'hidden' }}>
                  <Img uri={c.image} tone="#D9C7A8" label={c.title} style={StyleSheet.absoluteFill as object} />
                  <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.tileLabel}>{c.title}</Text>
                  <View style={styles.tileArrow}>
                    <Ionicons name="arrow-forward" size={14} color={colors.ink} />
                  </View>
                </PressableScale>
              </Animated.View>
            ))}
          </View>

          {/* SLIDES BAND */}
          <View style={{ height: 36 }} />
          <PressableScale onPress={() => router.push('/collection/slides')} style={styles.band}>
            <Img uri={slidesCol.image} style={StyleSheet.absoluteFill as object} />
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
            <View style={styles.bandText}>
              <Text style={styles.bandKicker}>ZIPP REPUBLIC SLIDES</Text>
              <Text style={styles.bandTitle}>Buttery soft.{'\n'}All day wear.</Text>
              <Text style={styles.bandCta}>SHOP SLIDES →</Text>
            </View>
          </PressableScale>
          <View style={{ height: 22 }} />
          <FlatList
            horizontal
            data={slides}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 14 }}
            renderItem={({ item, index }) => <ProductCard product={item} width={CARD_W} index={index} ratio={1} />}
          />

          <View style={{ height: 36 }} />
          <Ticker items={TICKER_B} outline />

          {/* JACKETS */}
          <View style={{ height: 36 }} />
          <SectionHeader title="Jackets & hoodies" action="View all" onAction={() => router.push('/collection/jackets-hoodies')} />
          <View style={styles.grid}>
            {jackets.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} width={TILE_W} index={i} />
            ))}
          </View>

          {/* TESTIMONIALS */}
          <View style={{ height: 36 }} />
          <SectionHeader title="Here's what people are saying" />
          <Testimonials />

          {/* NEWSLETTER */}
          <Newsletter />
        </View>
      </Animated.ScrollView>

      {/* TOP BAR */}
      <Animated.View style={[styles.topbar, { paddingTop: insets.top + 8 }, bar]}>
        <PressableScale onPress={() => router.push('/profile')} style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name ?? '')}</Text>
          </View>
          <View>
            <Text style={styles.hi}>Hi, {firstName(user?.name ?? '')}</Text>
            <Text style={styles.member}>ZR MEMBER</Text>
          </View>
        </PressableScale>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <PressableScale onPress={() => router.push('/search')} style={styles.iconBtn}>
            <Ionicons name="search" size={20} color="#fff" />
          </PressableScale>
          <PressableScale onPress={() => router.push('/bag')} style={styles.iconBtn}>
            <Ionicons name="bag-handle-outline" size={20} color="#fff" />
            {count ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            ) : null}
          </PressableScale>
        </View>
      </Animated.View>
    </View>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const cw = W - PAD * 2;
  return (
    <View>
      <FlatList
        horizontal
        data={TESTIMONIALS}
        keyExtractor={(t) => t.name}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cw + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: PAD, gap: 12 }}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / (cw + 12)))}
        renderItem={({ item }) => (
          <View style={[styles.quote, { width: cw }]}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.quoteText}>“{item.text}”</Text>
            <Text style={styles.quoteBy}>
              {item.name} · {item.where}
            </Text>
          </View>
        )}
      />
      <View style={styles.pager}>
        {TESTIMONIALS.map((t, k) => (
          <View key={t.name} style={[styles.pagerDot, k === i && styles.pagerDotOn]} />
        ))}
      </View>
    </View>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const join = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      warn();
      showToast('Enter a valid email address');
      return;
    }
    success();
    setEmail('');
    showToast('You are in! Use code ZIPP10 for 10% off.');
  };
  return (
    <View style={styles.news}>
      <Text style={styles.newsStar}>✱</Text>
      <Text style={styles.newsTitle}>Join the Republic</Text>
      <Text style={styles.newsSub}>Sign up for our newsletter and receive 10% off your first order.</Text>
      <View style={styles.newsRow}>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#777" keyboardType="email-address" autoCapitalize="none" style={styles.newsInput} />
        <PressableScale onPress={join} style={styles.newsBtn}>
          <Ionicons name="arrow-forward" size={20} color={colors.ink} />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroText: { position: 'absolute', left: PAD, right: PAD, bottom: 56 },
  kicker: { color: '#fff', fontFamily: fonts.heavy, fontSize: 12, letterSpacing: 3, opacity: 0.85 },
  h1: { color: '#fff', fontFamily: fonts.black, fontSize: 60, lineHeight: 62, marginTop: 6, letterSpacing: 1 },
  h2: { color: '#fff', fontFamily: fonts.serif, fontSize: 52, lineHeight: 56, marginTop: -4 },
  heroBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  sheet: { marginTop: -28, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: PAD },
  tileLabel: { position: 'absolute', left: 14, bottom: 14, right: 44, color: '#fff', fontFamily: fonts.black, fontSize: 16, textTransform: 'uppercase', lineHeight: 18 },
  tileArrow: { position: 'absolute', right: 10, bottom: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  band: { marginHorizontal: PAD, height: 280, borderRadius: 28, overflow: 'hidden', justifyContent: 'flex-end' },
  bandText: { padding: 22 },
  bandKicker: { color: '#fff', fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 3, opacity: 0.8 },
  bandTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 30, lineHeight: 32, marginTop: 8, textTransform: 'uppercase' },
  bandCta: { color: '#fff', fontFamily: fonts.heavy, fontSize: 12, letterSpacing: 2, marginTop: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: PAD, rowGap: 22 },
  quote: { backgroundColor: colors.soft, borderRadius: 24, padding: 22 },
  stars: { color: colors.ink, fontSize: 16, letterSpacing: 2 },
  quoteText: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 28, color: colors.ink, marginTop: 12 },
  quoteBy: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 1.5, color: colors.mute, marginTop: 14, textTransform: 'uppercase' },
  pager: { flexDirection: 'row', alignSelf: 'center', gap: 6, marginTop: 14 },
  pagerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  pagerDotOn: { width: 20, backgroundColor: colors.ink },
  news: { margin: PAD, marginTop: 36, backgroundColor: colors.ink, borderRadius: 28, padding: 24 },
  newsStar: { color: '#fff', fontSize: 28, fontFamily: fonts.black },
  newsTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 26, marginTop: 8, textTransform: 'uppercase' },
  newsSub: { color: '#a3a099', fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, marginTop: 8 },
  newsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1b1b1b', borderRadius: 999, marginTop: 20, paddingLeft: 18, paddingRight: 5, height: 54 },
  newsInput: { flex: 1, color: '#fff', fontFamily: fonts.medium, fontSize: 15 },
  newsBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  topbar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: PAD, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.black, fontSize: 14, color: colors.ink },
  hi: { color: '#fff', fontFamily: fonts.heavy, fontSize: 14 },
  member: { color: 'rgba(255,255,255,0.7)', fontFamily: fonts.bold, fontSize: 10, letterSpacing: 2, marginTop: 1 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontFamily: fonts.black, fontSize: 10 },
});
