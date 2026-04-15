import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyToursScreen() {
    const router = useRouter();

    const tours = [
        {
            id: '#1',
            title: 'Standart Balon',
            image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=600&auto=format&fit=crop',
            badgeText: 'EN POPÜLER DENEYİM',
            badgeIcon: 'trophy',
            duration: '3 Saat (1 Saat Uçuş)',
            price: '₺3500'
        },
        {
            id: '#2',
            title: 'Kırmızı Tur',
            image: 'https://images.unsplash.com/photo-1582236371537-47b1c1d81de2?q=80&w=600&auto=format&fit=crop',
            badgeText: 'KÜLTÜR & TARİH',
            badgeIcon: 'map-o',
            duration: '1 Gün',
            price: '₺1500'
        },
        {
            id: '#3',
            title: 'Yeşil Tur',
            image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=600&auto=format&fit=crop',
            badgeText: 'DOĞA YÜRÜYÜŞÜ & MACERA',
            badgeIcon: 'tree',
            duration: '1 Gün',
            price: '₺1650'
        },
        {
            id: '#4',
            title: 'Türk Gecesi',
            image: 'https://images.unsplash.com/photo-1533174000255-1b423c4603e8?q=80&w=600&auto=format&fit=crop',
            badgeText: 'AKŞAM EĞLENCESİ',
            badgeIcon: 'glass',
            duration: '3 Saat',
            price: '₺1200'
        }
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>Turlarım & Yönetim</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Geniş Başlık ve Açıklama Alanı */}
                <View style={styles.pageHeader}>
                    <View style={styles.pageHeaderLeft}>
                        <Text style={styles.pageTitle}>Turlarım</Text>
                        <Text style={styles.pageSubtitle}>Sistemde listelenen turlarınızı yönetin.</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.addTourBtn} 
                        // Daha önce alt bardan kaldırdığımız Tur Yükle ekranına yönlendirir
                        onPress={() => router.push('/add-tour')}
                    >
                        <FontAwesome name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.addTourBtnText}>Yeni Tur Ekle</Text>
                    </TouchableOpacity>
                </View>

                {/* Turlar Listesi */}
                <View style={styles.toursContainer}>
                    {tours.map((tour, index) => (
                        <View key={index} style={styles.tourCard}>
                            
                            {/* Resim ve ID */}
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                                <View style={styles.idBadge}>
                                    <Text style={styles.idBadgeText}>{tour.id}</Text>
                                </View>
                            </View>

                            {/* İçerik */}
                            <View style={styles.cardContent}>
                                <Text style={styles.tourTitle}>{tour.title}</Text>
                                
                                <View style={styles.categoryBadge}>
                                    <FontAwesome name={tour.badgeIcon as any} size={10} color="#0ea5e9" style={{ marginRight: 6 }} />
                                    <Text style={styles.categoryBadgeText}>{tour.badgeText}</Text>
                                </View>
                                
                                <View style={styles.durationRow}>
                                    <FontAwesome name="clock-o" size={14} color="#64748b" style={{ marginRight: 6 }} />
                                    <Text style={styles.durationText}>{tour.duration}</Text>
                                </View>

                                {/* Footer: Fiyat ve Aksiyonlar */}
                                <View style={styles.cardFooter}>
                                    <Text style={styles.price}>{tour.price}</Text>

                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <FontAwesome name="pencil" size={14} color="#64748b" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <FontAwesome name="trash-o" size={15} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 8, marginLeft: -8 },
    headerBarTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    
    scrollContent: { padding: 20, paddingBottom: 60 },

    pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    pageHeaderLeft: { flex: 1, paddingRight: 12 },
    pageTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    pageSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '500', lineHeight: 18 },
    
    addTourBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0ea5e9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    addTourBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

    toursContainer: { gap: 20 },

    tourCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9' },
    
    imageContainer: { width: '100%', height: 180, position: 'relative' },
    tourImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    idBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    idBadgeText: { fontSize: 12, fontWeight: '900', color: '#0f172a' },

    cardContent: { padding: 20 },
    tourTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
    
    categoryBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    categoryBadgeText: { fontSize: 10, fontWeight: '800', color: '#0ea5e9', letterSpacing: 0.5 },
    
    durationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    durationText: { fontSize: 13, fontWeight: '600', color: '#64748b' },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    price: { fontSize: 20, fontWeight: '900', color: '#0ea5e9' },
    
    actionButtons: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' }
});
