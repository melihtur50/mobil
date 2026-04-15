import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BlogScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>İÇERİK YÖNETİMİ</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Üst Bilgi Başlığı ve Taslak Butonu */}
                <View style={styles.pageHeader}>
                    <View style={styles.titleRow}>
                        <Ionicons name="folder-open-outline" size={24} color="#6366f1" />
                        <Text style={styles.pageTitle}>Yazı Yöneticisi (CMS)</Text>
                    </View>
                    <Text style={styles.pageSubtitle}>SEO odaklı yeni bir makale veya rehber oluşturun.</Text>
                    
                    <TouchableOpacity style={styles.newDraftBtn}>
                        <FontAwesome name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.newDraftBtnText}>Yeni Yazı Taslağı</Text>
                    </TouchableOpacity>
                </View>

                {/* Ana İçerik Formu */}
                <View style={styles.mainFormCard}>
                    
                    {/* Başlık Alanı */}
                    <Text style={styles.inputLabel}>BAŞLIK</Text>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            placeholder="Örn: 2026 Yazının En Gözde 5 Tatil Rotası"
                            placeholderTextColor="#cbd5e1"
                        />
                    </View>

                    {/* İçerik Markdown Alanı */}
                    <View style={styles.contentHeaderRow}>
                        <Text style={styles.inputLabel}>İÇERİK (MARKDOWN DESTEKLİ)</Text>
                        <TouchableOpacity>
                            <Text style={styles.addMediaText}>+ GÖRSEL / MEDYA EKLE</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.textAreaContainer}>
                        <TextInput 
                            style={styles.textAreaInput}
                            placeholder={'## Giriş Yazınıza buradan başlayın. Kalın yapmak için **yazı**, link için [Link Text](url) kullanabilirsiniz.'}
                            placeholderTextColor="#94a3b8"
                            multiline={true}
                            textAlignVertical="top"
                        />
                    </View>

                </View>

                {/* Sağ Taraf - SEO Verileri Paneli (Mobilde Alt Alta) */}
                <View style={styles.seoPanel}>
                    <View style={styles.seoTitleRow}>
                        <Ionicons name="search" size={18} color="#10b981" />
                        <Text style={styles.seoTitle}>SEO Verileri</Text>
                    </View>

                    <Text style={styles.seoLabel}>KATEGORİ</Text>
                    <TouchableOpacity style={styles.dropdownInput}>
                        <Text style={styles.dropdownValue}>Rehberler</Text>
                        <FontAwesome name="chevron-down" size={12} color="#64748b" />
                    </TouchableOpacity>

                    <Text style={styles.seoLabel}>MÜŞTERİ YÖNLENDİRME (CTA) TÜRÜ</Text>
                    <TouchableOpacity style={styles.dropdownInput}>
                        <Text style={styles.dropdownValue}>Hiçbiri</Text>
                        <FontAwesome name="chevron-down" size={12} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={styles.seoHelperText}>Yazının sonuna 'Hemen İncele' butonu koyar.</Text>

                    {/* Yayımla Butonu */}
                    <TouchableOpacity style={styles.publishBtn}>
                        <Text style={styles.publishBtnText}>Yazıyı Yayımla 🚀</Text>
                    </TouchableOpacity>
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

    pageHeader: { marginBottom: 24 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    pageTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginLeft: 10 },
    pageSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '500', marginBottom: 16 },
    
    newDraftBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    newDraftBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

    mainFormCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 20 },
    
    inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 8 },
    inputContainer: { backgroundColor: '#f8fafc', borderRadius: 12, height: 50, justifyContent: 'center', marginBottom: 24 },
    textInput: { flex: 1, paddingHorizontal: 16, fontSize: 15, color: '#0f172a', fontWeight: '600' },

    contentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    addMediaText: { fontSize: 11, fontWeight: '800', color: '#6366f1' },
    
    textAreaContainer: { borderWidth: 1, borderColor: '#c7d2fe', borderRadius: 12, height: 200, backgroundColor: '#fff', padding: 16 },
    textAreaInput: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 22 },

    seoPanel: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
    seoTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    seoTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginLeft: 8 },

    seoLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 6 },
    dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 16, height: 44, marginBottom: 16 },
    dropdownValue: { fontSize: 14, color: '#0f172a', fontWeight: '600' },
    seoHelperText: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: -10, marginBottom: 24, marginLeft: 4 },

    publishBtn: { backgroundColor: '#0f172a', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    publishBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' }
});
