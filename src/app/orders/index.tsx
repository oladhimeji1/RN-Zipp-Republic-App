import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EmptyState, ScreenHeader } from '@/components/Common';
import { Img } from '@/components/Img';
import { PressableScale } from '@/components/PressableScale';
import { naira, prettyDate } from '@/lib/format';
import { ORDER_STAGES, orderStage, useStore } from '@/lib/store';
import { PAD, colors, fonts } from '@/lib/theme';

export default function Orders() {
  const router = useRouter();
  const orders = useStore((s) => s.orders);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeader title="My orders" />
      <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? <EmptyState title="No orders yet" text="Your orders will show up here." cta="Start shopping" onPress={() => router.replace('/shop')} /> : null}
        {orders.map((o, i) => {
          const stage = orderStage(o, now);
          const done = stage === 3;
          return (
            <Animated.View key={o.id} entering={FadeInDown.delay(i * 70).springify().damping(18)}>
              <PressableScale onPress={() => router.push(`/orders/${o.id}`)} style={styles.card}>
                <View style={styles.top}>
                  <View>
                    <Text style={styles.id}>{o.id}</Text>
                    <Text style={styles.date}>{prettyDate(o.createdAt)}</Text>
                  </View>
                  <View style={[styles.status, done && { backgroundColor: '#E8F8F0' }]}>
                    <Text style={[styles.statusText, done && { color: '#0b7a47' }]}>{ORDER_STAGES[stage]}</Text>
                  </View>
                </View>
                <View style={styles.thumbs}>
                  {o.lines.slice(0, 4).map((l, k) => (
                    <Img key={k} uri={l.image} style={styles.thumb} />
                  ))}
                  <Text style={styles.more}>{o.lines.reduce((n, l) => n + l.qty, 0)} item(s)</Text>
                </View>
                <View style={styles.bottom}>
                  <Text style={styles.total}>{naira(o.total)}</Text>
                  <Text style={styles.link}>View details →</Text>
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 24, padding: 18, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontFamily: fonts.black, fontSize: 16, color: colors.ink },
  date: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, marginTop: 2 },
  status: { backgroundColor: colors.soft, paddingHorizontal: 12, height: 30, borderRadius: 15, justifyContent: 'center' },
  statusText: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 0.6, color: colors.ink, textTransform: 'uppercase' },
  thumbs: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  thumb: { width: 52, height: 64, borderRadius: 10 },
  more: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, marginLeft: 6 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line },
  total: { fontFamily: fonts.black, fontSize: 17, color: colors.ink },
  link: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink, letterSpacing: 0.5 },
});
