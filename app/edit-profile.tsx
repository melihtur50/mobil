import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>KURUMSAL PROFİL</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.cardContainer}>
                    
                    {/* Üst Kısım: Logo ve Başlık */}
                    <View style={styles.profileHeader}>
                        <TouchableOpacity style={styles.logoUploadBox}>
                            <FontAwesome name="camera" size={20} color="#94a3b8" style={{ marginBottom: 4 }} />
                            <Text style={styles.logoUploadText}>Logo Yükle</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.profileHeaderInfo}>
                            <Text style={styles.agencyName}>Tourkia Acentası (Premium)</Text>
                            <Text style={styles.b2bId}>B2B ID: #AGT-902144</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Form Alanı */}
                    <View style={styles.formContainer}>
                        
                        <Text style={styles.inputLabel}>FİRMA / ACENTA ÜNVANI</Text>
                        <View style={styles.disabledInputContainer}>
                            <TextInput 
                                style={styles.disabledInput} 
                                value="Tourkia Seyahat Acentası Bilişim Tic. Ltd. Şti."
                                editable={false}
                            />
                        </View>

                        <Text style={styles.inputLabel}>TÜRSAB BELGE NO</Text>
                        <View style={styles.verifiedInputContainer}>
                            <TextInput 
                                style={styles.verifiedInput} 
                                value="14552"
                                editable={false}
                            />
                        </View>
                        <View style={styles.verifiedTextRow}>
                            <FontAwesome name="check" size={10} color="#059669" style={{ marginRight: 4 }} />
                            <Text style={styles.verifiedText}>Elektronik olarak doğrulandı</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.column, { marginRight: 12 }]}>
                                <Text style={styles.inputLabel}>VERGİ DAİRESİ</Text>
                                <View style={styles.standardInputContainer}>
                                    <TextInput 
                                        style={styles.standardInput} 
                                        defaultValue="Marmara Kurumlar V.D."
                                    />
                                </View>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.inputLabel}>VERGİ KİMLİK NO (VKN)</Text>
                                <View style={styles.standardInputContainer}>
                                    <TextInput 
                                        style={styles.standardInput} 
                                        defaultValue="5551234567"
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>İRTİBAT E-POSTA ADRESİ</Text>
                        <View style={styles.standardInputContainer}>
                            <TextInput 
                                style={styles.standardInput} 
                                defaultValue="iletisim@tourkia.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.submitBtn}>
                            <Text style={styles.submitBtnText}>Bilgilerimi Güncelle</Text>
                        </TouchableOpacity>
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
    
    scrollContent: { padding: 20, paddingBottom: 60 },

    cardContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, borderWidth: 1, borderColor: '#f1f5f9' },
    
    profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoUploadBox: { width: 72, height: 72, borderRadius: 16, borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'dashed', backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    logoUploadText: { fontSize: 9, fontWeight: '700', color: '#94a3b8' },
    profileHeaderInfo: { flex: 1 },
    agencyName: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    b2bId: { fontSize: 13, fontWeight: '600', color: '#64748b' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 24 },

    formContainer: { marginBottom: 12 },
    
    inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
    
    disabledInputContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, height: 50, justifyContent: 'center', marginBottom: 20 },
    disabledInput: { paddingHorizontal: 16, fontSize: 14, color: '#475569', fontWeight: '500' },

    verifiedInputContainer: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', borderRadius: 12, height: 50, justifyContent: 'center', marginBottom: 6 },
    verifiedInput: { paddingHorizontal: 16, fontSize: 16, color: '#059669', fontWeight: '800' },
    verifiedTextRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginLeft: 4 },
    verifiedText: { fontSize: 11, fontWeight: '800', color: '#059669' },

    row: { flexDirection: 'row', marginBottom: 20 },
    column: { flex: 1 },
    
    standardInputContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, height: 50, justifyContent: 'center', marginBottom: 20 },
    standardInput: { flex: 1, paddingHorizontal: 16, fontSize: 14, color: '#0f172a', fontWeight: '500' },

    cardFooter: { marginTop: 8 },
    submitBtn: { backgroundColor: '#0f172a', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' }
});
