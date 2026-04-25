import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { CoffeeService } from '../services/coffeeService';
import { LinearGradient } from 'expo-linear-gradient';

export default function CoffeeRewardScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [rewardQr, setRewardQr] = useState<string | null>(null);
    const [isClaimed, setIsClaimed] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const claimed = await CoffeeService.isClaimed();
            setIsClaimed(claimed);
            if (claimed) {
                const qr = await CoffeeService.getQrCode();
                setRewardQr(qr);
            }
        };
        checkStatus();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleVerify = () => {
        if (!image) {
            Alert.alert('Hata', 'Lütfen inceleme ekran görüntüsünü yükleyin.');
            return;
        }

        setIsVerifying(true);
        // AI Verification Simulation
        setTimeout(async () => {
            const qr = await CoffeeService.claimReward();
            setRewardQr(qr);
            setIsClaimed(true);
            setIsVerifying(false);
            Alert.alert('Tebrikler! 🎉', 'Yorumun onaylandı. Ücretsiz kahve kodun oluşturuldu.');
        }, 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>HEDİYE KAHVE</Text>
                <View style={{width: 40}} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!isClaimed ? (
                    <>
                        <View style={styles.heroSection}>
                            <View style={styles.coffeeIconBox}>
                                <FontAwesome name="coffee" size={40} color="#6366f1" />
                            </View>
                            <Text style={styles.title}>Dönüş Yolunda{'\n'}Kahven Bizden! ☕</Text>
                            <Text style={styles.subtitle}>
                                Tourkia deneyimini 5 yıldızla taçlandır, Kapadokya veya İstanbul Havalimanı'nda kahveni ücretsiz yudumla.
                            </Text>
                        </View>

                        <View style={styles.stepsCard}>
                            <Text style={styles.stepsTitle}>Hemen Kazan:</Text>
                            <View style={styles.step}>
                                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                                <Text style={styles.stepText}>TripAdvisor veya App Store'da 5 yıldızlı yorum yap.</Text>
                            </View>
                            <View style={styles.step}>
                                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                                <Text style={styles.stepText}>Yorumun ekran görüntüsünü al.</Text>
                            </View>
                            <View style={styles.step}>
                                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                                <Text style={styles.stepText}>Aşağıdaki alana yükle ve anında QR kodunu al!</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <MaterialIcons name="add-a-photo" size={32} color="#94a3b8" />
                                    <Text style={styles.uploadText}>Ekran Görüntüsü Yükle</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.verifyBtn, !image && styles.verifyBtnDisabled]} 
                            onPress={handleVerify}
                            disabled={isVerifying || !image}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.verifyBtnText}>Yorumu Onayla ve Kahveni Al</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.rewardCard}>
                            <Text style={styles.rewardTitle}>Ücretsiz Kahve Kuponun</Text>
                            <View style={styles.qrWrapper}>
                                <QRCode value={rewardQr || 'COFFEE'} size={180} backgroundColor="white" />
                            </View>
                            <Text style={styles.qrCodeText}>{rewardQr}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.rewardInfo}>
                                Bu kodu havalimanındaki anlaşmalı kafelere göstererek kahveni alabilirsin.
                            </Text>
                        </LinearGradient>

                        <Text style={styles.partnerTitle}>Anlaşmalı Kafeler:</Text>
                        {CoffeeService.getPartnerCafes().map(cafe => (
                            <View key={cafe.id} style={styles.cafeCard}>
                                <FontAwesome name="map-marker" size={16} color="#6366f1" />
                                <View style={styles.cafeInfo}>
                                    <Text style={styles.cafeName}>{cafe.name}</Text>
                                    <Text style={styles.cafeLoc}>{cafe.location}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff' },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a', letterSpacing: 1 },
    scrollContent: { padding: 24 },
    
    heroSection: { alignItems: 'center', marginBottom: 32 },
    coffeeIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 12 },
    subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },

    stepsCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 32, borderWidth: 1, borderColor: '#e2e8f0' },
    stepsTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
    step: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'center' },
    stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center' },
    stepNumText: { color: '#fff', fontSize: 12, fontWeight: '900' },
    stepText: { fontSize: 14, color: '#475569', fontWeight: '500', flex: 1 },

    uploadBox: { height: 200, backgroundColor: '#fff', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 24 },
    previewImage: { width: '100%', height: '100%' },
    uploadPlaceholder: { alignItems: 'center' },
    uploadText: { fontSize: 14, color: '#94a3b8', fontWeight: '700', marginTop: 12 },

    verifyBtn: { backgroundColor: '#0f172a', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    verifyBtnDisabled: { opacity: 0.5 },
    verifyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    successContainer: { alignItems: 'center' },
    rewardCard: { width: '100%', padding: 32, borderRadius: 32, alignItems: 'center', marginBottom: 32 },
    rewardTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 24 },
    qrWrapper: { padding: 16, backgroundColor: '#fff', borderRadius: 24 },
    qrCodeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '800', marginTop: 16, letterSpacing: 2 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '100%', marginVertical: 24 },
    rewardInfo: { color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: '600', lineHeight: 20 },

    partnerTitle: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
    cafeCard: { width: '100%', flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', gap: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    cafeInfo: { flex: 1 },
    cafeName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    cafeLoc: { fontSize: 12, color: '#64748b', marginTop: 2 }
});
