import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ScrollView, Alert, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AgencyAuthScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const params = useLocalSearchParams();
    
    const [activeTab, setActiveTab] = useState<'login' | 'register' | 'premium'>((params.tab as any) || 'login');
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        if (params.tab) {
            setActiveTab(params.tab as any);
        }
    }, [params.tab]);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Register states
    const [agencyName, setAgencyName] = useState('');
    const [name, setName] = useState('');
    const [tursabNo, setTursabNo] = useState('');
    
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
            return;
        }
        await login('agency');
        router.replace('/(tabs)/dashboard');
    };

    const handleRegister = () => {
        if (!agencyName || !email || !password) {
            Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
            return;
        }
        setIsRegistered(true);
        setActiveTab('premium');
    };

    const handleClose = async () => {
        if (isRegistered) {
            // Eğer kayıt olduysa ve premium ekranından X'e basıyorsa
            await login('agency');
            router.replace('/(tabs)/dashboard');
        } else {
            router.back();
        }
    };

    const handleContinueWithoutPremium = async () => {
        await login('agency');
        router.replace('/(tabs)/dashboard');
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1454391304352-2bf4678b195a?q=80&w=1000' }} 
            style={styles.background}
            blurRadius={3}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            
                            <View style={styles.modalCard}>
                                {/* Header (Orange) */}
                                <View style={styles.headerBox}>
                                    <View style={styles.headerTextBox}>
                                        <Text style={styles.headerTitle}>Turlarınızı Dünyayla{'\n'}Buluşturun!</Text>
                                        <Text style={styles.headerSubtitle}>Tourkia İş Ortaklığı Yönetim Paneli</Text>
                                    </View>
                                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                                        <FontAwesome name="times" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {/* Tabs */}
                                <View style={styles.tabContainer}>
                                    <TouchableOpacity style={[styles.tabBtn, activeTab === 'login' && styles.tabBtnActive]} onPress={() => setActiveTab('login')}>
                                        <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>Giriş Yap</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.tabBtn, activeTab === 'register' && styles.tabBtnActive]} onPress={() => setActiveTab('register')}>
                                        <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>Kayıt Ol</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.tabBtn, activeTab === 'premium' && styles.tabBtnActive]} onPress={() => setActiveTab('premium')}>
                                        <Text style={[styles.tabTextPremium, activeTab === 'premium' && styles.tabTextActivePremium]}>
                                            <FontAwesome name="bolt" size={12} color={activeTab === 'premium' ? "#6366f1" : "#8b5cf6"} /> Premium
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Content */}
                                <View style={styles.contentBox}>
                                    {isRegistered && activeTab === 'premium' && (
                                        <View style={styles.successMessage}>
                                            <FontAwesome name="check-circle" size={20} color="#10b981" />
                                            <Text style={styles.successText}>Kaydınız başarıyla tamamlandı. Aşağıdan premium avantajlarımızı inceleyebilirsiniz.</Text>
                                        </View>
                                    )}

                                    {activeTab === 'login' && (
                                        <View style={styles.formContainer}>
                                            <Text style={styles.inputLabel}>KURUMSAL E-POSTA</Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="iletisim@firmaniz.com"
                                                placeholderTextColor="#94a3b8"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                            />

                                            <View style={styles.labelRow}>
                                                <Text style={styles.inputLabel}>ŞİFRE</Text>
                                                <Text style={styles.forgotText}>Şifremi Unuttum?</Text>
                                            </View>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry
                                                value={password}
                                                onChangeText={setPassword}
                                            />

                                            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
                                                <Text style={styles.submitBtnText}>Yönetim Paneline Gir</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {activeTab === 'register' && (
                                        <View style={styles.formContainer}>
                                            <Text style={styles.inputLabel}>
                                                {params.type === 'restaurant' ? 'RESTORAN / KAFE ADI' : params.type === 'premium' ? 'PREMIUM İŞLETME ADI' : 'ACENTA ADI'}
                                            </Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder={params.type === 'restaurant' ? "İşletme adınızı girin" : "Firma adınızı girin"}
                                                placeholderTextColor="#94a3b8"
                                                value={agencyName}
                                                onChangeText={setAgencyName}
                                            />

                                            <Text style={styles.inputLabel}>YETKİLİ AD SOYAD</Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="Adınız ve soyadınız"
                                                placeholderTextColor="#94a3b8"
                                                value={name}
                                                onChangeText={setName}
                                            />

                                            <Text style={styles.inputLabel}>
                                                {params.type === 'restaurant' ? 'VERGİ LEVHASI / RUHSAT NO' : 'TÜRSAB NO'} (Zorunlu)
                                            </Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder={params.type === 'restaurant' ? "Ruhsat veya vergi no girin" : "Belge Numaranız"}
                                                placeholderTextColor="#94a3b8"
                                                value={tursabNo}
                                                onChangeText={setTursabNo}
                                            />

                                            <Text style={styles.inputLabel}>KURUMSAL E-POSTA</Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="iletisim@firmaniz.com"
                                                placeholderTextColor="#94a3b8"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                            />

                                            <Text style={styles.inputLabel}>ŞİFRE</Text>
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry
                                                value={password}
                                                onChangeText={setPassword}
                                            />

                                            <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
                                                <Text style={styles.submitBtnText}>
                                                    {params.type === 'restaurant' ? 'İşletmeyi Kaydet' : 'Acentayı Kaydet'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {activeTab === 'premium' && (
                                        <View style={styles.premiumContainer}>
                                            <Text style={styles.premiumBadge}>ÖZEL ACENTA FIRSATI</Text>
                                            <Text style={styles.premiumTitle}>Müşterilerinize Üst Sıralardan Ulaşın</Text>
                                            <Text style={styles.premiumDesc}>VIP Partner Aboneliği ile turlarınızı aramalarda en öne çıkararak satışlarınızı %300'e kadar artırın.</Text>

                                            <TouchableOpacity style={styles.pricingCard}>
                                                <View style={styles.pricingHeader}>
                                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                                        <FontAwesome name="calendar-o" size={16} color="#6366f1" style={{marginRight:8}} />
                                                        <Text style={styles.pricingName}>Aylık Abonelik</Text>
                                                    </View>
                                                    <View style={{alignItems:'flex-end'}}>
                                                        <Text style={styles.pricingPrice}>₺1.490 <Text style={styles.pricingDuration}>/ay</Text></Text>
                                                    </View>
                                                </View>
                                                <View style={styles.featureList}>
                                                    <Text style={styles.featureItem}><FontAwesome name="check" color="#10b981" /> Sınırsız Tur Ekleme</Text>
                                                    <Text style={styles.featureItem}><FontAwesome name="check" color="#10b981" /> "Sponsorlu VIP" Etiketi <Text style={styles.badgeHighlight}>ETKİLİ</Text></Text>
                                                    <Text style={styles.featureItem}><FontAwesome name="check" color="#10b981" /> Aramalarda Üst Sıraya Çıkma</Text>
                                                </View>
                                                <TouchableOpacity style={styles.buyBtnOutline}>
                                                    <Text style={styles.buyBtnOutlineText}>Aylık Başla</Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>

                                            <View style={styles.popularBadgeWrapper}>
                                                <Text style={styles.popularBadgeText}><FontAwesome name="shield" /> EN POPÜLER SEÇİM</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.pricingCard, styles.pricingCardActive]}>
                                                <View style={styles.pricingHeader}>
                                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                                        <FontAwesome name="calendar" size={16} color="#4f46e5" style={{marginRight:8}} />
                                                        <Text style={styles.pricingNameActive}>Yıllık Abonelik</Text>
                                                    </View>
                                                    <View style={{alignItems:'flex-end'}}>
                                                        <Text style={styles.pricingPriceActive}>₺11.900</Text>
                                                        <Text style={styles.pricingOldPrice}>Normalde ₺17.880</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            {isRegistered && (
                                                <TouchableOpacity style={styles.skipBtn} onPress={handleContinueWithoutPremium}>
                                                    <Text style={styles.skipBtnText}>Teşekkürler, Normal Acenta Olarak Devam Et</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center' },
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { padding: 20, flexGrow: 1, justifyContent: 'center' },
    
    modalCard: { backgroundColor: '#fdfdfd', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 15 },
    
    headerBox: { backgroundColor: '#f97316', padding: 24, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTextBox: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 30 },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: '500' },
    closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    
    tabContainer: { flexDirection: 'row', backgroundColor: '#fff', marginTop: -15, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
    tabBtn: { flex: 1, paddingVertical: 18, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
    tabBtnActive: { borderColor: '#f97316' },
    tabText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
    tabTextActive: { color: '#0f172a' },
    tabTextPremium: { fontSize: 13, fontWeight: '800', color: '#8b5cf6' },
    tabTextActivePremium: { color: '#6366f1' },

    contentBox: { padding: 24, backgroundColor: '#fdfdfd' },
    
    successMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#d1fae5' },
    successText: { color: '#0d9488', fontSize: 13, fontWeight: '600', marginLeft: 8, flex: 1 },

    formContainer: {},
    inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    forgotText: { fontSize: 12, fontWeight: '700', color: '#ea580c', marginBottom: 8 },
    input: { backgroundColor: '#f1f5f9', borderRadius: 12, height: 52, paddingHorizontal: 16, fontSize: 15, color: '#0f172a', fontWeight: '500', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    
    submitBtn: { backgroundColor: '#f97316', borderRadius: 14, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: '#f97316', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    premiumContainer: { alignItems: 'center' },
    premiumBadge: { color: '#6366f1', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
    premiumTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 8 },
    premiumDesc: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 20, paddingHorizontal: 10 },
    
    pricingCard: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 16, marginBottom: 16 },
    pricingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    pricingName: { fontSize: 15, fontWeight: '800', color: '#334155' },
    pricingPrice: { fontSize: 18, fontWeight: '900', color: '#4f46e5' },
    pricingDuration: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
    featureList: { gap: 8, marginBottom: 16 },
    featureItem: { fontSize: 13, fontWeight: '600', color: '#475569' },
    badgeHighlight: { backgroundColor: '#fef08a', color: '#ca8a04', fontSize: 10, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    buyBtnOutline: { borderWidth: 1, borderColor: '#e0e7ff', paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#fff' },
    buyBtnOutlineText: { color: '#6366f1', fontSize: 14, fontWeight: '800' },

    popularBadgeWrapper: { backgroundColor: '#6366f1', paddingHorizontal: 16, paddingVertical: 6, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: -10, zIndex: 2 },
    popularBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    pricingCardActive: { borderColor: '#818cf8', backgroundColor: '#eef2ff', borderWidth: 2, paddingTop: 20 },
    pricingNameActive: { fontSize: 15, fontWeight: '800', color: '#1e1b4b' },
    pricingPriceActive: { fontSize: 20, fontWeight: '900', color: '#3730a3' },
    pricingOldPrice: { fontSize: 11, fontWeight: '600', color: '#94a3b8', textDecorationLine: 'line-through' },
    
    skipBtn: { marginTop: 12, paddingVertical: 12 },
    skipBtnText: { color: '#64748b', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' }
});
