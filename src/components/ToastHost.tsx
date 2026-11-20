import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { onToast, ToastMsg } from '@/lib/toast';
import { colors, fonts } from '@/lib/theme';

export function ToastHost() {
  const [t, setT] = useState<ToastMsg | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    onToast((m) => {
      setT(m);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setT(null), 2800);
    });
    return () => onToast(null);
  }, []);

  if (!t) return null;
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
      <Animated.View
        key={t.id}
        entering={FadeInUp.duration(200)}
        exiting={FadeOutUp.duration(160)}
        style={[styles.toast, { top: insets.top + 10 }]}
      >
        <Text style={styles.text} numberOfLines={2}>
          {t.text}
        </Text>
        {t.actionLabel ? (
          <PressableScale
            onPress={() => {
              setT(null);
              t.onAction?.();
            }}
          >
            <Text style={styles.action}>{t.actionLabel}</Text>
          </PressableScale>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: colors.ink,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  text: { flex: 1, color: '#fff', fontFamily: fonts.semi, fontSize: 14 },
  action: { color: '#fff', fontFamily: fonts.black, fontSize: 12, letterSpacing: 1.2, textDecorationLine: 'underline' },
});
