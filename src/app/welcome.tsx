import { Button } from "@/components/Button";
import { PressableScale } from "@/components/PressableScale";
import { HERO_IMAGE, LOGO_WHITE, PRODUCTS, firstImage } from "@/lib/data";
import { select, tap } from "@/lib/haptics";
import { H, PAD, W, colors, fonts } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Slide {
  id: string;
  step: string;
  tag: string;
  title: string;
  sub: string;
  image: string;
  perks: string[];
}

const byId = (id: string) =>
  firstImage(PRODUCTS.find((p) => p.id === id)!) ?? HERO_IMAGE;

const SLIDES: Slide[] = [
  {
    id: "drop",
    step: "01 / 04",
    tag: "DROP 02 · ZIPP 2.0 LIVE",
    title: "STREET LUXURY\nREDEFINEeeee.",
    sub: "Heavyweight jerseys, embroidered varsity jackets and limited capsule drops crafted in small batches.",
    image: HERO_IMAGE,
    perks: ["100% heavyweight fabrics", "Small-batch exclusive releases"],
  },
  {
    id: "craft",
    step: "02 / 04",
    tag: "SIGNATURE FOOTWEAR",
    title: "BUTTERY SOFT.\nALL-DAY WEAR.",
    sub: "From our iconic cushioned slides to varsity layers—engineered for comfort and built to stand out.",
    image: byId("zipp-mens-classic-slides"),
    perks: ["Contoured cushioned footbed", "Tailored unisex & women’s fits"],
  },
  {
    id: "alerts",
    step: "03 / 04",
    tag: "REPUBLIC PASS · APP PERKS",
    title: "NEVER MISS\nA RESTOCK.",
    sub: "Get instant push notifications 15 minutes before drops land, save your sizes and check out in one tap.",
    image: byId("zipp-city-varsity"),
    perks: ["15-min early app access", "Nationwide express delivery"],
  },
  {
    id: "join",
    step: "04 / 04",
    tag: "JOIN THE REPUBLIC",
    title: "UNLOCK 10% OFF\nYOUR FIRST DROP.",
    sub: "Create your Republic account now to claim code ZIPP10, track orders live and personalise your feed.",
    image: byId("zipp-double-layer-set"),
    perks: ["Use code ZIPP10 at checkout", "Live order stage tracking"],
  },
];

const AnimatedFlatList = Animated.FlatList<Slide>;

function ProgressBar({
  index,
  scrollX,
}: {
  index: number;
  scrollX: { value: number };
}) {
  const style = useAnimatedStyle(() => {
    const w = interpolate(
      scrollX.value,
      [(index - 1) * W, index * W, (index + 1) * W],
      [10, 34, 10],
      Extrapolation.CLAMP,
    );
    const op = interpolate(
      scrollX.value,
      [(index - 1) * W, index * W, (index + 1) * W],
      [0.35, 1, 0.35],
      Extrapolation.CLAMP,
    );
    return { width: w, opacity: op };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useSharedValue(0);
  const [idx, setIdx] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const goNext = () => {
    if (idx < SLIDES.length - 1) {
      select();
      const nextIndex = idx + 1;
      setIdx(nextIndex);
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      tap();
      router.push("/signup");
    }
  };

  const goBack = () => {
    if (idx > 0) {
      select();
      const prevIndex = idx - 1;
      setIdx(prevIndex);
      listRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const isLast = idx === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <AnimatedFlatList
        ref={listRef as never}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / W);
          if (next !== idx) {
            select();
            setIdx(next);
          }
        }}
        renderItem={({ item }) => (
          <View style={{ width: W, height: H }}>
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={250}
            />
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.6)",
                "rgba(0,0,0,0.12)",
                "rgba(0,0,0,0.88)",
                "#080808",
              ]}
              locations={[0, 0.35, 0.72, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.slideContent,
                { paddingBottom: insets.bottom + 150 },
              ]}
            >
              {/* <View style={styles.kickerPill}>
                <View style={styles.liveDot} />
                <Text style={styles.kicker}>{item.tag}</Text>
              </View> */}
              <Text style={styles.headline}>{item.title}</Text>
              <Text style={styles.sub}>{item.sub}</Text>

              {/* <View style={styles.perksRow}>
                {item.perks.map((p) => (
                  <View key={p} style={styles.perkChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#12B76A"
                    />
                    <Text style={styles.perkText}>{p}</Text>
                  </View>
                ))}
              </View> */}
            </View>
          </View>
        )}
      />

      {/* TOP BAR */}
      <Animated.View
        entering={FadeInDown.duration(260)}
        style={[styles.topBar, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.brand}>
          <Image
            source={LOGO_WHITE}
            style={{ width: 138, height: 26 }}
            contentFit="contain"
          />
        </View>

        {!isLast ? (
          <PressableScale
            onPress={() => {
              tap();
              router.push("/signup");
            }}
            style={styles.skipPill}
          >
            <Text style={styles.skipText}>Skip</Text>
          </PressableScale>
        ) : (
          <PressableScale
            onPress={() => {
              tap();
              router.replace("/personalise");
            }}
            style={styles.skipPill}
          >
            <Text style={styles.skipText}>Guest</Text>
          </PressableScale>
        )}
      </Animated.View>

      {/* STICKY BOTTOM CONTROLS */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.progressRow}>
          <View style={styles.dotsWrap}>
            {SLIDES.map((s, i) => (
              <ProgressBar key={s.id} index={i} scrollX={scrollX} />
            ))}
          </View>
          <Text style={styles.stepCount}>{SLIDES[idx]?.step}</Text>
        </View>

        {!isLast ? (
          <View style={styles.actionRow}>
            <PressableScale
              onPress={() => {
                tap();
                router.push("/signin");
              }}
              style={styles.signInBtn}
            >
              <Text style={styles.signInText}>Sign in</Text>
            </PressableScale>

            <PressableScale
              scaleTo={0.96}
              onPress={goNext}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <View style={styles.nextArrow}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </PressableScale>
          </View>
        ) : (
          <View style={styles.lastActions}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title="Create account"
                variant="light"
                icon="arrow-forward"
                style={{ flex: 1.3 }}
                onPress={() => router.push("/signup")}
              />
              <Button
                title="Sign in"
                variant="outlineLight"
                style={{ flex: 0.85 }}
                onPress={() => router.push("/signin")}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080808" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PAD,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  star: { color: "#fff", fontSize: 20, fontFamily: fonts.black },
  brandText: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 14,
    letterSpacing: 2.5,
  },
  skipPill: {
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  skipText: { color: "#fff", fontFamily: fonts.bold, fontSize: 12 },

  slideContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: PAD,
  },
  kickerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#12B76A" },
  kicker: {
    color: "#fff",
    fontFamily: fonts.heavy,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  headline: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 35,
    lineHeight: 38,
    marginTop: 12,
    textTransform: "uppercase",
  },
  sub: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: fonts.medium,
    fontSize: 14.5,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 335,
  },
  perksRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  perkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  perkText: { color: "#fff", fontFamily: fonts.semi, fontSize: 11.5 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: PAD,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dotsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { height: 5, borderRadius: 2.5, backgroundColor: "#fff" },
  stepCount: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: fonts.heavy,
    fontSize: 11,
    letterSpacing: 1.5,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  signInBtn: {
    height: 45,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "#fff",
    fontFamily: fonts.heavy,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  nextBtn: {
    flex: 1,
    height: 45,
    borderRadius: 999,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 8,
  },
  nextBtnText: {
    color: colors.ink,
    fontFamily: fonts.black,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  nextArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  lastActions: { gap: 10 },
});
