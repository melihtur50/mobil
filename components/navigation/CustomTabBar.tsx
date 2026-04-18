import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

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

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          const getIcon = (color: string) => {
            switch (route.name) {
              case 'index': return 'home';
              case 'explore': return 'search';
              case 'lezzet': return 'cutlery';
              case 'tickets': return 'ticket';
              case 'profile': return 'user';
              default: return 'circle';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, { flex: isFocused ? 1.5 : 1 }]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <FontAwesome 
                  name={getIcon(isFocused ? Colors.light.secondary : Colors.light.tabIconDefault) as any} 
                  size={20} 
                  color={isFocused ? Colors.light.primary : Colors.light.tabIconDefault} 
                  style={{ textAlign: 'center' }}
                />
              </View>
              {isFocused && (
                 <Text style={styles.tabLabel}>{options.title || route.name}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
    backgroundColor: 'rgba(0, 26, 51, 0.95)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: Colors.light.secondary,
  },
  tabLabel: {
    color: Colors.light.secondary,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
  }
});
