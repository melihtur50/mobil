import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  FadeInRight,
  Layout
} from 'react-native-reanimated';

const ANATOLIAN_SAFFRON = '#FF9F00';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key] as any;
          const isFocused = state.index === index;

          // Skip hidden tabs (href: null)
          if (options.href === null || (options as any).tabBarItemStyle?.display === 'none') {
            return null;
          }

          return (
            <TabItem 
              key={route.key}
              route={route}
              isFocused={isFocused}
              options={options}
              navigation={navigation}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({ route, isFocused, options, navigation }: any) => {
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate(route.name);
    }
  };

  // Bounce and Scale Animation
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: withSpring(isFocused ? -8 : 0, {
            damping: 12,
            stiffness: 200
          }) 
        },
        {
          scale: withSpring(isFocused ? 1.2 : 1)
        }
      ],
    };
  });

  // Color Glow Animation
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isFocused ? 'rgba(255, 159, 0, 0.15)' : 'transparent', { duration: 250 }),
      shadowColor: ANATOLIAN_SAFFRON,
      shadowOpacity: withTiming(isFocused ? 0.8 : 0),
      shadowRadius: withTiming(isFocused ? 15 : 0),
      elevation: isFocused ? 10 : 0,
      borderWidth: isFocused ? 1 : 0,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    };
  });

  const getIcon = () => {
    switch (route.name) {
      case 'index': 
        return { Lib: MaterialCommunityIcons, name: 'balloon' }; // Sıcak Hava Balonu
      case 'lezzet': 
        return { Lib: MaterialCommunityIcons, name: 'room-service' }; // Sunum Kapağı (Cloche)
      case 'tickets': 
        return { Lib: FontAwesome, name: 'credit-card' }; // Cüzdan
      case 'profile': 
        return { Lib: FontAwesome, name: 'user-circle' }; // Profil / User
      default: 
        return { Lib: FontAwesome, name: 'circle' };
    }
  };

  const { Lib, name } = getIcon();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabItem, { flex: isFocused ? 1.8 : 1 }]}
      activeOpacity={1}
    >
      <Animated.View style={[styles.iconContainer, animatedContainerStyle, animatedIconStyle]}>
        <Lib 
          name={name as any} 
          size={22} 
          color={isFocused ? ANATOLIAN_SAFFRON : 'rgba(169, 169, 169, 0.7)'} 
        />
      </Animated.View>
      {isFocused && (
        <Animated.Text 
          entering={FadeInRight.duration(300)} 
          style={styles.tabLabel}
          numberOfLines={1}
        >
          {options.title || route.name}
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 26, 51, 0.98)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 10,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)', // Precise 1px separator line
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    color: ANATOLIAN_SAFFRON,
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 10,
    letterSpacing: 0.5,
  }
});
