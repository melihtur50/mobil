import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (role: 'customer' | 'agency' = 'customer') => {
        // Oturum açma işlemleri buraya gelecek
        await login(role); // Test için butondan gelen rolü aktarıyoruz
        if (role === 'agency') {
            router.replace('/(tabs)/dashboard');
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1000' }} 
            style={styles.background}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Logo / Başlık Bölümü */}
                        <View style={styles.header}>
                            <Text style={styles.brandTitle}>Tour<Text style={styles.brandAccent}>kia</Text></Text>
                            <Text style={styles.subtitle}>Yeni maceralara yelken açmak için giriş yapın.</Text>
                        </View>

                        {/* Form Bölümü */}
                        <View style={styles.formCard}>
                            <Text style={styles.formTitle}>Hoş Geldiniz</Text>
                            
                            <View style={styles.inputBox}>
                                <FontAwesome name="envelope-o" size={18} color="#64748b" style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input}
                                    placeholder="E-posta Adresi"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.inputBox}>
                                <FontAwesome name="lock" size={22} color="#64748b" style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Şifre"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                                    <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginBtn} onPress={() => handleLogin('customer')}>
                                <Text style={styles.loginBtnText}>Müşteri Olarak Giriş</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#0f172a', marginTop: 12 }]} onPress={() => handleLogin('agency')}>
                                <Text style={styles.loginBtnText}>Acenta Olarak Giriş (Test)</Text>
                            </TouchableOpacity>

                            <View style={styles.dividerBox}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>VEYA</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity style={styles.socialBtn}>
                                <FontAwesome name="google" size={18} color="#ea4335" />
                                <Text style={styles.socialBtnText}>Google ile Devam Et</Text>
                            </TouchableOpacity>

                            <View style={styles.registerSection}>
                                <Text style={styles.footerText}>Hesabınız yok mu?</Text>
                                <TouchableOpacity style={styles.customerRegBtn} onPress={() => router.push('/register')}>
                                    <Text style={styles.customerRegText}>Müşteri Olarak Kaydol</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.agencyRegBtn} onPress={() => router.push('/register?type=agency')}>
                                    <Text style={styles.agencyRegText}>Acenta Olarak Kaydol</Text>
                                </TouchableOpacity>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0, 53, 128, 0.65)' }, // Booking stili koyu lacivert alfa
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'space-between', padding: 24, paddingBottom: 40 },
    
    header: { marginTop: 60, alignItems: 'center' },
    brandTitle: { fontSize: 44, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    brandAccent: { color: '#febb02' }, // Booking Booking Sarısı
    subtitle: { fontSize: 15, color: '#f8fafc', fontWeight: '500', marginTop: 12, textAlign: 'center', paddingHorizontal: 20 },
    
    formCard: { backgroundColor: '#fff', borderRadius: 32, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    formTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginBottom: 24, textAlign: 'center' },
    
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, height: 56, paddingHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    inputIcon: { width: 24, textAlign: 'center', marginRight: 8 },
    input: { flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '500' },
    
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
    forgotText: { color: '#0071c2', fontSize: 13, fontWeight: '700' },
    
    loginBtn: { backgroundColor: '#0071c2', borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#0071c2', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    
    dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
    dividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: '800', color: '#94a3b8' },
    
    socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 2, borderColor: '#f1f5f9', borderRadius: 16, height: 56 },
    socialBtnText: { fontSize: 15, fontWeight: '700', color: '#334155', marginLeft: 12 },
    
    registerSection: { alignItems: 'center', marginTop: 24, gap: 10 },
    footerText: { color: '#64748b', fontSize: 14, fontWeight: '500', marginBottom: 4 },
    customerRegBtn: { backgroundColor: '#febb02', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
    customerRegText: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
    agencyRegBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', alignItems: 'center' },
    agencyRegText: { color: '#64748b', fontSize: 14, fontWeight: '700' }
});
