import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H, colors } from '@/lib/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dark?: boolean;
}

export function Sheet({ visible, onClose, children, dark }: Props) {
  const [mounted, setMounted] = useState(visible);
  const p = useSharedValue(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setMounted(true);
      p.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    } else {
      p.value = withTiming(0, { duration: 240, easing: Easing.in(Easing.cubic) }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
  }, [visible, p]);

  const back = useAnimatedStyle(() => ({ opacity: p.value * 0.55 }));
  const panel = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.value) * H * 0.6 }], opacity: 0.2 + p.value * 0.8 }));

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, back]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.panel,
            { paddingBottom: insets.bottom + 20, backgroundColor: dark ? colors.dark2 : '#fff' },
            panel,
          ]}
        >
          <View style={[styles.handle, dark && { backgroundColor: '#3a3a3a' }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 10,
    maxHeight: H * 0.85,
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: 16 },
});
