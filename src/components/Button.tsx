import { tap } from "@/lib/haptics";
import { colors, fonts, radius } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { PressableScale } from "./PressableScale";

type Variant = "primary" | "light" | "outline" | "outlineLight" | "accent";

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.ink, fg: "#fff", border: colors.ink },
  light: { bg: "#fff", fg: colors.ink, border: "#fff" },
  outline: { bg: "transparent", fg: colors.ink, border: colors.ink },
  outlineLight: {
    bg: "rgba(255,255,255,0.08)",
    fg: "#fff",
    border: "rgba(255,255,255,0.7)",
  },
  accent: { bg: colors.accent, fg: "#fff", border: colors.accent },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  style,
  small,
}: Props) {
  const p = palette[variant];
  return (
    <PressableScale
      disabled={disabled || loading}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={[
        styles.base,
        small && styles.small,
        {
          backgroundColor: p.bg,
          borderColor: p.border,
          opacity: disabled ? 0.35 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={p.fg}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text
            style={[styles.text, small && { fontSize: 13 }, { color: p.fg }]}
          >
            {title}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 45,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  small: { height: 44, paddingHorizontal: 18 },
  row: { flexDirection: "row", alignItems: "center" },
  text: {
    fontFamily: fonts.heavy,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
