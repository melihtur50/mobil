import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width! as number || -200, width! as number || 200],
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <AnimatedLinearGradient
        colors={['#F1F5F9', '#F8FAFC', '#F1F5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e1e5e9',
    overflow: 'hidden',
  },
});
