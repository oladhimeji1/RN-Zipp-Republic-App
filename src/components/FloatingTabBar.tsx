import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { useCartCount, useStore } from '@/lib/store';
import { colors, fonts, shadow } from '@/lib/theme';
import { select } from '@/lib/haptics';

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  shop: { on: 'grid', off: 'grid-outline', label: 'Shop' },
  saved: { on: 'heart', off: 'heart-outline', label: 'Saved' },
  bag: { on: 'bag-handle', off: 'bag-handle-outline', label: 'Bag' },
  profile: { on: 'person', off: 'person-outline', label: 'Profile' },
};

function Item({ name, focused, onPress, badge }: { name: string; focused: boolean; onPress: () => void; badge?: number }) {
  const meta = ICONS[name];
  const p = useDerivedValue(() => withSpring(focused ? 1 : 0, { damping: 26, stiffness: 360, mass: 0.7 }));
  const box = useAnimatedStyle(() => ({
    width: 48 + p.value * 44,
    backgroundColor: `rgba(255,255,255,${p.value * 1})`,
  }));
  const label = useAnimatedStyle(() => ({ opacity: p.value, width: p.value * 44, transform: [{ translateX: (1 - p.value) * -4 }] }));
  return (
    <PressableScale onPress={onPress} scaleTo={0.9}>
      <Animated.View style={[styles.item, box]}>
        <Ionicons name={focused ? meta.on : meta.off} size={21} color={focused ? colors.ink : '#fff'} />
        <Animated.View style={[{ overflow: 'hidden' }, label]}>
          <Text style={styles.label} numberOfLines={1}>
            {meta.label}
          </Text>
        </Animated.View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}

// Structural props so this works across expo-router / react-navigation versions.
interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

export function FloatingTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const count = useCartCount();
  const wishCount = useStore((s) => s.wishlist.length);
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) + 4 }]}>
      <View style={[styles.pill, shadow]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        {state.routes.map((route, i) => {
          if (!ICONS[route.name]) return null;
          const focused = state.index === i;
          return (
            <Item
              key={route.key}
              name={route.name}
              focused={focused}
              badge={route.name === 'bag' ? count : route.name === 'saved' ? wishCount : undefined}
              onPress={() => {
                select();
                const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.92)',
    borderRadius: 999,
    padding: 6,
    gap: 2,
    overflow: 'hidden',
  },
  item: { height: 46, borderRadius: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  label: { fontFamily: fonts.heavy, fontSize: 12, color: colors.ink },
  badge: { position: 'absolute', top: 2, right: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontFamily: fonts.black, fontSize: 9 },
});
