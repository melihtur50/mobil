import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Modal, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function CheckoutSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const scaleAnim = new Animated.Value(0);
    const [pnr] = useState('PNR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    const [voucherVisible, setVoucherVisible] = useState(false);

    useEffect(() => {
        // Simulate Digital_Voucher_Service email
        setTimeout(() => {
            alert(`💳 Ödeme Başarılı!\n📧 PNR: ${pnr} numaralı Digital Voucher PDF biletiniz e-postanıza anlık gönderildi.`);
        }, 800);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Animated.View style={[styles.iconBox, { transform: [{ scale: scaleAnim }] }]}>
                    <FontAwesome name="check" size={50} color="#fff" />
                </Animated.View>

                <Text style={styles.title}>Rezervasyon Basarili!</Text>
                <Text style={styles.subtitle}>
                    Ödemeniz güvenli bir şekilde ulaştı. E-biletiniz cihazınıza kaydedildi, "Çevrimdışı Biletlerim" kısmından internet olmadan da görüntüleyebilirsiniz.
                </Text>

                <View style={styles.ticketBox}>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>PNR No:</Text>
                        <Text style={styles.ticketValue}>{pnr}</Text>
                    </View>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>Tarih:</Text>
                        <Text style={styles.ticketValue}>{params.date || '18 Nisan 2026'}</Text>
                    </View>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>Durum:</Text>
                        <Text style={[styles.ticketValue, {color: '#10b981'}]}>Onaylandı</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.biletBtn} onPress={() => setVoucherVisible(true)}>
                    <Text style={styles.biletBtnText}>E-Bileti (PDF) Görüntüle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.homeBtnText}>Ana Sayfaya Dön</Text>
                </TouchableOpacity>
            </View>

            {/* Digital Voucher PDF Modal Simulation */}
            <Modal visible={voucherVisible} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={styles.pdfContainer}>
                    <View style={styles.pdfHeader}>
                        <TouchableOpacity onPress={() => setVoucherVisible(false)}>
                            <Text style={styles.pdfCloseText}>Kapat</Text>
                        </TouchableOpacity>
                        <Text style={styles.pdfTitle}>Digital Voucher</Text>
                        <TouchableOpacity>
                            <FontAwesome name="download" size={20} color="#0071c2" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                        <View style={styles.pdfVoucher}>
                            {/* Brand / Agency */}
                            <Text style={styles.pdfAgency}>{params.agencyName || 'Melih Tours'}</Text>
                            <Text style={styles.pdfDivider}>--------------------------------</Text>
                            
                            {/* QR Alanı - Tek veya Çift */}
                            <View style={[styles.pdfQrSection, params.hasMealPackage === 'true' && styles.pdfQrSectionDual]}>
                                <View style={styles.pdfQrWrapper}>
                                    <Text style={styles.pdfQrLabel}>Tur Operasyonu</Text>
                                    <View style={[styles.pdfQrBox, { borderColor: '#0071c2' }]}>
                                        <QRCode value={`TOUR-${pnr}`} size={params.hasMealPackage === 'true' ? 120 : 160} backgroundColor="white" color="#0f172a" />
                                    </View>
                                </View>

                                {params.hasMealPackage === 'true' && (
                                    <View style={styles.pdfQrWrapper}>
                                        <Text style={styles.pdfQrLabel}>Restoran Giriş</Text>
                                        <View style={[styles.pdfQrBox, { borderColor: '#f97316' }]}>
                                            <QRCode value={`MEAL-${pnr}`} size={120} backgroundColor="white" color="#0f172a" />
                                        </View>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.pdfPnr}>PNR: {pnr}</Text>
                            <Text style={styles.pdfAuthInfo}>Rehbere binerken bu kodu okutunuz.</Text>
                            
                            <Text style={styles.pdfDivider}>--------------------------------</Text>
                            
                            {/* Tour Details */}
                            <Text style={styles.pdfLabel}>Satın Alınan Tur</Text>
                            <Text style={styles.pdfTourName}>{params.tourName || 'Kapadokya Balon Turu'}</Text>

                            <View style={styles.pdfRow}>
                                <View>
                                    <Text style={styles.pdfLabel}>Tarih</Text>
                                    <Text style={styles.pdfValue}>{params.date || '18 Nisan 2026'}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.pdfLabel}>Kişi Sayısı</Text>
                                    <Text style={styles.pdfValue}>{params.guests || '2'} Yetişkin</Text>
                                </View>
                            </View>

                            <View style={styles.pdfWarningBox}>
                                <FontAwesome name="info-circle" size={14} color="#0369a1" />
                                <Text style={styles.pdfWarningText}>Lütfen buluşma saatinden 15 dakika önce lokasyonda olunuz.</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#10b981', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
    subtitle: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    
    ticketBox: { width: '100%', backgroundColor: '#f8fafc', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', marginBottom: 32 },
    ticketRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    ticketLabel: { fontSize: 15, color: '#64748b', fontWeight: '500' },
    ticketValue: { fontSize: 15, color: '#0f172a', fontWeight: '800' },

    biletBtn: { width: '100%', backgroundColor: '#0071c2', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
    biletBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    homeBtn: { width: '100%', backgroundColor: '#f1f5f9', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    homeBtnText: { color: '#475569', fontSize: 16, fontWeight: '800' },

    pdfContainer: { flex: 1, backgroundColor: '#f1f5f9' },
    pdfHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    pdfCloseText: { fontSize: 16, color: '#0071c2', fontWeight: '700' },
    pdfTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    
    pdfVoucher: { width: '100%', backgroundColor: '#fff', padding: 24, borderRadius: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    pdfAgency: { fontSize: 24, fontWeight: '900', color: '#0f172a', textAlign: 'center', letterSpacing: 1 },
    pdfDivider: { color: '#cbd5e1', textAlign: 'center', marginVertical: 16, letterSpacing: 2 },
    
    pdfQrSection: { alignItems: 'center', marginBottom: 8 },
    pdfQrSectionDual: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
    pdfQrWrapper: { alignItems: 'center' },
    pdfQrLabel: { fontSize: 10, fontWeight: '900', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
    pdfQrBox: { padding: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1 },
    
    pdfPnr: { textAlign: 'center', fontSize: 18, fontWeight: '900', color: '#0071c2', marginTop: 16, marginBottom: 4 },
    pdfAuthInfo: { textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: '600' },
    
    pdfLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
    pdfTourName: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 20 },
    pdfRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    pdfValue: { fontSize: 16, fontWeight: '800', color: '#334155' },

    pdfWarningBox: { flexDirection: 'row', backgroundColor: '#e0f2fe', padding: 12, borderRadius: 8, alignItems: 'center' },
    pdfWarningText: { fontSize: 12, color: '#0369a1', fontWeight: '700', marginLeft: 8, flex: 1 },
});
