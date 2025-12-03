import { FontAwesome5 } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';
import { ComponentProps } from 'react';

// Mapping SF Symbols ke FontAwesome5
const MAPPING = {
  'house.fill': 'home',
  'map.fill': 'map',
  'shop.fill': 'shopping-bag',
  'list.banksampah': 'trash',       // gunakan icon yang pasti ada
  'profile.fill': 'user-circle',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * IconSymbol menggunakan FontAwesome5, dengan fallback
 * jika nama icon tidak valid.
 */
export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
}: IconSymbolProps) {
  const iconName = MAPPING[name] ?? 'question-circle'; // fallback jika tidak ada
  return <FontAwesome5 name={iconName} size={size} color={color} style={style} solid />;
}
