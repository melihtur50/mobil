import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TicketsTab() {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <FontAwesome name="ticket" size={60} color="#cbd5e1" style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Biletlerim</Text>
            <Text style={styles.subtitle}>Henüz biletiniz bulunmamaktadır.</Text>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b' }
});
