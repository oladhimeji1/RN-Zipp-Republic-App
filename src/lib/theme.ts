import { Dimensions, Platform } from 'react-native';

export const colors = {
  bg: '#FFFFFF',
  ink: '#0A0A0A',
  soft: '#F4F3F0',
  line: '#E8E6E1',
  mute: '#8A8780',
  body: '#3B3935',
  accent: '#E5231B',
  success: '#12B76A',
  dark: '#0A0A0A',
  dark2: '#161616',
};

export const fonts = {
  body: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semi: 'Archivo_600SemiBold',
  bold: 'Archivo_700Bold',
  heavy: 'Archivo_800ExtraBold',
  black: 'Archivo_900Black',
  serif: 'DMSerifDisplay_400Regular_Italic',
};

export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 };

export const { width: W, height: H } = Dimensions.get('window');

export const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  default: { elevation: 8 },
}) as object;

export const PAD = 20;
export const TAB_SPACE = 110;

export const spring = {
  snappy: { damping: 28, stiffness: 420, mass: 0.7 },
  smooth: { damping: 26, stiffness: 320, mass: 0.8 },
  sheet: { damping: 32, stiffness: 360, mass: 0.85 },
};
