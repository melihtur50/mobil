import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentCardsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={16} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ödeme Kartlarım</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <FontAwesome name="cc-visa" size={32} color="#fff" />
                        <FontAwesome name="wifi" size={20} color="#fff" style={{ transform: [{ rotate: '90deg' }] }} />
                    </View>
                    <Text style={styles.cardNumber}>**** **** **** 4281</Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>KART SAHİBİ</Text>
                            <Text style={styles.cardValue}>DEMO KULLANICI</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>SKT</Text>
                            <Text style={styles.cardValue}>12/28</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.addCardBtn}>
                    <FontAwesome name="plus" size={16} color="#008cb3" />
                    <Text style={styles.addCardText}>Yeni Kart Ekle</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    container: { padding: 24 },
    card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    cardNumber: { fontSize: 22, color: '#fff', fontWeight: 'bold', letterSpacing: 2, marginBottom: 32 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
    cardLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 4, fontWeight: '700' },
    cardValue: { fontSize: 14, color: '#fff', fontWeight: '800' },
    addCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, marginTop: 24, borderRadius: 16, borderWidth: 1, borderColor: '#008cb3', borderStyle: 'dashed', backgroundColor: '#f0f9ff' },
    addCardText: { fontSize: 15, fontWeight: '700', color: '#008cb3' }
});
