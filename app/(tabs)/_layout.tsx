import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { userRole } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#008cb3', // Tourkia Mavi
        tabBarInactiveTintColor: '#9ca3af', // Gri
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      }}>
      
      {/* Her İki Rolde Ortak */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      
      {/* Sadece Müşteri (Customer) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Keşfet',
          href: userRole === 'customer' ? undefined : null,
          tabBarItemStyle: userRole !== 'customer' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Biletlerim',
          href: userRole === 'customer' ? undefined : null,
          tabBarItemStyle: userRole !== 'customer' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="ticket" color={color} />,
        }}
      />

      {/* Sadece Acenta (Agency) */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Panelim',
          href: userRole === 'agency' ? undefined : null,
          tabBarItemStyle: userRole !== 'agency' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-tour"
        options={{
          title: 'Tur Yükle',
          href: userRole === 'agency' ? undefined : null,
          tabBarItemStyle: userRole !== 'agency' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="plus-circle" color={color} />,
        }}
      />

      {/* Eski / İptal Edilen Sekmeler - Gizli */}
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {/* Her İki Rolde Ortak */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
