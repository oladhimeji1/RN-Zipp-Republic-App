import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, fonts, radius } from '@/lib/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string | null;
  dark?: boolean;
  password?: boolean;
}

export function Input({ label, error, dark, password, style, onFocus, onBlur, ...rest }: Props) {
  const f = useSharedValue(0);
  const [hidden, setHidden] = useState(true);
  const box = useAnimatedStyle(() => ({
    borderColor: error
      ? colors.accent
      : interpolateColor(f.value, [0, 1], [dark ? '#2b2b2b' : colors.line, dark ? '#fff' : colors.ink]),
  }));
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={[styles.label, dark && { color: '#bdbab3' }]}>{label}</Text> : null}
      <Animated.View style={[styles.box, dark && { backgroundColor: '#141414' }, box]}>
        <TextInput
          {...rest}
          secureTextEntry={password ? hidden : rest.secureTextEntry}
          placeholderTextColor={dark ? '#6d6a64' : '#A9A59D'}
          onFocus={(e) => {
            f.value = withTiming(1, { duration: 160 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            f.value = withTiming(0, { duration: 160 });
            onBlur?.(e);
          }}
          style={[styles.input, dark && { color: '#fff' }, style]}
        />
        {password ? (
          <PressableScale onPress={() => setHidden((h) => !h)} hitSlop={12}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mute} />
          </PressableScale>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.semi, fontSize: 12, color: colors.body, marginBottom: 6, letterSpacing: 0.4 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink, height: '100%' },
  error: { fontFamily: fonts.medium, fontSize: 12, color: colors.accent, marginTop: 5 },
});
