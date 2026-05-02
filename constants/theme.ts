import { Platform } from 'react-native';

const PrimaryNavy = '#001A33';
const RoyalGold = '#D4AF37';
const SoftGray = '#F8FAFC';
const DeepGray = '#1E293B';
const CoralAccent = '#FF6B6B';

export const Colors = {
  light: {
    primary: PrimaryNavy,
    secondary: RoyalGold,
    accent: CoralAccent,
    text: DeepGray,
    textMuted: '#64748B',
    background: SoftGray,
    surface: '#FFFFFF',
    border: '#E2E8F0',
    tint: RoyalGold,
    icon: '#64748B',
    tabIconDefault: '#A9A9A9',
    tabIconSelected: RoyalGold,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    primary: '#0F172A',
    secondary: RoyalGold,
    accent: CoralAccent,
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    background: '#020617',
    surface: '#0F172A',
    border: '#1E293B',
    tint: RoyalGold,
    icon: '#94A3B8',
    tabIconDefault: '#475569',
    tabIconSelected: RoyalGold,
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Fonts = {
  family: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};
