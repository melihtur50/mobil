import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FinanceScreen() {
    const router = useRouter();

    const invoices = [
        { id: 'PRF-2026-081', date: '25 Şubat 2026', amount: '₺24.500', status: 'ÖDENDİ' },
        { id: 'PRF-2026-042', date: '10 Ocak 2026', amount: '₺18.200', status: 'ÖDENDİ' },
        { id: 'PRF-2025-419', date: '15 Kasım 2025', amount: '₺42.000', status: 'ÖDENDİ' }
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>FİNANS & FATURA</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* HAKEDİŞ CÜZDANI */}
                <View style={styles.walletCard}>
                    <View style={styles.walletHeader}>
                        <View style={styles.walletTitleRow}>
                            <FontAwesome name="money" size={16} color="#94a3b8" />
                            <Text style={styles.walletTitleText}>HAKEDİŞ CÜZDANI</Text>
                        </View>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>AKTİF</Text>
                        </View>
                    </View>
                    
                    <View style={styles.walletBody}>
                        <Text style={styles.walletLabel}>Çekilebilir Bakiye</Text>
                        <Text style={styles.walletBalance}>₺29.100,00</Text>
                    </View>
                    <View style={styles.walletBgDeco} />
                </View>

                {/* ÖDEME TALEBİ OLUŞTUR */}
                <View style={styles.requestCard}>
                    <Text style={styles.requestTitle}>Ödeme Talebi Oluştur</Text>
                    <Text style={styles.requestDesc}>
                        Mevcut bakiyeniz minimum ödeme eşiği olan <Text style={{ fontWeight: '800', color: '#0f172a' }}>₺5.000</Text>'nin üzerinde olduğu için hemen banka hesabınıza transfer talep edebilirsiniz.
                    </Text>
                    <TouchableOpacity style={styles.requestBtn}>
                        <FontAwesome name="check-circle-o" size={16} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.requestBtnText}>Hemen Ödeme İste</Text>
                    </TouchableOpacity>
                </View>

                {/* FATURALAR BÖLÜMÜ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Proforma Faturalar & Ödeme Geçmişi</Text>
                </View>

                <View style={styles.invoicesWrapper}>
                    {invoices.map((inv, index) => (
                        <View key={index} style={styles.invoiceCard}>
                            <View style={styles.invoiceTop}>
                                <Text style={styles.invoiceId}>{inv.id}</Text>
                                <View style={styles.badgeSuccess}>
                                    <FontAwesome name="check" size={10} color="#059669" style={{ marginRight: 4 }} />
                                    <Text style={styles.badgeSuccessText}>{inv.status}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.invoiceDetails}>
                                <View style={styles.detailCol}>
                                    <Text style={styles.detailLabel}>TARİH</Text>
                                    <Text style={styles.detailValue}>{inv.date}</Text>
                                </View>
                                <View style={styles.detailCol}>
                                    <Text style={styles.detailLabel}>TUTAR</Text>
                                    <Text style={styles.detailValueBold}>{inv.amount}</Text>
                                </View>
                                <View style={styles.actionCol}>
                                    <TouchableOpacity style={styles.downloadBtn}>
                                        <Text style={styles.downloadBtnText}>PDF İndir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 8, marginLeft: -8 },
    headerBarTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
    
    scrollContent: { padding: 20, paddingBottom: 60 },

    walletCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 24, paddingBottom: 32, marginBottom: 16, position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
    walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    walletTitleRow: { flexDirection: 'row', alignItems: 'center' },
    walletTitleText: { color: '#e2e8f0', fontSize: 13, fontWeight: '800', letterSpacing: 1, marginLeft: 8 },
    activeBadge: { backgroundColor: '#064e3b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    activeBadgeText: { color: '#10b981', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    walletBody: { position: 'relative', zIndex: 2 },
    walletLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 4 },
    walletBalance: { color: '#fff', fontSize: 40, fontWeight: '900', letterSpacing: -1 },
    walletBgDeco: { position: 'absolute', right: -40, bottom: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.03)', zIndex: 1 },

    requestCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, borderWidth: 1, borderColor: '#f1f5f9' },
    requestTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
    requestDesc: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 20 },
    requestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    requestBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

    sectionHeader: { marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },

    invoicesWrapper: { gap: 12 },
    invoiceCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
    
    invoiceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    invoiceId: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
    
    badgeSuccess: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeSuccessText: { fontSize: 11, fontWeight: '900', color: '#059669', letterSpacing: 0.5 },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },

    invoiceDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    detailCol: { flex: 1 },
    detailLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5, marginBottom: 4 },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#475569' },
    detailValueBold: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
    
    actionCol: { alignItems: 'flex-end', justifyContent: 'center' },
    downloadBtn: { backgroundColor: '#f0f9ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    downloadBtnText: { color: '#0ea5e9', fontSize: 13, fontWeight: '800' }
});
