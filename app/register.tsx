import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ScrollView } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        // Kayıt işlemleri buraya gelecek
        router.replace('/(tabs)');
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000' }} 
            style={styles.background}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                                    <FontAwesome name="angle-left" size={24} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.brandTitle}>Aramıza <Text style={styles.brandAccent}>Katıl</Text></Text>
                                <Text style={styles.subtitle}>Tourkia ile dünyayı keşfetmeye hazır mısınız?</Text>
                            </View>

                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>Hesap Oluştur</Text>
                                
                                <View style={styles.inputBox}>
                                    <FontAwesome name="user-o" size={18} color="#64748b" style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Ad Soyad"
                                        placeholderTextColor="#94a3b8"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

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
                                        placeholder="Şifre Oluştur"
                                        placeholderTextColor="#94a3b8"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>

                                <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
                                    <Text style={styles.loginBtnText}>Kayıt Ol</Text>
                                </TouchableOpacity>

                                <View style={styles.footerRow}>
                                    <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
                                    <TouchableOpacity onPress={() => router.push('/login')}>
                                        <Text style={styles.loginText}>Giriş Yapın</Text>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0, 53, 128, 0.7)' },
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { padding: 24, paddingTop: 40, paddingBottom: 60, flexGrow: 1, justifyContent: 'center' },
    
    header: { marginBottom: 40, alignItems: 'center', position: 'relative' },
    backBtn: { position: 'absolute', left: 0, top: 10, width: 40, height: 40, justifyContent: 'center' },
    brandTitle: { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1, marginTop: 40 },
    brandAccent: { color: '#febb02' }, 
    subtitle: { fontSize: 15, color: '#f8fafc', fontWeight: '500', marginTop: 12, textAlign: 'center', paddingHorizontal: 20 },
    
    formCard: { backgroundColor: '#fff', borderRadius: 32, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    formTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginBottom: 24, textAlign: 'center' },
    
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, height: 56, paddingHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    inputIcon: { width: 24, textAlign: 'center', marginRight: 8 },
    input: { flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '500' },
    
    loginBtn: { backgroundColor: '#0071c2', borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#0071c2', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6, marginTop: 8 },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    
    footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#64748b', fontSize: 14, fontWeight: '500' },
    loginText: { color: '#febb02', fontSize: 14, fontWeight: '800' }
});
