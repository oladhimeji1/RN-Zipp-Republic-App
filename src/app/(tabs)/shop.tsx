import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/Common';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { COLLECTIONS, PRODUCTS, productsIn } from '@/lib/data';
import { PAD, TAB_SPACE, W, colors, fonts } from '@/lib/theme';
import { select } from '@/lib/haptics';

const CARD = (W - PAD * 2 - 12) / 2;
const SEGMENTS: { id: 'all' | 'men' | 'women'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
];

const CATEGORIES: { slug: string; tag: string; icon: keyof typeof Ionicons.glyphMap; tone: string }[] = [
  { slug: 'new', tag: 'LATEST DROP', icon: 'flame', tone: '#121212' },
  { slug: 'tshirts', tag: 'JERSEYS & TEES', icon: 'shirt-outline', tone: '#1D2939' },
  { slug: 'slides', tag: 'FOOTWEAR', icon: 'footsteps-outline', tone: '#2C241D' },
  { slug: 'jackets-hoodies', tag: 'OUTERWEAR', icon: 'snow-outline', tone: '#1F2421' },
  { slug: 'jewelry', tag: 'WATCHES & CHAINS', icon: 'watch-outline', tone: '#3A2E1E' },
  { slug: 'hats', tag: 'HEADWEAR', icon: 'sunny-outline', tone: '#252525' },
];

export default function Shop() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState<'all' | 'men' | 'women'>('all');

  const filteredProducts = useMemo(() => {
    if (segment === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.gender === segment || p.gender === 'unisex');
  }, [segment]);

  const trending = useMemo(
    () => [...filteredProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 6),
    [filteredProducts]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* NATIVE HEADER WITH SEGMENTED CONTROL */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Explore</Text>
          <PressableScale onPress={() => router.push('/collection/all')} style={styles.allBtn}>
            <Text style={styles.allBtnText}>Full Catalog</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.ink} />
          </PressableScale>
        </View>

        <PressableScale scaleTo={0.985} onPress={() => router.push('/search')} style={styles.search}>
          <Ionicons name="search" size={17} color={colors.mute} />
          <Text style={styles.searchText}>Search products, colors, categories...</Text>
        </PressableScale>

        <View style={styles.segTrack}>
          {SEGMENTS.map((s) => {
            const on = segment === s.id;
            return (
              <PressableScale
                key={s.id}
                scaleTo={0.97}
                onPress={() => {
                  select();
                  setSegment(s.id);
                }}
                style={[styles.segBtn, on && styles.segBtnOn]}
              >
                <Text style={[styles.segText, on && styles.segTextOn]}>{s.label}</Text>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: TAB_SPACE + 24, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* BENTO CATEGORY DIRECTORY */}
        <View style={styles.catGrid}>
          {CATEGORIES.map((item, i) => {
            const c = COLLECTIONS.find((x) => x.slug === item.slug)!;
            const list = productsIn(item.slug).filter(
              (p) => segment === 'all' || p.gender === segment || p.gender === 'unisex'
            );
            return (
              <Animated.View key={item.slug} entering={FadeInDown.delay(i * 30).duration(220)}>
                <PressableScale
                  scaleTo={0.97}
                  onPress={() => router.push(`/collection/${item.slug}`)}
                  style={[styles.catCard, { width: CARD, backgroundColor: item.tone }]}
                >
                  {c.image ? (
                    <>
                      <Img uri={c.image} style={StyleSheet.absoluteFill as object} contentPosition="top" />
                      <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.82)']}
                        style={StyleSheet.absoluteFill}
                      />
                    </>
                  ) : null}
                  <View style={styles.catTop}>
                    <View style={styles.catIconWrap}>
                      <Ionicons name={item.icon} size={15} color="#fff" />
                    </View>
                    <View style={styles.catCountPill}>
                      <Text style={styles.catCountText}>{list.length}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.catTag}>{item.tag}</Text>
                    <Text style={styles.catTitle} numberOfLines={1}>
                      {item.slug === 'jackets-hoodies' ? 'Outerwear' : c.title}
                    </Text>
                  </View>
                </PressableScale>
              </Animated.View>
            );
          })}
        </View>

        {/* ARCHIVE SALE BANNER */}
        <PressableScale
          scaleTo={0.98}
          onPress={() => router.push('/collection/sale')}
          style={styles.saleBanner}
        >
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>UP TO 65% OFF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.saleTitle}>SEASON ARCHIVE SALE</Text>
            <Text style={styles.saleSub}>Limited sizes remaining across varsity & jerseys</Text>
          </View>
          <View style={styles.saleArrow}>
            <Ionicons name="arrow-forward" size={18} color={colors.ink} />
          </View>
        </PressableScale>

        {/* TRENDING THIS WEEK */}
        <View style={{ marginTop: 28 }}>
          <SectionHeader
            title="Most Wanted"
            sub={`Top rated ${segment === 'all' ? 'pieces' : `${segment}'s pieces`} this week`}
            action="See all"
            onAction={() => router.push(`/collection/${segment === 'all' ? 'all' : segment}`)}
          />
          <View style={styles.grid}>
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} width={CARD} index={i} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    paddingHorizontal: PAD,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.black, fontSize: 30, color: colors.ink, textTransform: 'uppercase' },
  allBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.soft,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 999,
  },
  allBtnText: { fontFamily: fonts.heavy, fontSize: 11, color: colors.ink, textTransform: 'uppercase', letterSpacing: 0.6 },
  search: {
    marginTop: 12,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.soft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.mute },
  segTrack: {
    flexDirection: 'row',
    backgroundColor: colors.soft,
    borderRadius: 12,
    padding: 3,
    marginTop: 12,
  },
  segBtn: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnOn: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  segText: { fontFamily: fonts.bold, fontSize: 13, color: colors.mute },
  segTextOn: { fontFamily: fonts.heavy, color: colors.ink },

  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: PAD,
    marginTop: 6,
  },
  catCard: {
    height: 148,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  catTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCountPill: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  catCountText: { color: '#fff', fontFamily: fonts.heavy, fontSize: 10 },
  catTag: { color: 'rgba(255,255,255,0.72)', fontFamily: fonts.heavy, fontSize: 9.5, letterSpacing: 1.3 },
  catTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 18, textTransform: 'uppercase', marginTop: 2 },

  saleBanner: {
    marginHorizontal: PAD,
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saleBadge: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  saleBadgeText: { color: '#fff', fontFamily: fonts.black, fontSize: 10, letterSpacing: 1 },
  saleTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 16, textTransform: 'uppercase' },
  saleSub: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.medium, fontSize: 11.5, marginTop: 2 },
  saleArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 20, paddingHorizontal: PAD },
});
