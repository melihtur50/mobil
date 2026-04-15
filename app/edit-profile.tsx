import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Header: Kişisel Bilgilerim & Geri Dön */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Kişisel Bilgilerim</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <FontAwesome name="angle-left" size={16} color="#64748b" style={{ marginRight: 6 }} />
                        <Text style={styles.backText}>Anasayfaya Dön</Text>
                    </TouchableOpacity>
                </View>

                {/* Profil Kartı (Avatar ve Aksiyonlar) */}
                <View style={styles.profileCard}>
                    <View style={styles.profileCardBlueBg} />
                    <View style={styles.profileCardWhiteBg}>
                        <View style={styles.avatarContainer}>
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' }} 
                                style={styles.avatarImage} 
                            />
                        </View>
                        
                        <TouchableOpacity style={styles.changePhotoBtn}>
                            <FontAwesome name="camera" size={12} color="#008cb3" />
                            <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
                        </TouchableOpacity>

                        <View style={styles.badgeContainer}>
                            <FontAwesome name="star" size={12} color="#ca8a04" style={{ marginRight: 6 }} />
                            <Text style={styles.badgeText}>Diamond Gezgin</Text>
                        </View>

                        <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/group-chat')}>
                            <View style={styles.chatLeft}>
                                <FontAwesome name="commenting-o" size={20} color="#fff" />
                                <Text style={styles.chatBtnText}>Aktif Tur Sohbetim</Text>
                            </View>
                            <View style={styles.chatBadge}>
                                <Text style={styles.chatBadgeText}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Kimlik Bilgileri Kartı */}
                <View style={styles.infoCard}>
                    <View style={styles.cardTitleRow}>
                        <FontAwesome name="user-o" size={16} color="#008cb3" />
                        <Text style={styles.cardTitleText}>Kimlik Bilgileri</Text>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputCol}>
                            <Text style={styles.inputLabel}>ADINIZ</Text>
                            <TextInput style={styles.inputField} value="Demo" placeholder="Adınız" />
                        </View>
                        <View style={styles.inputCol}>
                            <Text style={styles.inputLabel}>SOYADINIZ</Text>
                            <TextInput style={styles.inputField} value="Kullanıcı" placeholder="Soyadınız" />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputColFull}>
                            <Text style={styles.inputLabel}>E-POSTA ADRESİ</Text>
                            <TextInput 
                                style={[styles.inputField, styles.disabledInput]} 
                                value="demo@tourkia.com" 
                                editable={false} 
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputColFull}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8}}>
                                <Text style={[styles.inputLabel, { marginBottom: 0 }]}>TELEFON NUMARASI</Text>
                                <Text style={styles.emergencyLabel}>(Acil Ulaşım İçin)</Text>
                            </View>
                            <View style={styles.phoneInputContainer}>
                                <View style={styles.countryCode}>
                                    <Text style={styles.countryCodeText}>+90</Text>
                                </View>
                                <TextInput 
                                    style={styles.phoneInputField} 
                                    placeholder="5XX XXX XXXX"
                                    keyboardType="phone-pad"
                                    value="532 123 4567"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Seçenekler ve Tercihler Kartı */}
                <View style={styles.infoCard}>
                    <View style={styles.cardTitleRow}>
                        <FontAwesome name="sliders" size={16} color="#4f46e5" />
                        <Text style={styles.cardTitleText}>Seçenekler ve Tercihler</Text>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputCol}>
                            <Text style={styles.inputLabel}>VARSAYILAN PARA BİRİMİ</Text>
                            <TouchableOpacity style={styles.dropdownField}>
                                <Text style={styles.dropdownText}>€ Euro (EUR)</Text>
                                <FontAwesome name="angle-down" size={16} color="#64748b" />
                            </TouchableOpacity>
                            <Text style={styles.helperText}>Geçerli otel ve turlar bu kur baz alınarak hesaplanır.</Text>
                        </View>
                        <View style={styles.inputCol}>
                            <Text style={styles.inputLabel}>ARAYÜZ DİLİ</Text>
                            <TouchableOpacity style={styles.dropdownField}>
                                <Text style={styles.dropdownText}>TR Türkçe</Text>
                                <FontAwesome name="angle-down" size={16} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    scrollContent: { padding: 24 },
    header: { marginBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    backBtn: { flexDirection: 'row', alignItems: 'center' },
    backText: { fontSize: 13, fontWeight: '600', color: '#64748b' },

    profileCard: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    profileCardBlueBg: { height: 100, backgroundColor: '#4f4bfa' },
    profileCardWhiteBg: { backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24 },
    avatarContainer: { marginTop: -50, marginBottom: 16, width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', padding: 4, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    avatarImage: { width: '100%', height: '100%', borderRadius: 50, backgroundColor: '#e2e8f0' },
    changePhotoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginBottom: 16 },
    changePhotoText: { color: '#008cb3', fontSize: 12, fontWeight: '800', marginLeft: 8 },
    badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdfcbc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 24 },
    badgeText: { fontSize: 12, fontWeight: '800', color: '#52525b' },
    chatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#007aff', width: '100%', padding: 18, borderRadius: 16 },
    chatLeft: { flexDirection: 'row', alignItems: 'center' },
    chatBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 12 },
    chatBadge: { backgroundColor: '#ef4444', minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
    chatBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },

    infoCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    cardTitleText: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginLeft: 12 },
    inputRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    inputCol: { flex: 1 },
    inputColFull: { flex: 1 },
    inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
    inputField: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, fontSize: 15, fontWeight: '600', color: '#334155' },
    disabledInput: { backgroundColor: '#eff6ff', borderColor: '#dbeafe', color: '#475569' },
    emergencyLabel: { fontSize: 10, fontWeight: '800', color: '#ea580c' },
    phoneInputContainer: { flexDirection: 'row', alignItems: 'center' },
    countryCode: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0', borderRightWidth: 0, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, paddingVertical: 16, paddingHorizontal: 16, justifyContent: 'center' },
    countryCodeText: { fontSize: 15, fontWeight: '800', color: '#334155' },
    phoneInputField: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderTopRightRadius: 12, borderBottomRightRadius: 12, padding: 16, fontSize: 15, fontWeight: '600', color: '#334155' },
    
    dropdownField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16 },
    dropdownText: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
    helperText: { fontSize: 10, color: '#94a3b8', marginTop: 8, lineHeight: 14 }
});
