import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { submitReview, TourkiaPoints } from '../services/tourApi';

export default function PastOrdersScreen() {
    const router = useRouter();

    const [orders, setOrders] = useState([
        { id: '#TRK-8429', tourId: '1', title: 'Kapadokya Balon & Peri Bacaları', dateStr: '21 Nisan 2026', timestamp: new Date('2026-04-21T09:00:00Z').getTime(), price: '₺4.500', isRated: false },
        { id: '#TRK-3199', tourId: '2', title: 'Büyük İtalya Turu', dateStr: '16 Nisan 2026', timestamp: new Date('2026-04-16T12:00:00Z').getTime(), price: '₺18.500', isRated: false },
        { id: '#TRK-3910', tourId: '3', title: 'İskandinav Fiyortları', dateStr: '3 Nisan 2026', timestamp: new Date('2026-04-03T10:00:00Z').getTime(), price: '₺25.000', isRated: false }
    ]);

    const getStatus = (timestamp: number) => {
        // Mock current environment logic to today (16th April 2026) mid-day
        const now = new Date('2026-04-16T14:00:00Z').getTime();
        const startOfDay = new Date('2026-04-16T00:00:00Z').getTime();
        const endOfDay = new Date('2026-04-16T23:59:59Z').getTime();

        if (timestamp > endOfDay) {
            return { label: 'BEKLEMEDE', color: '#f59e0b', bg: '#fef3c7' };
        } else if (timestamp >= startOfDay && timestamp <= now) {
            return { label: 'DEVAM EDİYOR', color: '#3b82f6', bg: '#dbeafe' };
        } else if (timestamp > now && timestamp <= endOfDay) {
            return { label: 'BUGÜN', color: '#8b5cf6', bg: '#ede9fe' };
        } else {
            return { label: 'TAMAMLANDI', color: '#10b981', bg: '#dcfce7' };
        }
    };

    const handleRate = (orderId: string, tourId: string) => {
        Alert.alert(
            "Deneyimini Puanla",
            "Lütfen turu değerlendirin. Fotoğraflı yorumla +50 TourkiaPuan kazanın!",
            [
                { text: "📸 Fotoğraflı Mükemmel Yorum (5⭐)", onPress: () => processRating(orderId, tourId, 5, true) },
                { text: "Normal Mükemmel (5⭐)", onPress: () => processRating(orderId, tourId, 5, false) },
                { text: "Kötü (1⭐)", onPress: () => processRating(orderId, tourId, 1, false), style: 'destructive' },
                { text: "Vazgeç", style: 'cancel' }
            ]
        );
    };

    const processRating = (orderId: string, tourId: string, stars: number, withPhoto: boolean) => {
        submitReview(tourId, stars);
        setOrders(orders.map(o => o.id === orderId ? { ...o, isRated: true } : o));
        let alertMsg = 'Teşekkürler! Değerlendirmeniz Social-Proof sistemine başarıyla eklendi.';
        if (withPhoto) {
             TourkiaPoints.add(50);
             alertMsg += '\n📸 Fotoğraflı yorumunuz için hesabınıza anında +50 TourkiaPuan yüklendi!';
        }
        alert(alertMsg);
    };

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
                {orders.map((order) => {
                    const status = getStatus(order.timestamp);
                    return (
                        <View key={order.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.orderId}>{order.id}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                                </View>
                            </View>
                            <Text style={styles.tourTitle}>{order.title}</Text>
                            <View style={styles.cardFooter}>
                                <View style={styles.footerItem}>
                                    <FontAwesome name="calendar-o" size={14} color="#64748b" />
                                    <Text style={styles.footerText}>{order.dateStr}</Text>
                                </View>
                                <Text style={styles.price}>{order.price}</Text>
                            </View>
                            
                            {/* Puanlama Butonu (Sadece TAMAMLANDI olanlar) */}
                            {status.label === 'TAMAMLANDI' && (
                                <View style={styles.rateSection}>
                                    {order.isRated ? (
                                        <View style={styles.ratedBadge}>
                                            <FontAwesome name="check-circle" size={14} color="#10b981" />
                                            <Text style={styles.ratedText}>Puan Verildi</Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity style={styles.rateBtn} onPress={() => handleRate(order.id, order.tourId)}>
                                            <FontAwesome name="star" size={14} color="#febb02" />
                                            <Text style={styles.rateBtnText}>Deneyimini Puanla</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
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
    price: { fontSize: 16, fontWeight: '900', color: '#008cb3' },
    rateSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
    rateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    rateBtnText: { color: '#0f172a', fontWeight: '800', fontSize: 13, marginLeft: 6 },
    ratedBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#ecfdf5', borderRadius: 20 },
    ratedText: { color: '#10b981', fontWeight: '800', fontSize: 13, marginLeft: 6 }
});
