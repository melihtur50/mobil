import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

export default function TabLayout() {
  const { userRole } = useAuth();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Keşfet',
          href: userRole === 'agency' ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="lezzet"
        options={{
          title: 'Lezzet',
          href: userRole === 'agency' ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Biletler',
          href: userRole === 'agency' ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: userRole === 'agency' ? 'Acenta' : 'Profil',
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="add-tour" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
    </Tabs>
  );
}
