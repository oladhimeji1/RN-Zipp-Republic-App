import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/Common';
import { ProductCard } from '@/components/ProductCard';
import { getProduct } from '@/lib/data';
import { useStore } from '@/lib/store';
import { PAD, TAB_SPACE, W, colors, fonts } from '@/lib/theme';

const CARD = (W - PAD * 2 - 12) / 2;

export default function Saved() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const wishlist = useStore((s) => s.wishlist);
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_SPACE + 20 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: PAD }}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.sub}>{items.length ? `${items.length} item${items.length > 1 ? 's' : ''} you love` : 'Your favourites live here'}</Text>
      </View>
      {items.length === 0 ? (
        <EmptyState title="Nothing saved yet" text="Tap the heart on any piece to keep it here for later." cta="Start exploring" onPress={() => router.push('/shop')} />
      ) : (
        <View style={styles.grid}>
          {items.map((p, i) => (
            <ProductCard key={p!.id} product={p!} width={CARD} index={i} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.black, fontSize: 34, color: colors.ink, textTransform: 'uppercase' },
  sub: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute, marginTop: 4, marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 22, paddingHorizontal: PAD },
});
