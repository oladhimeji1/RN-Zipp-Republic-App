import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, LinearTransition, SlideOutLeft } from 'react-native-reanimated';
import { AddressForm } from '@/components/AddressForm';
import { Button } from '@/components/Button';
import { EmptyState, ScreenHeader } from '@/components/Common';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { useStore } from '@/lib/store';
import { showToast } from '@/lib/toast';
import { PAD, colors, fonts } from '@/lib/theme';
import { success } from '@/lib/haptics';

export default function Addresses() {
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const removeAddress = useStore((s) => s.removeAddress);
  const user = useStore((s) => s.user);
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeader title="Addresses" />
      <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? <EmptyState title="No addresses yet" text="Add a delivery address to check out faster." /> : null}
        {addresses.map((a, i) => (
          <Animated.View key={a.id} layout={LinearTransition.springify()} exiting={SlideOutLeft} entering={FadeInDown.delay(i * 60).springify().damping(18)} style={styles.card}>
            <View style={styles.top}>
              <View style={styles.tag}>
                <Ionicons name={a.label === 'Work' ? 'briefcase-outline' : a.label === 'Home' ? 'home-outline' : 'location-outline'} size={14} color={colors.ink} />
                <Text style={styles.tagText}>{a.label}</Text>
              </View>
              <PressableScale hitSlop={10} onPress={() => removeAddress(a.id)}>
                <Ionicons name="trash-outline" size={19} color={colors.mute} />
              </PressableScale>
            </View>
            <Text style={styles.name}>{a.fullName}</Text>
            <Text style={styles.line}>{a.street}</Text>
            <Text style={styles.line}>
              {a.city}, {a.state}
            </Text>
            <Text style={styles.line}>{a.phone}</Text>
          </Animated.View>
        ))}
        <Button title="Add new address" icon="add" variant="outline" onPress={() => setOpen(true)} style={{ marginTop: 10 }} />
      </ScrollView>

      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text style={styles.sheetTitle}>New address</Text>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <AddressForm
            defaultName={user?.name}
            onCancel={() => setOpen(false)}
            onSave={(a) => {
              addAddress(a);
              success();
              setOpen(false);
              showToast('Address saved');
            }}
          />
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 22, padding: 18, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.soft, paddingHorizontal: 12, height: 30, borderRadius: 15 },
  tagText: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink },
  name: { fontFamily: fonts.black, fontSize: 16, color: colors.ink, marginBottom: 4 },
  line: { fontFamily: fonts.medium, fontSize: 14, color: colors.body, lineHeight: 20 },
  sheetTitle: { fontFamily: fonts.black, fontSize: 22, textTransform: 'uppercase', color: colors.ink, marginBottom: 14 },
});
