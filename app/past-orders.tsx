import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PastOrdersScreen() {
    const router = useRouter();

    const orders = [
        { id: '#TRK-8429', title: 'Kapadokya Balon Turu', date: '12 Mayıs 2026', price: '₺4.500', status: 'Tamamlandı' },
        { id: '#TRK-3910', title: 'İstanbul Boğaz Turu', date: '3 Nisan 2026', price: '₺1.200', status: 'Tamamlandı' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={16} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Geçmiş Siparişlerim</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {orders.map((order, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.orderId}>{order.id}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{order.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.tourTitle}>{order.title}</Text>
                        <View style={styles.cardFooter}>
                            <View style={styles.footerItem}>
                                <FontAwesome name="calendar-o" size={14} color="#64748b" />
                                <Text style={styles.footerText}>{order.date}</Text>
                            </View>
                            <Text style={styles.price}>{order.price}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    container: { padding: 24 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    orderId: { fontSize: 12, fontWeight: '800', color: '#94a3b8' },
    statusBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '800', color: '#16a34a' },
    tourTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
    price: { fontSize: 16, fontWeight: '900', color: '#008cb3' }
});
