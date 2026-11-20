import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/Common';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { COLLECTIONS, PRODUCTS, productsIn } from '@/lib/data';
import { PAD, TAB_SPACE, W, colors, fonts } from '@/lib/theme';

const ROWS = ['new', 'men', 'women', 'tshirts', 'jackets-hoodies', 'accessories', 'slides', 'sale'];
const CARD = (W - PAD * 2 - 12) / 2;

export default function Shop() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const trending = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_SPACE + 20 }} showsVerticalScrollIndicator={false}>
      <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
        Shop
      </Animated.Text>
      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <PressableScale onPress={() => router.push('/search')} style={styles.search}>
          <Ionicons name="search" size={18} color={colors.mute} />
          <Text style={styles.searchText}>Search jerseys, slides, varsity...</Text>
        </PressableScale>
      </Animated.View>

      <View style={{ gap: 4, marginTop: 6 }}>
        {ROWS.map((slug, i) => {
          const c = COLLECTIONS.find((x) => x.slug === slug)!;
          const tone = slug === 'accessories' ? '#D9C7A8' : slug === 'sale' ? '#C8201A' : '#E9E6DF';
          return (
            <Animated.View key={slug} entering={FadeInRight.delay(120 + i * 60).springify().damping(18)}>
              <PressableScale scaleTo={0.985} onPress={() => router.push(`/collection/${slug}`)} style={styles.row}>
                <Img uri={c.image} tone={tone} style={StyleSheet.absoluteFill as object} contentPosition="top" />
                <LinearGradient colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.05)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
                <Text style={styles.rowTitle}>{c.title}</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginRight: PAD }} />
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>

      <View style={{ height: 34 }} />
      <SectionHeader title="Trending this week" sub="What the Republic is wearing" />
      <View style={styles.grid}>
        {trending.map((p, i) => (
          <ProductCard key={p.id} product={p} width={CARD} index={i} />
        ))}
      </View>

      <View style={{ height: 34 }} />
      <SectionHeader title="Accessories" />
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: PAD }}>
        {['jewelry', 'hats'].map((s) => {
          const c = COLLECTIONS.find((x) => x.slug === s)!;
          return (
            <PressableScale key={s} onPress={() => router.push(`/collection/${s}`)} style={styles.acc}>
              <Text style={styles.accStar}>✱</Text>
              <Text style={styles.accTitle}>{c.title}</Text>
              <Text style={styles.accCount}>{productsIn(s).length} items</Text>
            </PressableScale>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.black, fontSize: 34, color: colors.ink, paddingHorizontal: PAD, textTransform: 'uppercase' },
  search: { marginHorizontal: PAD, marginTop: 14, marginBottom: 18, height: 50, borderRadius: 999, backgroundColor: colors.soft, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 10 },
  searchText: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute },
  row: { height: 112, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: PAD, overflow: 'hidden' },
  rowTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 24, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 22, paddingHorizontal: PAD },
  acc: { flex: 1, height: 130, borderRadius: 24, backgroundColor: colors.ink, padding: 18, justifyContent: 'flex-end' },
  accStar: { position: 'absolute', top: 14, right: 18, color: 'rgba(255,255,255,0.25)', fontSize: 40, fontFamily: fonts.black },
  accTitle: { color: '#fff', fontFamily: fonts.black, fontSize: 20, textTransform: 'uppercase' },
  accCount: { color: '#8c8982', fontFamily: fonts.medium, fontSize: 12, marginTop: 2 },
});
