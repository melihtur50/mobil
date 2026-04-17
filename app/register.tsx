import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, ScrollView, Alert, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const params = useLocalSearchParams();
    const isAgency = params.type === 'agency';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agencyName, setAgencyName] = useState('');
    const [tursabNo, setTursabNo] = useState('');
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [taxUploaded, setTaxUploaded] = useState(false);
    const [tursabUploaded, setTursabUploaded] = useState(false);

    const handleRegister = async () => {
        // İlk aşama kayıt işlemleri eklenebilir
        if (isAgency) {
            // Uyarı ve upload modalını aç
            setShowDocumentModal(true);
        } else {
            await login('customer');
            router.replace('/(tabs)');
        }
    };

    const handleDocumentSubmit = async () => {
        if (!taxUploaded || !tursabUploaded) {
            Alert.alert('Eksik Belge', 'Lütfen Vergi Levhası ve TÜRSAB belgenizi yükleyiniz.');
            return;
        }

        await login('agency');

        setShowDocumentModal(false);
        Alert.alert(
            'Kayıt Tamamlandı',
            'Evraklarınız yüklenmiştir. 1 iş günü içerisinde incelenecektir, kayıt için teşekkürler!',
            [
                { text: 'Siteye Gir', onPress: () => router.replace('/(tabs)/dashboard') }
            ]
        );
    };

    const handleFileUpload = (type: 'tax' | 'tursab') => {
        Alert.alert(
            'Dosya Yükleme',
            'Nasıl yüklemek istersiniz?',
            [
                {
                    text: 'Galeriden (Fotoğraf)',
                    onPress: async () => {
                        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (permissionResult.granted === false) {
                            Alert.alert('İzin Reddedildi', 'Fotoğraflara erişim izni gereklidir.');
                            return;
                        }
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: false,
                            quality: 1,
                        });
                        if (!result.canceled) {
                            if (type === 'tax') setTaxUploaded(true);
                            if (type === 'tursab') setTursabUploaded(true);
                        }
                    }
                },
                {
                    text: 'Dosyalardan (Belge)',
                    onPress: async () => {
                        let result = await DocumentPicker.getDocumentAsync({});
                        if (!result.canceled) {
                            if (type === 'tax') setTaxUploaded(true);
                            if (type === 'tursab') setTursabUploaded(true);
                        }
                    }
                },
                { text: 'İptal', style: 'cancel' }
            ]
        );
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
                                <Text style={styles.formTitle}>{isAgency ? 'Acenta Hesabı Oluştur' : 'Müşteri Hesabı Oluştur'}</Text>
                                
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
                                    <FontAwesome name="phone" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Telefon Numarası"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="phone-pad"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </View>

                                {isAgency ? (
                                    <>
                                        <View style={styles.inputBox}>
                                            <FontAwesome name="building-o" size={18} color="#64748b" style={styles.inputIcon} />
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="Acenta Adı"
                                                placeholderTextColor="#94a3b8"
                                                value={agencyName}
                                                onChangeText={setAgencyName}
                                            />
                                        </View>

                                        <View style={styles.inputBox}>
                                            <FontAwesome name="id-card-o" size={18} color="#64748b" style={styles.inputIcon} />
                                            <TextInput 
                                                style={styles.input}
                                                placeholder="TÜRSAB No"
                                                placeholderTextColor="#94a3b8"
                                                keyboardType="numeric"
                                                value={tursabNo}
                                                onChangeText={setTursabNo}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.inputBox}>
                                        <FontAwesome name="lock" size={22} color="#64748b" style={styles.inputIcon} />
                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Şifre Oluştur"
                                            placeholderTextColor="#94a3b8"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                                            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color="#94a3b8" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
                                    <Text style={styles.loginBtnText}>{isAgency ? 'Acenta Olarak Kayıt Ol' : 'Müşteri Olarak Kayıt Ol'}</Text>
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

            {/* Acenta Evrak Yükleme Modalı */}
            <Modal
                visible={showDocumentModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDocumentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <FontAwesome name="warning" size={40} color="#febb02" style={{ marginBottom: 16 }} />
                        <Text style={styles.modalTitle}>Son Bir Adım!</Text>
                        <Text style={styles.modalDesc}>Turlarının yayınlanması için Vergi Levhanı ve TÜRSAB belgeni sisteme yüklemen gerekiyor.</Text>
                        
                        <TouchableOpacity 
                            style={[styles.uploadBtn, taxUploaded && styles.uploadBtnSuccess]} 
                            onPress={() => handleFileUpload('tax')}
                        >
                            <FontAwesome name={taxUploaded ? "check-circle" : "cloud-upload"} size={20} color={taxUploaded ? "#0d652d" : "#0071c2"} />
                            <Text style={[styles.uploadBtnText, taxUploaded && styles.uploadBtnTextSuccess]}>
                                {taxUploaded ? "Vergi Levhası Yüklendi" : "Vergi Levhası Yükle"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.uploadBtn, tursabUploaded && styles.uploadBtnSuccess]} 
                            onPress={() => handleFileUpload('tursab')}
                        >
                            <FontAwesome name={tursabUploaded ? "check-circle" : "cloud-upload"} size={20} color={tursabUploaded ? "#0d652d" : "#0071c2"} />
                            <Text style={[styles.uploadBtnText, tursabUploaded && styles.uploadBtnTextSuccess]}>
                                {tursabUploaded ? "TÜRSAB Belgesi Yüklendi" : "TÜRSAB Belgesi Yükle"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleDocumentSubmit}>
                            <Text style={styles.modalSubmitBtnText}>Belgeleri Gönder ve Kaydol</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    loginText: { color: '#febb02', fontSize: 14, fontWeight: '800' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
    modalDesc: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', borderRadius: 12, width: '100%', paddingVertical: 14, marginBottom: 12 },
    uploadBtnSuccess: { backgroundColor: '#e2f4ea', borderColor: '#bce3cf' },
    uploadBtnText: { marginLeft: 10, fontSize: 15, fontWeight: '700', color: '#0071c2' },
    uploadBtnTextSuccess: { color: '#0d652d' },
    modalSubmitBtn: { backgroundColor: '#febb02', width: '100%', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
    modalSubmitBtnText: { color: '#0f172a', fontSize: 16, fontWeight: '900' }
});
