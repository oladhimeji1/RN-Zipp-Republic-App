import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip, EmptyState } from '@/components/Common';
import { PressableScale } from '@/components/PressableScale';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/data';
import { useStore } from '@/lib/store';
import { PAD, W, colors, fonts } from '@/lib/theme';

const CARD = (W - PAD * 2 - 12) / 2;
const POPULAR = ['Jersey', 'Slides', 'Varsity', 'Hoodie', 'Cap', 'Watch'];

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recent = useStore((s) => s.recent);
  const addRecent = useStore((s) => s.addRecent);
  const clearRecent = useStore((s) => s.clearRecent);
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter((p) => [p.name, p.category, p.gender, ...p.variants.map((v) => v.color)].join(' ').toLowerCase().includes(t));
  }, [q]);

  const run = (t: string) => {
    setQ(t);
    addRecent(t);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.field}>
          <Ionicons name="search" size={18} color={colors.mute} />
          <TextInput
            autoFocus
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => addRecent(q)}
            placeholder="Search Zipp Republic"
            placeholderTextColor="#A9A59D"
            returnKeyType="search"
            style={styles.input}
          />
          {q ? (
            <PressableScale onPress={() => setQ('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.mute} />
            </PressableScale>
          ) : null}
        </View>
        <PressableScale onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.cancel}>Cancel</Text>
        </PressableScale>
      </View>

      {q.trim() ? (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={{ gap: 12, paddingHorizontal: PAD }}
          contentContainerStyle={{ rowGap: 22, paddingBottom: 60, paddingTop: 8 }}
          ListHeaderComponent={<Text style={styles.count}>{results.length} result{results.length === 1 ? '' : 's'}</Text>}
          ListEmptyComponent={<EmptyState title="No results" text={`We could not find anything for "${q.trim()}". Try a different word.`} />}
          renderItem={({ item, index }) => <ProductCard product={item} width={CARD} index={index} />}
        />
      ) : (
        <Animated.View entering={FadeIn} style={{ paddingHorizontal: PAD, paddingTop: 12 }}>
          {recent.length ? (
            <View style={{ marginBottom: 26 }}>
              <View style={styles.rowHead}>
                <Text style={styles.cap}>RECENT</Text>
                <PressableScale onPress={clearRecent} hitSlop={10}>
                  <Text style={styles.clear}>Clear</Text>
                </PressableScale>
              </View>
              <View style={styles.chips}>
                {recent.map((r) => (
                  <Chip key={r} label={r} onPress={() => run(r)} />
                ))}
              </View>
            </View>
          ) : null}
          <Animated.View entering={FadeInDown.delay(40).duration(200)}>
            <Text style={[styles.cap, { marginBottom: 12 }]}>POPULAR SEARCHES</Text>
            <View style={styles.chips}>
              {POPULAR.map((r) => (
                <Chip key={r} label={r} onPress={() => run(r)} />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: PAD, paddingBottom: 12 },
  field: { flex: 1, height: 50, borderRadius: 999, backgroundColor: colors.soft, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  cancel: { fontFamily: fonts.heavy, fontSize: 14, color: colors.ink },
  count: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, paddingHorizontal: PAD, marginBottom: 12 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cap: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 2, color: colors.mute },
  clear: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink, textDecorationLine: 'underline' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
