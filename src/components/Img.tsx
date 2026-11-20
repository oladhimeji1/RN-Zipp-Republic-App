import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
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
        <Text style={styles.big}>✱</Text>
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
  big: { fontSize: 64, color: 'rgba(0,0,0,0.14)', fontFamily: fonts.black },
  label: { fontFamily: fonts.heavy, fontSize: 11, letterSpacing: 1.5, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginTop: 6, paddingHorizontal: 12, textAlign: 'center' },
});
