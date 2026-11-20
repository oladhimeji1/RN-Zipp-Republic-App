import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { MONOGRAM_WHITE } from '@/lib/data';
import { colors, fonts } from '@/lib/theme';

interface Props {
  uri?: string;
  style?: StyleProp<ViewStyle>;
  tone?: string;
  label?: string;
  contentPosition?: 'top' | 'center';
}

// Renders a remote image, or a designed placeholder tile when no image is provided.
export function Img({ uri, style, tone = '#E9E6DF', label, contentPosition = 'center' }: Props) {
  if (!uri) {
    return (
      <View style={[styles.ph, { backgroundColor: tone }, style]}>
        <Image source={MONOGRAM_WHITE} style={styles.mono} tintColor="rgba(0,0,0,0.16)" contentFit="contain" />
        {label ? (
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={[{ backgroundColor: colors.soft }, style as object]}
      contentFit="cover"
      contentPosition={contentPosition}
      transition={350}
    />
  );
}

const styles = StyleSheet.create({
  ph: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mono: { width: 58, height: 42 },
  label: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 1.5, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginTop: 8, paddingHorizontal: 12, textAlign: 'center' },
});
