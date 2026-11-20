import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/Common";
import { Img } from "@/components/Img";
import { naira, prettyDate } from "@/lib/format";
import { success } from "@/lib/haptics";
import { ORDER_STAGES, orderStage, useStore } from "@/lib/store";
import { PAD, colors, fonts } from "@/lib/theme";
import { showToast } from "@/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SUB = [
  "We have received your order",
  "Your items are being packed",
  "On the way to you",
  "Delivered. Enjoy!",
];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const addToCart = useStore((s) => s.addToCart);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(t);
  }, []);

  const stage = order ? orderStage(order, now) : 0;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withSpring(stage / 3, { damping: 28, stiffness: 320 });
  }, [stage, p]);
  const lineFill = useAnimatedStyle(() => ({ height: `${p.value * 100}%` }));

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScreenHeader title="Order" />
      </View>
    );
  }

  const reorder = () => {
    order.lines.forEach((l) => addToCart(l.productId, l.color, l.size, l.qty));
    success();
    showToast("Items added to your bag", "VIEW BAG", () => router.push("/bag"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title={order.id} />
      <ScrollView
        contentContainerStyle={{ padding: PAD, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(220)}
          style={styles.statusBox}
        >
          <Text style={styles.cap}>
            PLACED {prettyDate(order.createdAt).toUpperCase()}
          </Text>
          <Text style={styles.statusTitle}>{ORDER_STAGES[stage]}</Text>
          <Text style={styles.statusSub}>{SUB[stage]}</Text>
        </Animated.View>

        <View style={styles.timeline}>
          <View style={styles.rail}>
            <Animated.View style={[styles.railFill, lineFill]} />
          </View>
          {ORDER_STAGES.map((s, i) => {
            const on = i <= stage;
            return (
              <View key={s} style={styles.step}>
                <View style={[styles.node, on && styles.nodeOn]}>
                  {on ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : null}
                </View>
                <View>
                  <Text
                    style={[styles.stepTitle, !on && { color: colors.mute }]}
                  >
                    {s}
                  </Text>
                  <Text style={styles.stepSub}>{SUB[i]}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.h}>Items</Text>
        {order.lines.map((l, i) => (
          <View key={i} style={styles.line}>
            <Img uri={l.image} style={styles.thumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name} numberOfLines={2}>
                {l.name}
              </Text>
              <Text style={styles.meta}>
                {l.color} · {l.size} · Qty {l.qty}
              </Text>
            </View>
            <Text style={styles.price}>{naira(l.price * l.qty)}</Text>
          </View>
        ))}

        <View style={styles.sum}>
          <Row label="Subtotal" value={naira(order.subtotal)} />
          {order.discount > 0 ? (
            <Row label="Discount" value={`-${naira(order.discount)}`} />
          ) : null}
          <Row
            label="Delivery"
            value={order.shipping === 0 ? "Free" : naira(order.shipping)}
          />
          <Row label="Total" value={naira(order.total)} big />
        </View>

        <Text style={styles.h}>Delivery details</Text>
        <View style={styles.sum}>
          <Text style={styles.name}>{order.address.fullName}</Text>
          <Text style={styles.meta}>
            {order.address.street}, {order.address.city}, {order.address.state}
          </Text>
          <Text style={styles.meta}>{order.address.phone}</Text>
          <Text style={[styles.meta, { marginTop: 8 }]}>
            {order.delivery} · Paid via {order.payment}
          </Text>
        </View>

        <Button
          title="Order again"
          variant="outline"
          onPress={reorder}
          style={{ marginTop: 22 }}
        />
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[styles.meta, big && styles.big]}>{label}</Text>
      <Text style={[styles.name, big && styles.big]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBox: { backgroundColor: colors.ink, borderRadius: 26, padding: 22 },
  cap: {
    color: "#6d6a64",
    fontFamily: fonts.heavy,
    fontSize: 10,
    letterSpacing: 2.5,
  },
  statusTitle: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 28,
    textTransform: "uppercase",
    marginTop: 8,
  },
  statusSub: {
    color: "#a3a099",
    fontFamily: fonts.medium,
    fontSize: 14,
    marginTop: 4,
  },
  timeline: { marginTop: 24, gap: 26, paddingLeft: 4 },
  rail: {
    position: "absolute",
    left: 14,
    top: 14,
    bottom: 14,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  railFill: { width: 3, backgroundColor: colors.ink, borderRadius: 2 },
  step: { flexDirection: "row", alignItems: "center", gap: 16 },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 3,
  },
  nodeOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  stepTitle: { fontFamily: fonts.black, fontSize: 15, color: colors.ink },
  stepSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mute,
    marginTop: 2,
  },
  h: {
    fontFamily: fonts.black,
    fontSize: 18,
    textTransform: "uppercase",
    color: colors.ink,
    marginTop: 30,
    marginBottom: 12,
  },
  line: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  thumb: { width: 60, height: 74, borderRadius: 12 },
  name: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.mute,
    lineHeight: 19,
  },
  price: { fontFamily: fonts.black, fontSize: 14, color: colors.ink },
  sum: {
    backgroundColor: colors.soft,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  big: { fontFamily: fonts.black, fontSize: 17, color: colors.ink },
});
