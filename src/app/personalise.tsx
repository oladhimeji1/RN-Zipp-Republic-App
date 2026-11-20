import { Button } from "@/components/Button";
import { Chip } from "@/components/Common";
import { PressableScale } from "@/components/PressableScale";
import { PRODUCTS } from "@/lib/data";
import { select, tap } from "@/lib/haptics";
import { useStore } from "@/lib/store";
import { PAD, W, fonts } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOP = ["XS", "S", "M", "L", "XL", "XXL"];
const SLIDES = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];
const TILE = (W - PAD * 2 - 12) / 2;

function Column({ uris, reverse }: { uris: string[]; reverse?: boolean }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withTiming(reverse ? 90 : -90, {
        duration: 7000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [y, reverse]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={[{ gap: 12, marginTop: reverse ? -60 : 0 }, a]}>
      {uris.map((u, i) => (
        <Image
          key={u + i}
          source={{ uri: u }}
          style={{
            width: TILE,
            height: i % 2 ? TILE * 1.1 : TILE * 1.45,
            borderRadius: 18,
            opacity: 0.8,
          }}
          contentFit="cover"
        />
      ))}
    </Animated.View>
  );
}

export default function Personalise() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const setPrefs = useStore((s) => s.setPrefs);
  const setOnboarded = useStore((s) => s.setOnboarded);
  const [step, setStep] = useState(-1); // -1 = intro
  const [shopFor, setShopFor] = useState<"men" | "women" | "both" | null>(null);
  const [top, setTop] = useState<string | null>(null);
  const [slide, setSlide] = useState<string | null>(null);

  const images = useMemo(
    () =>
      PRODUCTS.flatMap((p) => p.variants.map((v) => v.image)).filter(
        Boolean,
      ) as string[],
    [],
  );
  const colA = images.filter((_, i) => i % 2 === 0).slice(0, 6);
  const colB = images.filter((_, i) => i % 2 === 1).slice(0, 6);

  const finish = (p: {
    shopFor?: typeof shopFor;
    top?: string | null;
    slide?: string | null;
  }) => {
    setPrefs({
      shopFor: p.shopFor ?? shopFor,
      topSize: p.top ?? top,
      slideSize: p.slide ?? slide,
    });
    setOnboarded(false);
    router.replace(user ? "/(tabs)" : "/signup");
  };

  const canNext =
    (step === 0 && !!shopFor) ||
    (step === 1 && !!top) ||
    (step === 2 && !!slide);

  const prog = [0, 1, 2].map((i) => i <= step);

  if (step < 0) {
    return (
      <View style={styles.root}>
        <View style={styles.mosaic}>
          <Column uris={colA} />
          <Column uris={colB} reverse />
        </View>
        <LinearGradient
          colors={["#0A0A0A", "rgba(10,10,10,0.2)", "#0A0A0A"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={[styles.introTop, { paddingTop: insets.top + 24 }]}>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.introText}
          >
            Let us tailor the Republic to you. Three quick questions and your
            store is ready.
          </Animated.Text>
        </View>
        <Animated.View
          entering={FadeIn.delay(600)}
          style={[styles.introBottom, { paddingBottom: insets.bottom + 24 }]}
        >
          <Button
            title="Next"
            icon="arrow-forward"
            variant="light"
            style={{ alignSelf: "center", paddingHorizontal: 48 }}
            onPress={() => setStep(0)}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <View style={styles.bars}>
        {prog.map((on, i) => (
          <Bar key={i} on={on} />
        ))}
      </View>
      <View style={styles.topRow}>
        <PressableScale
          onPress={() => setStep((s) => (s > 0 ? s - 1 : -1))}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </PressableScale>
        <Text style={styles.count}>{step + 1} / 3</Text>
      </View>

      <Animated.View
        key={step}
        entering={FadeInDown.duration(200)}
        exiting={FadeOut.duration(120)}
        style={{ flex: 1 }}
      >
        {step === 0 && (
          <>
            <Text style={styles.q}>Who are you shopping for?</Text>
            <View style={{ gap: 12, marginTop: 28 }}>
              {(["men", "women", "both"] as const).map((k) => (
                <PressableScale
                  key={k}
                  onPress={() => {
                    select();
                    setShopFor(k);
                  }}
                  style={[styles.card, shopFor === k && styles.cardOn]}
                >
                  <Text
                    style={[
                      styles.cardText,
                      shopFor === k && { color: "#0A0A0A" },
                    ]}
                  >
                    {k === "both"
                      ? "A bit of both"
                      : k === "men"
                        ? "Men"
                        : "Women"}
                  </Text>
                  {shopFor === k ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#0A0A0A"
                    />
                  ) : null}
                </PressableScale>
              ))}
            </View>
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.q}>What is your usual top size?</Text>
            <View style={styles.grid}>
              {TOP.map((s) => (
                <Chip
                  key={s}
                  dark
                  label={s}
                  active={top === s}
                  onPress={() => {
                    select();
                    setTop(s);
                  }}
                />
              ))}
            </View>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.q}>And your slides size (EU)?</Text>
            <View style={styles.grid}>
              {SLIDES.map((s) => (
                <Chip
                  key={s}
                  dark
                  label={s}
                  active={slide === s}
                  onPress={() => {
                    select();
                    setSlide(s);
                  }}
                />
              ))}
            </View>
          </>
        )}
      </Animated.View>

      <View style={styles.bottomRow}>
        <PressableScale onPress={() => finish({})} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </PressableScale>
        <PressableScale
          disabled={!canNext}
          onPress={() => {
            tap();
            if (step >= 2) finish({});
            else setStep((s) => s + 1);
          }}
          style={[styles.nextBtn, !canNext && { opacity: 0.35 }]}
        >
          <Text style={styles.nextText}>
            {step === 2 ? (user ? "Enter Store" : "Next · Sign Up") : "Next"}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#0A0A0A" />
        </PressableScale>
      </View>
    </View>
  );
}

function Bar({ on }: { on: boolean }) {
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(on ? 1 : 0, { duration: 350 });
  }, [on, p]);
  const a = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, a]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0A", paddingHorizontal: PAD },
  mosaic: {
    position: "absolute",
    top: 0,
    left: PAD,
    right: PAD,
    flexDirection: "row",
    gap: 12,
  },
  introTop: { paddingHorizontal: 4 },
  introText: {
    color: "#fff",
    fontFamily: fonts.heavy,
    fontSize: 24,
    lineHeight: 31,
  },
  introBottom: { flex: 1, justifyContent: "flex-end" },
  bars: { flexDirection: "row", gap: 6 },
  barTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#2c2c2c",
    overflow: "hidden",
  },
  barFill: { height: 3, backgroundColor: "#fff" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  count: {
    color: "#6d6a64",
    fontFamily: fonts.heavy,
    fontSize: 12,
    letterSpacing: 2,
  },
  q: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 30,
    lineHeight: 34,
    marginTop: 24,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 28 },
  card: {
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#2c2c2c",
    backgroundColor: "#141414",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardOn: { backgroundColor: "#fff", borderColor: "#fff" },
  cardText: { color: "#fff", fontFamily: fonts.heavy, fontSize: 17 },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  skip: {
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1b1b1b",
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: { color: "#fff", fontFamily: fonts.bold, fontSize: 13 },
  nextBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextText: {
    color: "#0A0A0A",
    fontFamily: fonts.black,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
