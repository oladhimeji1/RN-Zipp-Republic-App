import { SectionHeader } from "@/components/Common";
import { Img } from "@/components/Img";
import { PressableScale } from "@/components/PressableScale";
import { ProductCard } from "@/components/ProductCard";
import { COLLECTIONS, HERO_IMAGE, PRODUCTS, productsIn } from "@/lib/data";
import { firstName, initials, naira } from "@/lib/format";
import { select, success } from "@/lib/haptics";
import { ORDER_STAGES, orderStage, useCartCount, useStore } from "@/lib/store";
import { PAD, TAB_SPACE, W, colors, fonts } from "@/lib/theme";
import { showToast } from "@/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_W = 166;
const TILE_W = (W - PAD * 2 - 12) / 2;

const PILLS: {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "all", label: "For You", icon: "sparkles" },
  { id: "new", label: "New Drops" },
  { id: "tshirts", label: "Jerseys & Tees" },
  { id: "slides", label: "Slides" },
  { id: "jackets-hoodies", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
  { id: "sale", label: "Archive Sale" },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((s) => s.user);
  const prefs = useStore((s) => s.prefs);
  const orders = useStore((s) => s.orders);
  const notifications = useStore((s) => s.notifications);
  const setNotifications = useStore((s) => s.setNotifications);
  const count = useCartCount();

  const [cat, setCat] = useState("all");

  const feedProducts = useMemo(() => {
    let list = cat === "all" ? PRODUCTS : productsIn(cat);
    if (cat === "all" && prefs.shopFor && prefs.shopFor !== "both") {
      const preferred = list.filter(
        (p) => p.gender === prefs.shopFor || p.gender === "unisex",
      );
      if (preferred.length >= 4) list = preferred;
    }
    return list;
  }, [cat, prefs.shopFor]);

  const newDrops = useMemo(() => productsIn("new"), []);
  const slides = useMemo(() => productsIn("slides"), []);
  const latestOrder = orders[0];
  const latestStage = latestOrder ? orderStage(latestOrder) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* NATIVE STICKY APP HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <PressableScale
          onPress={() => router.push("/profile")}
          style={styles.userRow}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name ?? "")}</Text>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={styles.brandTitle}>ZIPP REPUBLIC</Text>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.greeting}>
              Hi, {firstName(user?.name ?? "")}
              {prefs.topSize || prefs.slideSize
                ? ` · ${[prefs.topSize, prefs.slideSize && `EU ${prefs.slideSize}`].filter(Boolean).join(" / ")}`
                : " · ZR Member"}
            </Text>
          </View>
        </PressableScale>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <PressableScale
            onPress={() => router.push("/search")}
            style={styles.iconBtn}
          >
            <Ionicons name="search-outline" size={20} color={colors.ink} />
          </PressableScale>
          <PressableScale
            onPress={() => router.push("/bag")}
            style={styles.iconBtn}
          >
            <Ionicons name="bag-handle-outline" size={20} color={colors.ink} />
            {count ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            ) : null}
          </PressableScale>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_SPACE + 24 }}
      >
        {/* NATIVE SEARCH & FILTER BAR */}
        <View style={{ paddingHorizontal: PAD, marginTop: 6 }}>
          <PressableScale
            scaleTo={0.985}
            onPress={() => router.push("/search")}
            style={styles.searchBar}
          >
            <Ionicons name="search" size={17} color={colors.mute} />
            <Text style={styles.searchPlaceholder}>
              Search jerseys, slides, varsity...
            </Text>
            <View style={styles.searchShortcut}>
              <Ionicons name="options-outline" size={15} color={colors.ink} />
            </View>
          </PressableScale>
        </View>

        {/* SEGMENTED CATEGORY PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: PAD,
            gap: 8,
            paddingVertical: 14,
          }}
        >
          {PILLS.map((p) => {
            const active = cat === p.id;
            return (
              <PressableScale
                key={p.id}
                scaleTo={0.94}
                onPress={() => {
                  select();
                  setCat(p.id);
                }}
                style={[styles.pill, active && styles.pillOn]}
              >
                {p.icon ? (
                  <Ionicons
                    name={p.icon}
                    size={13}
                    color={active ? "#fff" : colors.ink}
                    style={{ marginRight: 5 }}
                  />
                ) : null}
                <Text style={[styles.pillText, active && styles.pillTextOn]}>
                  {p.label}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* ACTIVE ORDER LIVE ACTIVITY WIDGET (WHEN PRESENT) */}
        {latestOrder ? (
          <PressableScale
            scaleTo={0.985}
            onPress={() => router.push(`/orders/${latestOrder.id}`)}
            style={styles.orderWidget}
          >
            <View style={styles.orderIconBox}>
              <Ionicons
                name={latestStage === 3 ? "checkmark-done" : "cube"}
                size={18}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text style={styles.orderWidgetTag}>
                  ORDER {latestOrder.id}
                </Text>
                <View style={styles.orderStatusPill}>
                  <Text style={styles.orderStatusText}>
                    {ORDER_STAGES[latestStage]}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderWidgetSub} numberOfLines={1}>
                {latestOrder.lines[0]?.name}
                {latestOrder.lines.length > 1
                  ? ` +${latestOrder.lines.length - 1} more`
                  : ""}{" "}
                · Tap to track
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mute} />
          </PressableScale>
        ) : null}

        {/* FEATURED DROP CARD (APP EDITORIAL) */}
        {cat === "all" || cat === "new" ? (
          <Animated.View
            entering={FadeInDown.duration(260)}
            style={{ paddingHorizontal: PAD, marginTop: 4 }}
          >
            <PressableScale
              scaleTo={0.98}
              onPress={() => router.push("/product/zipp-2-0-jersey")}
              style={styles.heroCard}
            >
              <Image
                source={{ uri: HERO_IMAGE }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={250}
              />
              <LinearGradient
                colors={[
                  "rgba(10,10,10,0.15)",
                  "rgba(10,10,10,0.35)",
                  "rgba(10,10,10,0.92)",
                ]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.heroTopRow}>
                <View style={styles.dropBadge}>
                  <View style={styles.dropPulse} />
                  <Text style={styles.dropBadgeText}>DROP 02 · LIVE NOW</Text>
                </View>
                <View style={styles.exclusivesBadge}>
                  <Text style={styles.exclusivesText}>APP EXCLUSIVE</Text>
                </View>
              </View>

              <View style={styles.heroBottom}>
                <Text style={styles.heroKicker}>ZIPP 2.0 COLLECTION</Text>
                <Text style={styles.heroTitle}>
                  STREET LUXURY{"\n"}REDEFINED.
                </Text>
                <View style={styles.heroActionRow}>
                  <View style={styles.heroCtaPill}>
                    <Text style={styles.heroCtaText}>Explore Drop</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={colors.ink}
                    />
                  </View>
                  <Text style={styles.heroPriceTag}>From {naira(35000)}</Text>
                </View>
              </View>
            </PressableScale>
          </Animated.View>
        ) : null}

        {/* CURATED FEED / FILTERED VIEW */}
        {cat !== "all" ? (
          <View style={{ marginTop: 18 }}>
            <SectionHeader
              title={PILLS.find((x) => x.id === cat)?.label ?? "Collection"}
              sub={`${feedProducts.length} pieces curated for you`}
              action="See all"
              onAction={() => router.push(`/collection/${cat}`)}
            />
            <View style={styles.grid}>
              {feedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} width={TILE_W} index={i} />
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* NEW ARRIVALS HORIZONTAL RAIL */}
            <View style={{ marginTop: 26 }}>
              <SectionHeader
                title="Just Dropped"
                sub="Fresh from the Zipp studio"
                action="See all"
                onAction={() => router.push("/collection/new")}
              />
              <FlatList
                horizontal
                data={newDrops}
                keyExtractor={(p) => p.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: PAD, gap: 14 }}
                snapToInterval={CARD_W + 14}
                decelerationRate="fast"
                renderItem={({ item, index }) => (
                  <ProductCard product={item} width={CARD_W} index={index} />
                )}
              />
            </View>

            {/* COMPACT SLIDES SPOTLIGHT */}
            <View style={{ marginTop: 30 }}>
              <SectionHeader
                title="The Signature Slides"
                sub="Buttery-soft footbed · All-day comfort"
                action="Shop all"
                onAction={() => router.push("/collection/slides")}
              />
              <FlatList
                horizontal
                data={slides}
                keyExtractor={(p) => p.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: PAD, gap: 14 }}
                snapToInterval={CARD_W + 14}
                decelerationRate="fast"
                renderItem={({ item, index }) => (
                  <ProductCard
                    product={item}
                    width={CARD_W}
                    index={index}
                    ratio={1.05}
                  />
                )}
              />
            </View>

            {/* BENTO QUICK COLLECTIONS */}
            <View style={{ marginTop: 30 }}>
              <SectionHeader
                title="Curated Edits"
                sub="Tap an edit to jump in"
              />
              <View style={styles.bentoWrap}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {(["men", "women"] as const).map((slug) => {
                    const c = COLLECTIONS.find((x) => x.slug === slug)!;
                    return (
                      <PressableScale
                        key={slug}
                        scaleTo={0.97}
                        onPress={() => router.push(`/collection/${slug}`)}
                        style={styles.bentoHalf}
                      >
                        <Img
                          uri={c.image}
                          label={c.title}
                          style={StyleSheet.absoluteFill as object}
                        />
                        <LinearGradient
                          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.75)"]}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.bentoMeta}>
                          <Text style={styles.bentoCount}>
                            {productsIn(slug).length} ITEMS
                          </Text>
                          <Text style={styles.bentoTitle}>{c.title}</Text>
                        </View>
                      </PressableScale>
                    );
                  })}
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {(["jackets-hoodies", "accessories", "sale"] as const).map(
                    (slug) => {
                      const c = COLLECTIONS.find((x) => x.slug === slug)!;
                      const tone =
                        slug === "sale"
                          ? "#C8201A"
                          : slug === "accessories"
                            ? "#1E1D1B"
                            : "#2C2A27";
                      return (
                        <PressableScale
                          key={slug}
                          scaleTo={0.96}
                          onPress={() => router.push(`/collection/${slug}`)}
                          style={[styles.bentoThird, { backgroundColor: tone }]}
                        >
                          {c.image ? (
                            <>
                              <Img
                                uri={c.image}
                                style={StyleSheet.absoluteFill as object}
                              />
                              <LinearGradient
                                colors={[
                                  "rgba(0,0,0,0.15)",
                                  "rgba(0,0,0,0.82)",
                                ]}
                                style={StyleSheet.absoluteFill}
                              />
                            </>
                          ) : null}
                          <Text style={styles.bentoStar}>✱</Text>
                          <View>
                            <Text
                              style={styles.bentoThirdTitle}
                              numberOfLines={1}
                            >
                              {slug === "jackets-hoodies"
                                ? "Outerwear"
                                : c.title}
                            </Text>
                            <Text style={styles.bentoThirdSub}>
                              {productsIn(slug).length} pieces
                            </Text>
                          </View>
                        </PressableScale>
                      );
                    },
                  )}
                </View>
              </View>
            </View>

            {/* TAILORED FOR YOU GRID */}
            <View style={{ marginTop: 30 }}>
              <SectionHeader
                title="Picked For You"
                sub={
                  prefs.shopFor && prefs.shopFor !== "both"
                    ? `Tailored to your ${prefs.shopFor}'s profile`
                    : "Trending across the Republic"
                }
                action="Personalise"
                onAction={() => router.push("/personalise")}
              />
              <View style={styles.grid}>
                {feedProducts.slice(0, 6).map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    width={TILE_W}
                    index={i}
                  />
                ))}
              </View>
            </View>

            {/* NATIVE PUSH DROP ALERTS CARD (REPLACES PWA NEWSLETTER FORM) */}
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Ionicons name="notifications" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Instant Drop Alerts</Text>
                <Text style={styles.alertSub}>
                  Get push notifications 15 mins before restocks go live.
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={(v) => {
                  setNotifications(v);
                  if (v) {
                    success();
                    showToast("Drop alerts enabled · Code ZIPP10 unlocked");
                  }
                }}
                trackColor={{ true: colors.ink, false: colors.line }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PAD,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: fonts.black, fontSize: 13, color: "#fff" },
  brandTitle: {
    fontFamily: fonts.black,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  greeting: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mute,
    marginTop: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontFamily: fonts.black, fontSize: 9.5 },

  searchBar: {
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.soft,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 8,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13.5,
    color: colors.mute,
  },
  searchShortcut: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  pill: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: colors.soft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pillOn: { backgroundColor: colors.ink },
  pillText: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink },
  pillTextOn: { color: "#fff" },

  orderWidget: {
    marginHorizontal: PAD,
    marginBottom: 14,
    padding: 13,
    borderRadius: 18,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  orderWidgetTag: {
    fontFamily: fonts.heavy,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.ink,
  },
  orderStatusPill: {
    backgroundColor: "#E8F8F0",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  orderStatusText: {
    fontFamily: fonts.heavy,
    fontSize: 9.5,
    color: "#0b7a47",
    textTransform: "uppercase",
  },
  orderWidgetSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mute,
    marginTop: 2,
  },

  heroCard: {
    height: 350,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#111",
    padding: 20,
    justifyContent: "space-between",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10,10,10,0.72)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dropPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#12B76A",
  },
  dropBadgeText: {
    color: "#fff",
    fontFamily: fonts.heavy,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  exclusivesBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  exclusivesText: {
    color: "#fff",
    fontFamily: fonts.heavy,
    fontSize: 9.5,
    letterSpacing: 1.2,
  },
  heroBottom: { gap: 6 },
  heroKicker: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fonts.heavy,
    fontSize: 11,
    letterSpacing: 2.2,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: 0.4,
  },
  heroActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  heroCtaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 999,
  },
  heroCtaText: {
    color: colors.ink,
    fontFamily: fonts.heavy,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroPriceTag: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.bold,
    fontSize: 13,
  },

  bentoWrap: { paddingHorizontal: PAD, gap: 10 },
  bentoHalf: {
    flex: 1,
    height: 156,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 14,
  },
  bentoMeta: { gap: 2 },
  bentoCount: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fonts.heavy,
    fontSize: 9.5,
    letterSpacing: 1.5,
  },
  bentoTitle: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 20,
    textTransform: "uppercase",
  },
  bentoThird: {
    flex: 1,
    height: 114,
    borderRadius: 18,
    overflow: "hidden",
    padding: 12,
    justifyContent: "space-between",
  },
  bentoStar: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 18,
    fontFamily: fonts.black,
    alignSelf: "flex-end",
  },
  bentoThirdTitle: {
    color: "#fff",
    fontFamily: fonts.black,
    fontSize: 14,
    textTransform: "uppercase",
  },
  bentoThirdSub: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: fonts.medium,
    fontSize: 11,
    marginTop: 1,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: PAD,
    rowGap: 20,
  },

  alertCard: {
    marginHorizontal: PAD,
    marginTop: 28,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.soft,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  alertTitle: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.ink,
    textTransform: "uppercase",
  },
  alertSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mute,
    marginTop: 2,
    lineHeight: 16,
  },
});
