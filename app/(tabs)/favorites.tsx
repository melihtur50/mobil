import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FAVORITES = [
    { id: 1, title: 'Kapadokya Balon Turu', price: '₺2.400', image: 'https://images.unsplash.com/photo-1596395819057-afbf19aff3fb?w=500&q=80', rating: 4.9, date: '12 Ekim - 15 Ekim' },
    { id: 2, title: 'Büyük İtalya Turu', price: '₺18.150', image: 'https://images.unsplash.com/photo-1541432901042-2b8cbc77d2a8?w=500&q=80', rating: 4.8, date: 'Açık Tarihli' },
];

export default function FavoritesScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorilerim</Text>
                <Text style={styles.badge}>2 Tur</Text>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {FAVORITES.length > 0 ? (
                    <View style={styles.list}>
                        {FAVORITES.map(tour => (
                            <View key={tour.id} style={styles.card}>
                                <Image source={{ uri: tour.image }} style={styles.image} />

                                <View style={styles.info}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.title} numberOfLines={2}>{tour.title}</Text>
                                        <TouchableOpacity style={styles.heartBtn}>
                                            <FontAwesome name="heart" size={20} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <FontAwesome name="calendar" size={12} color="#94a3b8" style={styles.icon} />
                                        <Text style={styles.dateText}>{tour.date}</Text>
                                    </View>

                                    <View style={styles.bottomRow}>
                                        <View style={styles.ratingBox}>
                                            <FontAwesome name="star" size={12} color="#fbbf24" />
                                            <Text style={styles.ratingText}>{tour.rating}</Text>
                                        </View>
                                        <Text style={styles.price}>{tour.price}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <FontAwesome name="heart-o" size={40} color="#cbd5e1" />
                        </View>
                        <Text style={styles.emptyTitle}>Henüz Favoriniz Yok</Text>
                        <Text style={styles.emptyDesc}>Hayalinizdeki tatili bulun ve kalp ikonuna basarak buraya kaydedin.</Text>
                        <TouchableOpacity style={styles.exploreBtn}>
                            <Text style={styles.exploreBtnText}>Turları Keşfet</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
    },
    badge: {
        marginLeft: 12,
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 10,
        fontWeight: '900',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    list: {
        padding: 24,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    info: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: '800',
        color: '#334155',
        marginRight: 8,
    },
    heartBtn: {
        padding: 2,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    icon: {
        marginRight: 6,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 12,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#d97706',
        marginLeft: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: '900',
        color: '#008cb3',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 12,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    exploreBtn: {
        backgroundColor: '#008cb3',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
    },
    exploreBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
