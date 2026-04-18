import React from 'react';
import { TouchableOpacity, Animated, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps extends TouchableOpacityProps {
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onPress, 
  scaleTo = 0.96, 
  haptic = 'light',
  style,
  ...props 
}) => {
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: scaleTo,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  const handlePress = (event: any) => {
    if (haptic) {
      switch (haptic) {
        case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
        case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
        case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
        case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
        case 'warning': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
        case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
      }
    }
    onPress?.(event);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        {...props}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
