import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { makeQuickSale } from '../services/tourApi';

export default function QuickBookScreen() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [tourAvails] = useState([
      { date: '2026-04-18', isClosed: false, capacity: 5 },
      { date: '2026-04-19', isClosed: true, capacity: 0 },
      { date: '2026-04-20', isClosed: false, capacity: 2 },
      { date: '2026-04-21', isClosed: false, capacity: 14 }
    ]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>HIZLI TUR SATIŞI</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.cardContainer}>
                    
                    {/* Üst Lacivert Kısım (Header) */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>B2B Hızlı Satış Ekranı</Text>
                        <Text style={styles.cardSubtitle}>
                            Müşteriniz yanındayken saniyeler içinde tur satışını gerçekleştirin ve PDF Voucher oluşturun.
                        </Text>
                    </View>

                    {/* Form Alanı */}
                    <View style={styles.cardBody}>
                        
                        {/* TUR DETAYLARI Bölümü */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>TUR DETAYLARI</Text>
                            
                            <Text style={styles.inputLabel}>Tur Seçimi <Text style={styles.asterisk}>*</Text></Text>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.inputValue}>Standart Balon</Text>
                                <FontAwesome name="chevron-down" size={12} color="#64748b" />
                            </TouchableOpacity>

                            <Text style={styles.inputLabel}>Tarih <Text style={styles.asterisk}>*</Text></Text>
                            <AvailabilityCalendar 
                                availabilities={tourAvails}
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                            />

                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.inputLabel}>Kişi Sayısı <Text style={styles.asterisk}>*</Text></Text>
                                    <View style={styles.standardInputContainer}>
                                        <TextInput 
                                            style={styles.standardInput} 
                                            defaultValue="1"
                                            keyboardType="number-pad"
                                            textAlign="center"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* MÜŞTERİ BİLGİLERİ Bölümü */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>MÜŞTERİ BİLGİLERİ</Text>

                            <Text style={styles.inputLabel}>Ad Soyad (Misafir 1) <Text style={styles.asterisk}>*</Text></Text>
                            <View style={styles.standardInputContainer}>
                                <TextInput 
                                    style={styles.standardInput} 
                                    placeholder="Örn: Ahmet Yılmaz"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <Text style={styles.inputLabel}>İletişim Numarası <Text style={styles.asterisk}>*</Text></Text>
                            <View style={styles.standardInputContainer}>
                                <TextInput 
                                    style={styles.standardInput} 
                                    placeholder="+90 555 555 55 55"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Alt Kısım: Fiyat ve Buton */}
                        <View style={styles.footerSection}>
                            
                            {/* Fiyat Kutusu (Yeşil Box) */}
                            <View style={styles.priceBox}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.priceLabel}>NET ACENTA FİYATI</Text>
                                    <Text style={styles.netPrice}>₺2.400</Text>
                                </View>
                                <View style={styles.priceDivider} />
                                <View style={{ flex: 1, paddingLeft: 12 }}>
                                    <Text style={[styles.priceLabel, { color: '#059669' }]}>KAZANILACAK HAKEDİŞ</Text>
                                    <Text style={styles.earningPrice}>+₺240</Text>
                                </View>
                            </View>

                            {/* Tamamla Butonu */}
                            <TouchableOpacity 
                                style={styles.submitBtn} 
                                onPress={() => {
                                    makeQuickSale('1', 1, selectedDate || '2026-04-18');
                                    alert('Satış Başarılı! Tur stokları gerçek zamanlı güncellendi.');
                                    router.back();
                                }}
                            >
                                <Text style={styles.submitBtnText}>Rezervasyonu Tamamla & Voucher Kes</Text>
                            </TouchableOpacity>
                            
                        </View>

                    </View>
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
    
    scrollContent: { padding: 20, paddingBottom: 80 },

    cardContainer: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8, borderWidth: 1, borderColor: '#f1f5f9' },
    
    cardHeader: { backgroundColor: '#0f172a', padding: 24, paddingBottom: 28 },
    cardTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 8 },
    cardSubtitle: { fontSize: 13, color: '#94a3b8', lineHeight: 20 },

    cardBody: { padding: 24, backgroundColor: '#fff' },
    
    section: { marginBottom: 8 },
    sectionHeader: { fontSize: 13, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5, marginBottom: 16 },
    
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 8 },
    asterisk: { color: '#ef4444' },
    
    dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 16, backgroundColor: '#f8fafc' },
    inputValue: { fontSize: 15, color: '#0f172a', fontWeight: '500' },
    
    row: { flexDirection: 'row', marginBottom: 16 },
    column: { flex: 1 },
    
    dateInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, height: 48, backgroundColor: '#f8fafc' },
    placeholderText: { fontSize: 15, color: '#0f172a', fontWeight: '500' },
    
    standardInputContainer: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, height: 48, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 16 },
    standardInput: { flex: 1, paddingHorizontal: 16, fontSize: 15, color: '#0f172a', fontWeight: '500' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 24 },

    footerSection: { marginTop: 12 },
    
    priceBox: { flexDirection: 'row', backgroundColor: '#ecfdf5', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#d1fae5' },
    priceDivider: { width: 1, backgroundColor: '#d1fae5', marginVertical: 4 },
    priceLabel: { fontSize: 10, fontWeight: '800', color: '#10b981', marginBottom: 4 },
    netPrice: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    earningPrice: { fontSize: 24, fontWeight: '900', color: '#059669' },

    submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
