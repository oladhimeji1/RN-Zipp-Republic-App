import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, fonts } from '@/lib/theme';
import { select } from '@/lib/haptics';

export function QtyStepper({ value, onChange, min = 1, max = 10 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <View style={styles.wrap}>
      <PressableScale
        hitSlop={8}
        onPress={() => {
          select();
          onChange(value - 1);
        }}
        disabled={value <= min && min > 0}
        style={[styles.btn, value <= min && min > 0 && { opacity: 0.3 }]}
      >
        <Ionicons name="remove" size={16} color={colors.ink} />
      </PressableScale>
      <Text style={styles.value}>{value}</Text>
      <PressableScale
        hitSlop={8}
        onPress={() => {
          select();
          onChange(value + 1);
        }}
        disabled={value >= max}
        style={[styles.btn, value >= max && { opacity: 0.3 }]}
      >
        <Ionicons name="add" size={16} color={colors.ink} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.soft, borderRadius: 999, padding: 4 },
  btn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 34, textAlign: 'center', fontFamily: fonts.heavy, fontSize: 14, color: colors.ink },
});
