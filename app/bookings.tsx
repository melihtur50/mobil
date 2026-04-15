import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingsScreen() {
    const router = useRouter();

    const bookings = [
        {
            pnr: 'RES-0412',
            customer: 'Ahmet Yılmaz',
            email: 'Ahmet.y@gmail.com',
            tour: 'Kapadokya Balon Turu',
            date: '12 Nisan 2026',
            qrStatus: 'default',
            status: ['ÖDENDİ']
        },
        {
            pnr: 'RES-0413',
            customer: 'Ayşe Kaya',
            email: 'Ahmet.y@gmail.com',
            tour: 'Büyük İtalya Turu',
            date: '15 Nisan 2026',
            qrStatus: 'success',
            status: ['TAMAMLANDI', 'CHECKED-IN']
        }
    ];

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'ÖDENDİ': return styles.badgePaid;
            case 'TAMAMLANDI': return styles.badgeCompleted;
            case 'CHECKED-IN': return styles.badgeCheckedIn;
            default: return styles.badgePaid;
        }
    };

    const getStatusTextStyle = (status: string) => {
        switch(status) {
            case 'ÖDENDİ': return styles.badgeTextPaid;
            case 'TAMAMLANDI': return styles.badgeTextCompleted;
            case 'CHECKED-IN': return styles.badgeTextCheckedIn;
            default: return styles.badgeTextPaid;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>Rezervasyon Yönetimi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={16} color="#94a3b8" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Müşteri veya PNR Ara..."
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Title */}
                <View style={styles.sectionHeader}>
                    <FontAwesome name="check-square" size={18} color="#0ea5e9" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>Tüm Rezervasyonlar</Text>
                </View>

                {/* Booking Cards */}
                {bookings.map((booking, index) => (
                    <View key={index} style={styles.bookingCard}>
                        {/* Header: PNR & Badges */}
                        <View style={styles.cardHeader}>
                            <Text style={styles.pnrText}>{booking.pnr}</Text>
                            <View style={styles.badgesWrapper}>
                                {booking.status.map((st, i) => (
                                    <View key={i} style={[styles.badge, getStatusStyle(st)]}>
                                        {st === 'CHECKED-IN' && <FontAwesome name="check" size={10} color="#fff" style={{ marginRight: 4 }} />}
                                        <Text style={[styles.badgeText, getStatusTextStyle(st)]}>{st}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Body: Customer & Tour */}
                        <View style={styles.cardBody}>
                            <View style={styles.column}>
                                <Text style={styles.label}>MÜŞTERİ DETAYI</Text>
                                <Text style={styles.customerName}>{booking.customer}</Text>
                                <Text style={styles.customerEmail}>{booking.email}</Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>TUR & TARİH</Text>
                                <Text style={styles.tourName}>{booking.tour}</Text>
                                <Text style={styles.tourDate}><FontAwesome name="calendar-o" size={12} color="#3b82f6"/>  {booking.date}</Text>
                            </View>
                        </View>

                        {/* Footer: Actions */}
                        <View style={styles.cardFooter}>
                            <TouchableOpacity style={[styles.qrBtn, booking.qrStatus === 'success' && styles.qrBtnSuccess]}>
                                <FontAwesome name="qrcode" size={18} color={booking.qrStatus === 'success' ? '#10b981' : '#64748b'} />
                                <Text style={[styles.qrBtnText, booking.qrStatus === 'success' && { color: '#10b981' }]}>
                                    {booking.qrStatus === 'success' ? 'GELDİ' : 'BİLET QR'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.downloadBtn}>
                                <FontAwesome name="download" size={14} color="#334155" style={{ marginRight: 8 }} />
                                <Text style={styles.downloadBtnText}>Voucher İndir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f7f6', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 8, marginLeft: -8 },
    headerBarTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    
    scrollContent: { padding: 20, paddingBottom: 60 },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#0f172a', fontWeight: '500' },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },

    bookingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
    
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    pnrText: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginTop: 4 },
    badgesWrapper: { alignItems: 'flex-end', gap: 6 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
    badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    
    badgePaid: { backgroundColor: '#d1fae5' },
    badgeTextPaid: { color: '#059669' },
    badgeCompleted: { backgroundColor: '#ffe4e6' },
    badgeTextCompleted: { color: '#e11d48' },
    badgeCheckedIn: { backgroundColor: '#10b981' },
    badgeTextCheckedIn: { color: '#fff' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },

    cardBody: { flexDirection: 'column', gap: 16 },
    column: { flex: 1 },
    label: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5, marginBottom: 4 },
    customerName: { fontSize: 15, fontWeight: '800', color: '#334155' },
    customerEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
    tourName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    tourDate: { fontSize: 13, fontWeight: '600', color: '#3b82f6', marginTop: 4 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
    
    qrBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, backgroundColor: '#f8fafc' },
    qrBtnSuccess: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
    qrBtnText: { fontSize: 10, fontWeight: '800', color: '#64748b', marginTop: 4 },
    
    downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1' },
    downloadBtnText: { fontSize: 13, fontWeight: '700', color: '#334155' }
});
