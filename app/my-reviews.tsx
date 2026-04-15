import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyReviewsScreen() {
    const router = useRouter();

    const reviews = [
        { tour: 'Kapadokya Sıcak Hava Balonu', date: '15 Mayıs 2026', rating: 5, comment: 'Hayatımda yaşadığım en muazzam deneyimdi. Organizasyon kusursuzdu!' },
        { tour: 'İstanbul Boğaz Turu', date: '5 Nisan 2026', rating: 4, comment: 'Güzeldi ama teknede rüzgar biraz fazla esiyordu, yine de tavsiye ederim.' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={16} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yorumlarım</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.tourTitle}>{review.tour}</Text>
                            <View style={styles.stars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesome 
                                        key={star} 
                                        name="star" 
                                        size={14} 
                                        color={star <= review.rating ? "#eab308" : "#e2e8f0"} 
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.commentText}>{review.comment}</Text>
                        <Text style={styles.dateText}>{review.date}</Text>
                    </View>
                ))}
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
    reviewCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    reviewHeader: { marginBottom: 12 },
    tourTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
    stars: { flexDirection: 'row', gap: 4 },
    commentText: { fontSize: 14, color: '#475569', lineHeight: 22, fontStyle: 'italic', marginBottom: 12 },
    dateText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', textAlign: 'right' }
});
