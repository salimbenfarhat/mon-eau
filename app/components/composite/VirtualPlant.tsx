import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor
} from 'react-native-reanimated';

interface VirtualPlantProps {
  progress: number; // 0 to 1
}

export default function VirtualPlant({ progress }: VirtualPlantProps) {
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withSpring(0.5 + progress * 0.5); // Grows from 0.5 to 1.0
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress,
      [0, 0.5, 1],
      ['#A7F3D0', '#34D399', '#059669'] // Different shades of green
    );

    return {
      transform: [{ scale: scale.value }],
      opacity: interpolate(progress, [0, 0.1], [0.3, 1]),
    };
  });

  // Choose icon based on progress
  let iconName: any = 'leaf-outline';
  if (progress > 0.3) iconName = 'leaf';
  if (progress > 0.7) iconName = 'flower';
  if (progress >= 1) iconName = 'sunny'; // Full bloom / Success

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={iconName}
          size={80}
          color={progress >= 1 ? '#FBBF24' : '#10B981'}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
