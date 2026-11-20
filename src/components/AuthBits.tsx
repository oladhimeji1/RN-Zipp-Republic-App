import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, fonts, radius } from '@/lib/theme';
import { tap } from '@/lib/haptics';

export function SocialRow({ onPress, dark }: { onPress: () => void; dark?: boolean }) {
  return (
    <View style={styles.row}>
      <Social icon="logo-google" label="Google" onPress={onPress} dark={dark} />
      <Social icon="logo-apple" label="Apple" onPress={onPress} dark={dark} />
    </View>
  );
}

function Social({ icon, label, onPress, dark }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; dark?: boolean }) {
  return (
    <PressableScale
      style={[styles.social, dark && { borderColor: '#333' }]}
      onPress={() => {
        tap();
        onPress();
      }}
    >
      <Ionicons name={icon} size={18} color={dark ? '#fff' : colors.ink} />
      <Text style={[styles.socialText, dark && { color: '#fff' }]}>{label}</Text>
    </PressableScale>
  );
}

export function OrDivider() {
  return (
    <View style={styles.or}>
      <View style={styles.line} />
      <Text style={styles.orText}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

export function SuccessBadge({ size = 84 }: { size?: number }) {
  // scalloped badge built from two rotated rounded squares
  const s = size * 0.78;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: s, height: s, borderRadius: s * 0.28, backgroundColor: colors.success }} />
      <View style={{ position: 'absolute', width: s, height: s, borderRadius: s * 0.28, backgroundColor: colors.success, transform: [{ rotate: '45deg' }] }} />
      <Ionicons name="checkmark" size={size * 0.46} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  social: { flex: 1, height: 50, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  socialText: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  or: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
  orText: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
});
