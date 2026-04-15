import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';

export default function CheckoutSuccessScreen() {
    const router = useRouter();
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Animated.View style={[styles.iconBox, { transform: [{ scale: scaleAnim }] }]}>
                    <FontAwesome name="check" size={50} color="#fff" />
                </Animated.View>

                <Text style={styles.title}>Rezervasyon Basarili!</Text>
                <Text style={styles.subtitle}>
                    Ödemeniz güvenli bir şekilde ulaştı. E-biletiniz cihazınıza kaydedildi, "Çevrimdışı Biletlerim" kısmından internet olmadan da görüntüleyebilirsiniz.
                </Text>

                <View style={styles.ticketBox}>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>Sipariş No:</Text>
                        <Text style={styles.ticketValue}>#TRK-{Math.floor(100000 + Math.random() * 900000)}</Text>
                    </View>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>Tarih:</Text>
                        <Text style={styles.ticketValue}>15 Eylül - 10:00</Text>
                    </View>
                    <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>Durum:</Text>
                        <Text style={[styles.ticketValue, {color: '#10b981'}]}>Onaylandı</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.biletBtn} onPress={() => router.replace('/offline-tickets')}>
                    <Text style={styles.biletBtnText}>Biletlerimi Göster</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.homeBtnText}>Ana Sayfaya Dön</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#10b981', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
    subtitle: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    
    ticketBox: { width: '100%', backgroundColor: '#f8fafc', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', marginBottom: 32 },
    ticketRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    ticketLabel: { fontSize: 15, color: '#64748b', fontWeight: '500' },
    ticketValue: { fontSize: 15, color: '#0f172a', fontWeight: '800' },

    biletBtn: { width: '100%', backgroundColor: '#0071c2', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
    biletBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    homeBtn: { width: '100%', backgroundColor: '#f1f5f9', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    homeBtnText: { color: '#475569', fontSize: 16, fontWeight: '800' },
});
