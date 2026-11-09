import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface IsongaLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  textColor?: string;
  taglineColor?: string;
}

export function IsongaLogo({
  size = 48,
  showText = false,
  showTagline = false,
  textColor = '#172B24',
  taglineColor = '#64746C',
}: IsongaLogoProps) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Outer circular badge frame */}
        <Circle cx="50" cy="50" r="46" fill="#F0FBF5" stroke="#DDF7E8" strokeWidth="2.5" />

        {/* Top-right Radio Broadcast Signal Waves */}
        <Path
          d="M 68 28 A 20 20 0 0 1 82 42"
          stroke="#0284C7"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <Path
          d="M 72 20 A 30 30 0 0 1 90 38"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Green rolling hill base */}
        <Path
          d="M 16 75 C 32 64 68 64 84 75 C 76 86 64 92 50 92 C 36 92 24 86 16 75 Z"
          fill="#16A34A"
        />

        {/* Left Community Figure (Teal / Blue) */}
        <Circle cx="34" cy="46" r="7" fill="#0284C7" />
        <Path
          d="M 23 68 C 23 58 31 56 34 56 C 37 56 45 58 45 68 Z"
          fill="#0284C7"
        />

        {/* Center Community Figure (Prominent Deep Blue / Slate) */}
        <Circle cx="50" cy="40" r="8.5" fill="#0C4A6E" />
        <Path
          d="M 37 66 C 37 54 46 51 50 51 C 54 51 63 54 63 66 Z"
          fill="#0C4A6E"
        />

        {/* Right Community Figure (Warm Yellow / Gold) */}
        <Circle cx="66" cy="46" r="7" fill="#F59E0B" />
        <Path
          d="M 55 68 C 55 58 63 56 66 56 C 69 56 77 58 77 68 Z"
          fill="#F59E0B"
        />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            Isonga <Text style={styles.titleAccent}>Connect</Text>
          </Text>
          {showTagline && (
            <Text style={[styles.tagline, { color: taglineColor }]}>
              Your community. Your updates.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: '#16A34A',
  },
  tagline: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});

