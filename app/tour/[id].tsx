import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, ImageBackground, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchTours, Tour } from '../../services/tourApi';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

export default function TourDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const scrollY = new Animated.Value(0);
    const [tour, setTour] = useState<Tour | null>(null);

    useEffect(() => {
        const loadTour = async () => {
            const allTours = await fetchTours();
            const found = allTours.find(t => t.id === id) || allTours[0];
            setTour(found);
        };
        loadTour();
    }, [id]);

    if (!tour) return <View style={styles.loadingContainer}><Text>Yükleniyor...</Text></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Arka Plan Görseli */}
            <Animated.View style={[ styles.imageContainer, {
                transform: [{
                    translateY: scrollY.interpolate({
                        inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    })
                }, {
                    scale: scrollY.interpolate({
                        inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        outputRange: [2, 1, 1]
                    })
                }]
            }]}>
                <ImageBackground source={{ uri: tour.image }} style={styles.image} />
                <View style={styles.imageOverlay} />
            </Animated.View>

            {/* Tepe Navigasyon Çubuğu (Geri Butonu ve Kalp) */}
            <SafeAreaView style={styles.topBar}>
                <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
                    <FontAwesome name="angle-left" size={24} color="#0f172a" style={{marginRight: 2}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}>
                    <FontAwesome name="heart-o" size={20} color="#0f172a" />
                </TouchableOpacity>
            </SafeAreaView>

            <Animated.ScrollView
                style={styles.scrollArea}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                <View style={styles.scrollPadding} />
                
                {/* Ana İçerik Kartı */}
                <View style={styles.contentBox}>
                    <View style={styles.badgeRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{tour.rating}</Text>
                        </View>
                        <Text style={styles.ratingLabel}>Harika • 124 Değerlendirme</Text>
                    </View>

                    <Text style={styles.title}>{tour.title}</Text>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoPill}>
                            <FontAwesome name="clock-o" size={14} color="#64748b" />
                            <Text style={styles.infoPillText}>{tour.duration}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <FontAwesome name="map-marker" size={14} color="#64748b" />
                            <Text style={styles.infoPillText}>Rehberli Tur</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <FontAwesome name="ticket" size={14} color="#10b981" />
                            <Text style={[styles.infoPillText, {color: '#10b981'}]}>Elektronik Bilet</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Tur Açıklaması */}
                    <Text style={styles.sectionTitle}>Genel Bakış</Text>
                    <Text style={styles.description}>
                        Bu tur size eşsiz bir deneyim sunmak için özel olarak tasarlandı. Konforlu ulaşım, profesyonel rehberlik ve unutulmaz anılar sizleri bekliyor. Kapadokya'nın veya boğazın büyüleyici manzarasını en iyi açılardan keşfedeceğiniz bu programda yerinizi ayırtın.
                    </Text>

                    {/* Seyahat Planı (Itinerary) */}
                    <Text style={styles.sectionTitle}>Seyahat Planı</Text>
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTime}>08:00</Text>
                            <Text style={styles.timelineTitle}>Otelden Alınış</Text>
                            <Text style={styles.timelineDesc}>Klimalı lüks araçlarımızla otelinizden alınıyorsunuz.</Text>
                        </View>
                    </View>
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTime}>10:30</Text>
                            <Text style={styles.timelineTitle}>Gezinin Başlaması & Rehberlik</Text>
                            <Text style={styles.timelineDesc}>Bölgenin en ikonik noktalarını ziyaret ve fotoğraf molası.</Text>
                        </View>
                    </View>
                    <View style={[styles.timelineItem, { borderLeftWidth: 0 }]}>
                        <View style={[styles.timelineDot, { backgroundColor: '#10b981', borderColor: '#d1fae5' }]} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTime}>17:00</Text>
                            <Text style={styles.timelineTitle}>Dönüş ve Kapanış</Text>
                        </View>
                    </View>

                    {/* Yorumlar Bölümü */}
                    <View style={styles.divider} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16}}>
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Misafir Yorumları</Text>
                        <Text style={{color: '#0071c2', fontWeight: '700', fontSize: 13}}>Tümünü Oku</Text>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <ImageBackground source={{uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}} style={styles.reviewAvatar} imageStyle={{borderRadius:20}} />
                                <View style={{marginLeft: 12}}>
                                    <Text style={styles.reviewName}>Ahmet Yılmaz</Text>
                                    <Text style={styles.reviewDate}>2 gün önce</Text>
                                </View>
                                <View style={{marginLeft: 'auto', backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>10.0</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>"Her şey harikaydı, hayatımda yaşadığım en güzel gündü!"</Text>
                        </View>

                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <ImageBackground source={{uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}} style={styles.reviewAvatar} imageStyle={{borderRadius:20}} />
                                <View style={{marginLeft: 12}}>
                                    <Text style={styles.reviewName}>Ayşe Demir</Text>
                                    <Text style={styles.reviewDate}>1 hafta önce</Text>
                                </View>
                                <View style={{marginLeft: 'auto', backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>9.5</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>"Rehberimiz çok bilgiliydi. Taksi transferi çok rahattı."</Text>
                        </View>
                    </ScrollView>

                    <View style={{height: 100}} />
                </View>
            </Animated.ScrollView>

            {/* Sabit Alt Satın Alma Barı */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Kişi başı</Text>
                    <Text style={styles.priceAmount}>₺{tour.price.toLocaleString('tr-TR')}</Text>
                </View>
                <TouchableOpacity style={styles.buyBtn} onPress={() => router.push(`/checkout/${tour.id}`)}>
                    <Text style={styles.buyBtnText}>Rezervasyon Yap</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#fff' },
    
    imageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 0 },
    image: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
    
    topBar: { position: 'absolute', top: Platform.OS === 'android' ? StatusBar.currentHeight : 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
    circleBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    
    scrollArea: { flex: 1 },
    scrollPadding: { height: HEADER_HEIGHT - 40 },
    contentBox: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: height - HEADER_HEIGHT + 40 },
    
    badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    ratingBadge: { backgroundColor: '#003580', paddingHorizontal: 8, paddingVertical: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
    ratingText: { color: '#fff', fontWeight: '900', fontSize: 13 },
    ratingLabel: { marginLeft: 10, color: '#0071c2', fontWeight: '700', fontSize: 13 },
    
    title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 16, lineHeight: 32 },
    
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    infoPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    infoPillText: { fontSize: 12, fontWeight: '700', color: '#475569', marginLeft: 8 },
    
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 24 },
    
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
    description: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' },
    
    timelineItem: { paddingLeft: 24, borderLeftWidth: 2, borderLeftColor: '#e2e8f0', position: 'relative', paddingBottom: 24 },
    timelineDot: { position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff', borderWidth: 2, borderColor: '#0071c2' },
    timelineContent: { marginTop: -4 },
    timelineTime: { fontSize: 13, fontWeight: '800', color: '#0071c2', marginBottom: 4 },
    timelineTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
    timelineDesc: { fontSize: 13, color: '#64748b' },

    reviewCard: { width: 280, backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
    reviewName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
    reviewDate: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
    reviewText: { fontSize: 14, color: '#475569', fontStyle: 'italic', lineHeight: 20 },
    
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', shadowColor: '#000', shadowOffset: {width: 0, height: -5}, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15 },
    priceContainer: { flex: 1 },
    priceLabel: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 2 },
    priceAmount: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
    buyBtn: { backgroundColor: '#0071c2', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, shadowColor: '#0071c2', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
