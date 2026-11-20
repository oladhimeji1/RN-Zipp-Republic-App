import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Chip, EmptyState, ScreenHeader } from '@/components/Common';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { Sheet } from '@/components/Sheet';
import { getCollection, productsIn } from '@/lib/data';
import { PAD, W, colors, fonts } from '@/lib/theme';
import { select } from '@/lib/haptics';

const CARD = (W - PAD * 2 - 12) / 2;
type Sort = 'featured' | 'low' | 'high' | 'rated';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
  { id: 'rated', label: 'Top rated' },
];

export default function Collection() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const col = getCollection(String(slug));
  const [gender, setGender] = useState<'all' | 'men' | 'women'>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const items = useMemo(() => {
    let list = productsIn(col.slug);
    if (gender !== 'all') list = list.filter((p) => p.gender === gender || p.gender === 'unisex');
    const s = [...list];
    if (sort === 'low') s.sort((a, b) => a.price - b.price);
    if (sort === 'high') s.sort((a, b) => b.price - a.price);
    if (sort === 'rated') s.sort((a, b) => b.rating - a.rating);
    return s;
  }, [col.slug, gender, sort]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeader
        title={col.title}
        right={
          <PressableScale onPress={() => router.push('/search')} style={styles.round}>
            <Ionicons name="search" size={19} color={colors.ink} />
          </PressableScale>
        }
      />
      <FlatList
        key={`${col.slug}-${gender}-${sort}`}
        data={items}
        numColumns={2}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: PAD }}
        contentContainerStyle={{ paddingBottom: 50, rowGap: 22 }}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.springify()} style={{ marginBottom: 6 }}>
            <Text style={styles.sub}>{col.subtitle}</Text>
            <View style={styles.filters}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['all', 'men', 'women'] as const).map((g) => (
                  <Chip key={g} label={g === 'all' ? 'All' : g === 'men' ? 'Men' : 'Women'} active={gender === g} onPress={() => setGender(g)} />
                ))}
              </View>
              <PressableScale onPress={() => setSortOpen(true)} style={styles.sortBtn}>
                <Ionicons name="swap-vertical" size={16} color={colors.ink} />
                <Text style={styles.sortText}>Sort</Text>
              </PressableScale>
            </View>
            <Text style={styles.count}>{items.length} product{items.length === 1 ? '' : 's'}</Text>
          </Animated.View>
        }
        ListEmptyComponent={<EmptyState title="No matches" text="Try another filter to see more of the collection." />}
        renderItem={({ item, index }) => <ProductCard product={item} width={CARD} index={index} />}
      />

      <Sheet visible={sortOpen} onClose={() => setSortOpen(false)}>
        <Text style={styles.sheetTitle}>Sort by</Text>
        {SORTS.map((s) => (
          <PressableScale
            key={s.id}
            scaleTo={0.985}
            onPress={() => {
              select();
              setSort(s.id);
              setSortOpen(false);
            }}
            style={styles.sortRow}
          >
            <Text style={[styles.sortLabel, sort === s.id && { fontFamily: fonts.black }]}>{s.label}</Text>
            {sort === s.id ? <Ionicons name="checkmark" size={20} color={colors.ink} /> : null}
          </PressableScale>
        ))}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  sub: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute, paddingHorizontal: PAD, marginBottom: 14 },
  filters: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14 },
  sortText: { fontFamily: fonts.heavy, fontSize: 13, color: colors.ink },
  count: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, paddingHorizontal: PAD, marginTop: 12, marginBottom: 6 },
  sheetTitle: { fontFamily: fonts.black, fontSize: 22, textTransform: 'uppercase', color: colors.ink, marginBottom: 8 },
  sortRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  sortLabel: { fontFamily: fonts.semi, fontSize: 16, color: colors.ink },
});
