import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '@/components/Common';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { Button } from '@/components/Button';
import { firstName, initials } from '@/lib/format';
import { useStore } from '@/lib/store';
import { PAD, TAB_SPACE, colors, fonts } from '@/lib/theme';

const TOP = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SLIDES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const prefs = useStore((s) => s.prefs);
  const setPrefs = useStore((s) => s.setPrefs);
  const orders = useStore((s) => s.orders.length);
  const saved = useStore((s) => s.wishlist.length);
  const bag = useStore((s) => s.cart.length);
  const notifications = useStore((s) => s.notifications);
  const setNotifications = useStore((s) => s.setNotifications);
  const signOut = useStore((s) => s.signOut);
  const [sizes, setSizes] = useState(false);
  const [pay, setPay] = useState(false);

  const logout = () =>
    Alert.alert('Sign out', 'You will need to sign in again to check out.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/welcome');
        },
      },
    ]);

  const MENU: { icon: keyof typeof Ionicons.glyphMap; label: string; sub?: string; onPress: () => void }[] = [
    { icon: 'cube-outline', label: 'My orders', sub: `${orders} order${orders === 1 ? '' : 's'}`, onPress: () => router.push('/orders') },
    { icon: 'location-outline', label: 'Addresses', onPress: () => router.push('/addresses') },
    { icon: 'card-outline', label: 'Payment methods', onPress: () => setPay(true) },
    { icon: 'resize-outline', label: 'Size preferences', sub: [prefs.topSize, prefs.slideSize && `EU ${prefs.slideSize}`].filter(Boolean).join(' · ') || 'Not set', onPress: () => setSizes(true) },
    { icon: 'logo-instagram', label: 'Follow @zipprepublic', onPress: () => Linking.openURL('https://www.instagram.com/zipprepublic').catch(() => {}) },
    { icon: 'help-buoy-outline', label: 'Help & support', onPress: () => Linking.openURL('https://shopzipprepublic.com/policies/contact-information').catch(() => {}) },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_SPACE + 20 }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.springify().damping(17)} style={styles.card}>
        <Text style={styles.cardStar}>✱</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user?.name ?? '')}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.since}>ZR MEMBER · SINCE {user?.since ?? new Date().getFullYear()}</Text>
        <View style={styles.stats}>
          <Stat n={orders} label="Orders" onPress={() => router.push('/orders')} />
          <View style={styles.vr} />
          <Stat n={saved} label="Saved" onPress={() => router.push('/saved')} />
          <View style={styles.vr} />
          <Stat n={bag} label="In bag" onPress={() => router.push('/bag')} />
        </View>
      </Animated.View>

      <View style={{ paddingHorizontal: PAD, marginTop: 22 }}>
        {MENU.map((m, i) => (
          <Animated.View key={m.label} entering={FadeInDown.delay(120 + i * 50).springify().damping(18)}>
            <PressableScale scaleTo={0.985} onPress={m.onPress} style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name={m.icon} size={19} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{m.label}</Text>
                {m.sub ? <Text style={styles.rowSub}>{m.sub}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.mute} />
            </PressableScale>
          </Animated.View>
        ))}
        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Ionicons name="notifications-outline" size={19} color={colors.ink} />
          </View>
          <Text style={[styles.rowLabel, { flex: 1 }]}>Drop alerts</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.ink, false: colors.line }} thumbColor="#fff" />
        </View>
        <PressableScale onPress={logout} style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={[styles.rowIcon, { backgroundColor: '#FDECEA' }]}>
            <Ionicons name="log-out-outline" size={19} color={colors.accent} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.accent, flex: 1 }]}>Sign out</Text>
        </PressableScale>
        <Text style={styles.version}>Zipp Republic · demo build · all data is dummy content</Text>
      </View>

      <Sheet visible={sizes} onClose={() => setSizes(false)}>
        <Text style={styles.sheetTitle}>Your sizes, {firstName(user?.name ?? '')}</Text>
        <Text style={styles.sheetLabel}>TOPS</Text>
        <View style={styles.chips}>
          {TOP.map((s) => (
            <Chip key={s} label={s} active={prefs.topSize === s} onPress={() => setPrefs({ topSize: s })} />
          ))}
        </View>
        <Text style={styles.sheetLabel}>SLIDES (EU)</Text>
        <View style={styles.chips}>
          {SLIDES.map((s) => (
            <Chip key={s} label={s} active={prefs.slideSize === s} onPress={() => setPrefs({ slideSize: s })} />
          ))}
        </View>
        <Button title="Done" onPress={() => setSizes(false)} style={{ marginTop: 22 }} />
      </Sheet>

      <Sheet visible={pay} onClose={() => setPay(false)}>
        <Text style={styles.sheetTitle}>Payment methods</Text>
        <View style={styles.payCard}>
          <Ionicons name="card" size={24} color="#fff" />
          <Text style={styles.payNum}>•••• •••• •••• 4242</Text>
          <Text style={styles.payMeta}>Demo card · Exp 12/29</Text>
        </View>
        <Text style={styles.payNote}>Payments in this build are simulated. No real card details are collected or stored.</Text>
        <Button title="Close" variant="outline" onPress={() => setPay(false)} style={{ marginTop: 18 }} />
      </Sheet>
    </ScrollView>
  );
}

function Stat({ n, label, onPress }: { n: number; label: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: PAD, backgroundColor: colors.ink, borderRadius: 30, padding: 24, alignItems: 'center', overflow: 'hidden' },
  cardStar: { position: 'absolute', right: -14, top: -22, fontSize: 140, color: 'rgba(255,255,255,0.05)', fontFamily: fonts.black },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.black, fontSize: 26, color: colors.ink },
  name: { color: '#fff', fontFamily: fonts.black, fontSize: 22, marginTop: 14, textTransform: 'uppercase' },
  email: { color: '#a3a099', fontFamily: fonts.medium, fontSize: 13, marginTop: 3 },
  since: { color: '#6d6a64', fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 2.5, marginTop: 12 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 22, alignSelf: 'stretch', backgroundColor: '#1b1b1b', borderRadius: 20, paddingVertical: 14 },
  vr: { width: 1, height: 28, backgroundColor: '#2c2c2c' },
  statN: { color: '#fff', fontFamily: fonts.black, fontSize: 20 },
  statL: { color: '#8c8982', fontFamily: fonts.medium, fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 14 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  rowSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, marginTop: 2 },
  version: { textAlign: 'center', fontFamily: fonts.medium, fontSize: 11, color: colors.mute, marginTop: 24 },
  sheetTitle: { fontFamily: fonts.black, fontSize: 22, color: colors.ink, textTransform: 'uppercase', marginBottom: 14 },
  sheetLabel: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 2, color: colors.mute, marginTop: 12, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  payCard: { backgroundColor: colors.ink, borderRadius: 22, padding: 22, gap: 10 },
  payNum: { color: '#fff', fontFamily: fonts.heavy, fontSize: 18, letterSpacing: 2, marginTop: 8 },
  payMeta: { color: '#a3a099', fontFamily: fonts.medium, fontSize: 12 },
  payNote: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, marginTop: 14, lineHeight: 17 },
});
