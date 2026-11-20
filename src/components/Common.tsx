import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { Button } from './Button';
import { PAD, colors, fonts } from '@/lib/theme';

export function SectionHeader({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sec}>
      <View style={{ flex: 1 }}>
        <Text style={styles.secTitle}>{title}</Text>
        {sub ? <Text style={styles.secSub}>{sub}</Text> : null}
      </View>
      {action ? (
        <PressableScale onPress={onAction} hitSlop={10}>
          <Text style={styles.secAction}>{action}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

export function ScreenHeader({ title, right, dark, back = true }: { title?: string; right?: React.ReactNode; dark?: boolean; back?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fg = dark ? '#fff' : colors.ink;
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {back ? (
        <PressableScale onPress={() => router.back()} style={[styles.round, dark && { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <Ionicons name="chevron-back" size={22} color={fg} />
        </PressableScale>
      ) : (
        <View style={{ width: 42 }} />
      )}
      <Text style={[styles.headerTitle, { color: fg }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ minWidth: 42, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function SpinningStar({ size = 40, color = colors.ink }: { size?: number; color?: string }) {
  const r = useSharedValue(0);
  React.useEffect(() => {
    r.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);
  }, [r]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return (
    <Animated.Text style={[{ fontSize: size, color, fontFamily: fonts.black }, a]}>✱</Animated.Text>
  );
}

export function EmptyState({ title, text, cta, onPress }: { title: string; text: string; cta?: string; onPress?: () => void }) {
  return (
    <View style={styles.empty}>
      <SpinningStar size={56} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {cta ? <Button title={cta} onPress={onPress} style={{ marginTop: 22, alignSelf: 'stretch' }} /> : null}
    </View>
  );
}

export function Chip({ label, active, onPress, dark }: { label: string; active?: boolean; onPress?: () => void; dark?: boolean }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.93}
      style={[
        styles.chip,
        dark ? { borderColor: '#333', backgroundColor: '#141414' } : null,
        active && (dark ? { backgroundColor: '#fff', borderColor: '#fff' } : { backgroundColor: colors.ink, borderColor: colors.ink }),
      ]}
    >
      <Text style={[styles.chipText, dark && { color: '#fff' }, active && { color: dark ? colors.ink : '#fff' }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  sec: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: PAD, marginBottom: 16 },
  secTitle: { fontFamily: fonts.black, fontSize: 22, letterSpacing: 0.4, color: colors.ink, textTransform: 'uppercase' },
  secSub: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, marginTop: 3 },
  secAction: { fontFamily: fonts.heavy, fontSize: 12, letterSpacing: 1.2, color: colors.ink, textDecorationLine: 'underline' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD, paddingBottom: 10 },
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.black, fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', marginHorizontal: 8 },
  empty: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 70 },
  emptyTitle: { fontFamily: fonts.black, fontSize: 22, marginTop: 18, textTransform: 'uppercase', color: colors.ink },
  emptyText: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  chip: { paddingHorizontal: 18, height: 40, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  chipText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
});
