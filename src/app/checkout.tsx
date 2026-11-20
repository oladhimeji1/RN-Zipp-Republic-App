import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddressForm } from '@/components/AddressForm';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/Common';
import { Img } from '@/components/Img';
import { Input } from '@/components/Input';
import { PressableScale } from '@/components/PressableScale';
import { DELIVERY, getProduct } from '@/lib/data';
import { naira } from '@/lib/format';
import { computeTotals, useStore } from '@/lib/store';
import { PAD, colors, fonts } from '@/lib/theme';
import { select, success, warn } from '@/lib/haptics';

const STEPS = ['Delivery', 'Payment', 'Review'];
const PAYMENTS = [
  { id: 'Card', label: 'Debit / credit card', icon: 'card-outline' as const },
  { id: 'Bank transfer', label: 'Bank transfer', icon: 'swap-horizontal-outline' as const },
  { id: 'Pay on delivery', label: 'Pay on delivery', icon: 'cash-outline' as const },
];

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cart = useStore((s) => s.cart);
  const promo = useStore((s) => s.promo);
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const placeOrder = useStore((s) => s.placeOrder);
  const user = useStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [addrId, setAddrId] = useState<string | null>(addresses[0]?.id ?? null);
  const [adding, setAdding] = useState(addresses.length === 0);
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('Card');
  const [card, setCard] = useState({ number: '', exp: '', cvv: '' });
  const [tried, setTried] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const t = computeTotals(cart, promo, delivery);
  const address = addresses.find((a) => a.id === addrId) ?? null;
  const prog = useSharedValue(0);
  useEffect(() => {
    prog.value = withTiming((step + 1) / 3, { duration: 350 });
  }, [step, prog]);
  const progStyle = useAnimatedStyle(() => ({ width: `${prog.value * 100}%` }));

  if (!cart.length && !placed) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top + 20 }}>
        <EmptyState title="Nothing to check out" text="Add something to your bag first." cta="Back to shop" onPress={() => router.replace('/shop')} />
      </View>
    );
  }

  const cardOk = card.number.replace(/\s/g, '').length === 16 && /^\d{2}\/\d{2}$/.test(card.exp) && card.cvv.length >= 3;

  const next = () => {
    if (step === 0) {
      if (!address) {
        warn();
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (payment === 'Card' && !cardOk) {
        setTried(true);
        warn();
        return;
      }
      setStep(2);
    } else {
      setPlacing(true);
      setTimeout(() => {
        if (!address) return;
        const o = placeOrder({ address, delivery, payment });
        setPlacing(false);
        if (o) {
          setPlaced(true);
          success();
          router.replace({ pathname: '/order-success', params: { id: o.id } });
        }
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.head, { paddingTop: insets.top + 10 }]}>
        <PressableScale onPress={() => (step > 0 ? setStep(step - 1) : router.back())} style={styles.round}>
          <Ionicons name={step > 0 ? 'chevron-back' : 'close'} size={22} color={colors.ink} />
        </PressableScale>
        <Text style={styles.headTitle}>Checkout</Text>
        <View style={{ width: 42 }} />
      </View>
      <View style={styles.progWrap}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, progStyle]} />
        </View>
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <Text key={s} style={[styles.stepLabel, i <= step && { color: colors.ink }]}>
              {i + 1}. {s}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 140 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <Animated.View key="s0" entering={FadeInDown.springify().damping(18)}>
            <Text style={styles.h}>Delivery address</Text>
            {addresses.map((a) => (
              <PressableScale key={a.id} scaleTo={0.985} onPress={() => { select(); setAddrId(a.id); setAdding(false); }} style={[styles.opt, addrId === a.id && !adding && styles.optOn]}>
                <Radio on={addrId === a.id && !adding} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.optTitle}>
                    {a.label} · {a.fullName}
                  </Text>
                  <Text style={styles.optSub}>
                    {a.street}, {a.city}, {a.state}
                  </Text>
                  <Text style={styles.optSub}>{a.phone}</Text>
                </View>
              </PressableScale>
            ))}
            {adding ? (
              <Animated.View entering={FadeIn} style={styles.formBox}>
                <AddressForm
                  defaultName={user?.name}
                  onCancel={addresses.length ? () => setAdding(false) : undefined}
                  onSave={(a) => {
                    const created = addAddress(a);
                    setAddrId(created.id);
                    setAdding(false);
                  }}
                />
              </Animated.View>
            ) : (
              <Button title="Add new address" icon="add" variant="outline" small onPress={() => setAdding(true)} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            )}

            <Text style={[styles.h, { marginTop: 28 }]}>Delivery method</Text>
            {DELIVERY.map((d) => {
              const free = d.id === 'standard' && t.freeShip;
              return (
                <PressableScale key={d.id} scaleTo={0.985} onPress={() => { select(); setDelivery(d.id); }} style={[styles.opt, delivery === d.id && styles.optOn]}>
                  <Radio on={delivery === d.id} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optTitle}>{d.label}</Text>
                    <Text style={styles.optSub}>{d.eta}</Text>
                  </View>
                  <Text style={styles.optPrice}>{free ? 'Free' : naira(d.price)}</Text>
                </PressableScale>
              );
            })}
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View key="s1" entering={FadeInDown.springify().damping(18)}>
            <Text style={styles.h}>Payment method</Text>
            {PAYMENTS.map((p) => (
              <PressableScale key={p.id} scaleTo={0.985} onPress={() => { select(); setPayment(p.id); }} style={[styles.opt, payment === p.id && styles.optOn]}>
                <Radio on={payment === p.id} />
                <Ionicons name={p.icon} size={22} color={colors.ink} />
                <Text style={[styles.optTitle, { flex: 1 }]}>{p.label}</Text>
              </PressableScale>
            ))}
            {payment === 'Card' ? (
              <Animated.View entering={FadeIn} style={{ marginTop: 14 }}>
                <Input
                  label="Card number"
                  placeholder="0000 0000 0000 0000"
                  keyboardType="number-pad"
                  maxLength={19}
                  value={card.number}
                  onChangeText={(v) => setCard((c) => ({ ...c, number: v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                  error={tried && card.number.replace(/\s/g, '').length !== 16 ? 'Enter a 16 digit card number' : null}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Expiry"
                      placeholder="MM/YY"
                      keyboardType="number-pad"
                      maxLength={5}
                      value={card.exp}
                      onChangeText={(v) => {
                        const d = v.replace(/\D/g, '').slice(0, 4);
                        setCard((c) => ({ ...c, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                      }}
                      error={tried && !/^\d{2}\/\d{2}$/.test(card.exp) ? 'MM/YY' : null}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input label="CVV" placeholder="123" keyboardType="number-pad" maxLength={4} password value={card.cvv} onChangeText={(v) => setCard((c) => ({ ...c, cvv: v.replace(/\D/g, '') }))} error={tried && card.cvv.length < 3 ? 'Required' : null} />
                  </View>
                </View>
                <Text style={styles.note}>Demo checkout: payments are simulated and card details are never saved.</Text>
              </Animated.View>
            ) : payment === 'Bank transfer' ? (
              <Text style={styles.note}>You will see the demo account details after placing your order.</Text>
            ) : (
              <Text style={styles.note}>Pay in cash or by transfer when your order arrives.</Text>
            )}
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View key="s2" entering={FadeInDown.springify().damping(18)}>
            <Text style={styles.h}>Review your order</Text>
            {cart.map((c) => {
              const p = getProduct(c.productId)!;
              const v = p.variants.find((x) => x.color === c.color) ?? p.variants[0];
              return (
                <View key={c.key} style={styles.line}>
                  <Img uri={v.image} tone={v.hex + '33'} style={styles.thumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.optTitle} numberOfLines={2}>{p.name}</Text>
                    <Text style={styles.optSub}>{c.color} · {c.size} · Qty {c.qty}</Text>
                  </View>
                  <Text style={styles.optPrice}>{naira(p.price * c.qty)}</Text>
                </View>
              );
            })}
            <View style={styles.sumBox}>
              <Summary label="Deliver to" value={address ? `${address.street}, ${address.city}` : '-'} />
              <Summary label="Delivery" value={DELIVERY.find((d) => d.id === delivery)?.label ?? ''} />
              <Summary label="Payment" value={payment} />
            </View>
            <View style={{ gap: 10, marginTop: 18 }}>
              <Totals label="Subtotal" value={naira(t.subtotal)} />
              {t.discount > 0 ? <Totals label={`Discount (${promo})`} value={`-${naira(t.discount)}`} green /> : null}
              <Totals label="Delivery" value={t.shipping === 0 ? 'Free' : naira(t.shipping)} />
              <View style={{ height: 1, backgroundColor: colors.line }} />
              <Totals label="Total" value={naira(t.total)} big />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.ctaLabel}>TOTAL</Text>
          <Text style={styles.ctaPrice}>{naira(t.total)}</Text>
        </View>
        <Button title={step === 2 ? 'Place order' : 'Continue'} loading={placing} onPress={next} disabled={step === 0 && !address} style={{ flex: 1, marginLeft: 18 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <View style={[styles.radio, on && { borderColor: colors.ink }]}>
      {on ? <Animated.View entering={FadeIn.duration(150)} style={styles.radioDot} /> : null}
    </View>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14 }}>
      <Text style={styles.optSub}>{label}</Text>
      <Text style={[styles.optTitle, { flex: 1, textAlign: 'right' }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}
function Totals({ label, value, big, green }: { label: string; value: string; big?: boolean; green?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[styles.tl, big && styles.tBig]}>{label}</Text>
      <Text style={[styles.tv, big && styles.tBig, green && { color: colors.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD, paddingBottom: 10 },
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  headTitle: { fontFamily: fonts.black, fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink },
  progWrap: { paddingHorizontal: PAD, paddingTop: 4 },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: 4, backgroundColor: colors.ink },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  stepLabel: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 1, color: colors.mute, textTransform: 'uppercase' },
  h: { fontFamily: fonts.black, fontSize: 20, textTransform: 'uppercase', color: colors.ink, marginBottom: 14 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: colors.line, borderRadius: 20, padding: 16, marginBottom: 10 },
  optOn: { borderColor: colors.ink, backgroundColor: '#FBFAF8' },
  optTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  optSub: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, marginTop: 2, lineHeight: 18 },
  optPrice: { fontFamily: fonts.black, fontSize: 14, color: colors.ink },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.ink },
  formBox: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 22, padding: 16, marginTop: 4 },
  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, marginTop: 10, lineHeight: 17 },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  thumb: { width: 60, height: 74, borderRadius: 12 },
  sumBox: { backgroundColor: colors.soft, borderRadius: 20, padding: 16, gap: 10, marginTop: 18 },
  tl: { fontFamily: fonts.medium, fontSize: 14, color: colors.body },
  tv: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  tBig: { fontFamily: fonts.black, fontSize: 19, color: colors.ink },
  cta: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: PAD, paddingTop: 12, flexDirection: 'row', alignItems: 'center' },
  ctaLabel: { fontFamily: fonts.heavy, fontSize: 10, letterSpacing: 2, color: colors.mute },
  ctaPrice: { fontFamily: fonts.black, fontSize: 18, color: colors.ink, marginTop: 1 },
});
