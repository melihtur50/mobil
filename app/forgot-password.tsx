import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ScrollView, Alert } from 'react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');

    const handleSendCode = () => {
        if (!identifier) {
            Alert.alert('Hata', 'Lütfen e-posta veya telefon numaranızı girin.');
            return;
        }
        // Kod gönderme simülasyonu
        Alert.alert(
            'Kod Gönderildi',
            'Doğrulama kodu e-posta veya telefonunuza gönderilmiştir.',
            [{ text: 'Tamam', onPress: () => router.push('/verify-reset') }]
        );
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?q=80&w=1000' }} 
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
                                <Text style={styles.brandTitle}>Şifremi <Text style={styles.brandAccent}>Unuttum</Text></Text>
                                <Text style={styles.subtitle}>Şifrenizi sıfırlamak için kayıtlı e-posta veya telefonunuzu girin.</Text>
                            </View>

                            <View style={styles.formCard}>
                                <View style={styles.inputBox}>
                                    <FontAwesome name="envelope-o" size={18} color="#64748b" style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="E-posta veya Telefon"
                                        placeholderTextColor="#94a3b8"
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                    />
                                </View>

                                <TouchableOpacity style={styles.submitBtn} onPress={handleSendCode}>
                                    <Text style={styles.submitBtnText}>Doğrulama Kodu Gönder</Text>
                                </TouchableOpacity>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0, 53, 128, 0.75)' },
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { padding: 24, paddingTop: 40, flexGrow: 1, justifyContent: 'center' },
    header: { marginBottom: 40, alignItems: 'center', position: 'relative' },
    backBtn: { position: 'absolute', left: 0, top: 10, width: 40, height: 40, justifyContent: 'center' },
    brandTitle: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1, marginTop: 40 },
    brandAccent: { color: '#febb02' }, 
    subtitle: { fontSize: 14, color: '#f8fafc', fontWeight: '500', marginTop: 12, textAlign: 'center', paddingHorizontal: 20 },
    formCard: { backgroundColor: '#fff', borderRadius: 32, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, height: 56, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
    inputIcon: { width: 24, textAlign: 'center', marginRight: 8 },
    input: { flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '500' },
    submitBtn: { backgroundColor: '#0071c2', borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center' },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
