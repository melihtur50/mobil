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
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 8 },
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
      
      {/* Keşfet - Sadece Müşteri */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Keşfet',
          href: userRole === 'agency' ? null : undefined,
          tabBarItemStyle: userRole === 'agency' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="search" color={color} />,
        }}
      />

      {/* Lezzet - Sadece Müşteri */}
      <Tabs.Screen
        name="lezzet"
        options={{
          title: 'Lezzet',
          href: userRole === 'agency' ? null : undefined,
          tabBarItemStyle: userRole === 'agency' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cutlery" color={color} />,
        }}
      />

      {/* Biletlerim - Sadece Müşteri */}
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Biletlerim',
          href: userRole === 'agency' ? null : undefined,
          tabBarItemStyle: userRole === 'agency' ? { display: 'none' } : undefined,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="ticket" color={color} />,
        }}
      />

      {/* Profil / Acenta Paneli Modülü (Ortak) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: userRole === 'agency' ? 'Acenta Paneli' : 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name={userRole === 'agency' ? "building-o" : "user"} color={color} />,
        }}
      />

      {/* Gizlenen Diğer Sayfalar */}
      <Tabs.Screen name="dashboard" options={{ href: null, tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="add-tour" options={{ href: null, tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="favorites" options={{ href: null, tabBarItemStyle: { display: 'none' } }} />
    </Tabs>
  );
}
