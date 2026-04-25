import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    Dimensions, 
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    FlatList,
    Modal,
    StatusBar
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedScrollHandler, 
    useAnimatedStyle, 
    interpolate, 
    Extrapolation,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const PulsingBadge = ({ text }: { text: string }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.pulsingBadge, animatedStyle]}>
      <Text style={styles.pulsingBadgeText}>{text}</Text>
    </Animated.View>
  );
};
import { ImmersiveMediaHeader } from '../../components/common/ImmersiveMediaHeader';
import { fetchTours, Tour, getDisplayPrice, formatPriceWithContext } from '../../services/tourApi';
import AvailabilityCalendar from '../../components/AvailabilityCalendar';
import { useAppContext } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.5;
const ANATOLIAN_SAFFRON = '#FF9F00';

export default function TourDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { currency, language } = useAppContext();
    
    // Reanimated Shared Value for scroll tracking
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const [tour, setTour] = useState<Tour | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    // Meteorology_Bridge Simulation Logic
    const [windRiskProbability] = useState(82);

    useEffect(() => {
        const loadTour = async () => {
            const allTours = await fetchTours();
            const found = allTours.find(t => t.id === id) || allTours[0];
            setTour(found);
        };
        loadTour();

        const { subscribeTours } = require('../../services/tourApi');
        const unsubscribe = subscribeTours(() => {
            loadTour();
        });
        return unsubscribe;
    }, [id]);

    if (!tour) return <View style={styles.loadingContainer}><Text>Yükleniyor...</Text></View>;

    // Prepare media for header (First item is a high-quality video)
    const mediaItems = [
        { 
            id: 'video-main', 
            type: 'video' as const, 
            url: tour.id === '1' 
                ? 'https://player.vimeo.com/external/370331493.hd.mp4?s=34a41f6f1c469b6151f151528646b146b95b8d00&profile_id=175' // Cappadocia Balloon
                : 'https://player.vimeo.com/external/434045526.hd.mp4?s=69431497223e3e2b262d3a3f5f3e2a225e5e2e2e&profile_id=175' // Generic travel
        },
        { id: 'img-main', type: 'image' as const, url: tour.image },
        ...(tour.gallery?.map(img => ({ id: img.id, type: 'image' as const, url: img.url })) || [])
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ImmersiveMediaHeader media={mediaItems} scrollY={scrollY} />

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
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <View style={{ height: HEADER_HEIGHT - 60 }} />
                
                {/* Ana İçerik Kartı */}
                <View style={styles.contentBox}>
                    <View style={styles.badgeRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{tour.rating}</Text>
                        </View>
                        <Text style={styles.ratingLabel}>Harika • 124 Değerlendirme</Text>
                    </View>

                    <Text style={styles.title}>{tour.title}</Text>
                    
                    {/* Meteorology_Bridge: Kapadokya Balon Riski Kontrolü */}
                    {tour.id === '1' && windRiskProbability > 70 && (
                        <View style={styles.meteorologyBox}>
                            <View style={styles.meteorologyHeader}>
                                <FontAwesome name="warning" size={16} color="#c2410c" />
                                <Text style={styles.meteorologyTitle}>Hava Durumu Uyarısı</Text>
                            </View>
                            <Text style={styles.meteorologyText}>
                                Sivil Havacılık radarlarına göre uçuş bölgesi oldukça rüzgarlı. Balon turlarının rüzgar sebebiyle iptal olma ihtimali <Text style={{fontWeight: '900'}}>%{windRiskProbability}</Text> oranında riskli görünmektedir.
                            </Text>
                            <TouchableOpacity style={styles.crossSellBtn} onPress={() => { router.back(); setTimeout(() => router.push('/tour/4'), 100); }}>
                                <FontAwesome name="motorcycle" size={16} color="#047857" style={{marginRight: 8}} />
                                <Text style={styles.crossSellBtnText}>Aynı Bölgede ATV Turlarına Göz Atın</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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

                    {/* Dahil & Hariç Çerçevesi */}
                    <Text style={styles.sectionTitle}>Neler Dahile Neler Değil?</Text>
                    <View style={styles.incExcBox}>
                        <View style={styles.incExcColumn}>
                            <Text style={styles.incExcTitle}>Dahil</Text>
                            {tour.included?.map((item, idx) => (
                                <View key={idx} style={styles.incExcRow}>
                                    <FontAwesome name="check-circle" size={16} color="#10b981" style={{ marginTop: 2 }} />
                                    <Text style={styles.incExcText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                        
                        <View style={styles.incExcDivider} />

                        <View style={styles.incExcColumn}>
                            <Text style={styles.incExcTitle}>Dahil Değil</Text>
                            {tour.excluded?.map((item, idx) => (
                                <View key={idx} style={styles.incExcRow}>
                                    <FontAwesome name="times-circle" size={16} color="#94a3b8" style={{ marginTop: 2 }} />
                                    <Text style={[styles.incExcText, { color: '#64748b', textDecorationLine: 'line-through' }]}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Lokasyon Modülü */}
                    {tour.meetingPoint && (
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.sectionTitle}>Buluşma Noktası & Lokasyon</Text>
                            <View style={styles.locationBox}>
                                <View style={styles.locationIconWrap}>
                                    <FontAwesome name="map-marker" size={24} color="#ef4444" />
                                </View>
                                <View style={styles.locationInfo}>
                                    <Text style={styles.locationAddress}>{tour.meetingPoint.address}</Text>
                                    <TouchableOpacity 
                                        style={styles.locationBtn} 
                                        onPress={() => Linking.openURL(`https://maps.google.com/?q=${tour.meetingPoint?.lat},${tour.meetingPoint?.lng}`)}
                                    >
                                        <Text style={styles.locationBtnText}>Yol Tarifi Al</Text>
                                        <FontAwesome name="angle-right" size={14} color="#0071c2" style={{ marginLeft: 4, marginTop: 2 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {tour.hasHotelPickup && (
                                <Text style={styles.hotelPickupNote}>{`* Bu tur 'Otelden Ücretsiz Alış' (Hotel Pickup) içermektedir.`}</Text>
                            )}
                        </View>
                    )}

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

                    {/* Dinamik ve Gerçek Görsel Öncelikli Galeri */}
                    {(tour.gallery && tour.gallery.length > 0) && (
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.sectionTitle}>Turdan Kareler</Text>
                            <Text style={styles.galleryNote}>
                                <FontAwesome name="check-circle" size={12} color="#10b981" /> {` Acenta tarafından yüklenen 'Gerçek Tur Fotoğrafları'`}
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                                {[...tour.gallery]
                                    .sort((a, b) => Number(a.isStock) - Number(b.isStock))
                                    .map(img => (
                                        <TouchableOpacity 
                                            key={img.id} 
                                            onPress={() => { setActiveImage(img.url); setLightboxVisible(true); }}
                                            activeOpacity={0.9}
                                        >
                                            <Image source={{ uri: img.url }} style={styles.galleryImage} />
                                            {!img.isStock && (
                                                <View style={styles.realPhotoBadge}>
                                                    <Text style={styles.realPhotoText}>Gerçek Görsel</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Müsaitlik Takvimi */}
                    <View style={styles.divider} />
                    <AvailabilityCalendar 
                        availabilities={tour.availabilities || []} 
                        selectedDate={selectedDate} 
                        onSelectDate={setSelectedDate} 
                    />

                    {/* Trust Banner (İptal Politikası) */}
                    {tour.cancellationPolicy && (
                        <View style={[styles.trustBanner, !tour.isRefundable && styles.trustBannerNonRef]}>
                            <FontAwesome 
                                name={tour.isRefundable ? "shield" : "exclamation-circle"} 
                                size={18} 
                                color={tour.isRefundable ? "#10b981" : "#ef4444"} 
                            />
                            <Text style={[styles.trustBannerText, !tour.isRefundable && styles.trustBannerTextNonRef]}>
                                {tour.cancellationPolicy}
                            </Text>
                        </View>
                    )}

                    {/* Yorumlar Bölümü */}
                    <View style={styles.divider} />
                    
                    {/* Komut 11: Trust Badges (Güven Rozetleri) */}
                    <View style={{ marginBottom: 24 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trustBadgesRow}>
                            <View style={styles.trustBadge}>
                                <FontAwesome name="certificate" size={14} color={ANATOLIAN_SAFFRON} />
                                <Text style={styles.trustBadgeText}>TÜRSAB Onaylı</Text>
                            </View>
                            <View style={styles.trustBadge}>
                                <FontAwesome name="history" size={14} color="#10b981" />
                                <Text style={styles.trustBadgeText}>Ücretsiz İptal</Text>
                            </View>
                            <View style={styles.trustBadge}>
                                <FontAwesome name="globe" size={14} color="#0071c2" />
                                <Text style={styles.trustBadgeText}>İngilizce Rehber</Text>
                            </View>
                            <View style={styles.trustBadge}>
                                <FontAwesome name="lock" size={14} color="#64748b" />
                                <Text style={styles.trustBadgeText}>Güvenli Ödeme</Text>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Yorumlar Bölümü */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16}}>
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Misafir Yorumları</Text>
                        <Text style={{color: '#0071c2', fontWeight: '700', fontSize: 13}}>Tümünü Oku</Text>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Image source={{uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}} style={styles.reviewAvatar} />
                                <View style={{marginLeft: 12}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <Text style={styles.reviewName}>John Doe</Text>
                                        <Text style={{fontSize: 14}}>🇺🇸</Text>
                                    </View>
                                    <Text style={styles.reviewDate}>2 gün önce</Text>
                                </View>
                                <View style={{marginLeft: 'auto', backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>10.0</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{`"Incredible experience! The balloon flight over Cappadocia was a dream come true."`}</Text>
                        </View>

                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Image source={{uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}} style={styles.reviewAvatar} />
                                <View style={{marginLeft: 12}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <Text style={styles.reviewName}>Sarah Wilson</Text>
                                        <Text style={{fontSize: 14}}>🇬🇧</Text>
                                    </View>
                                    <Text style={styles.reviewDate}>1 hafta önce</Text>
                                </View>
                                <View style={{marginLeft: 'auto', backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>9.5</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{`"The guide was very knowledgeable. Everything was perfectly organized."`}</Text>
                        </View>

                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Image source={{uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'}} style={styles.reviewAvatar} />
                                <View style={{marginLeft: 12}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <Text style={styles.reviewName}>Melih Turan</Text>
                                        <Text style={{fontSize: 14}}>🇹🇷</Text>
                                    </View>
                                    <Text style={styles.reviewDate}>3 hafta önce</Text>
                                </View>
                                <View style={{marginLeft: 'auto', backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6}}>
                                    <Text style={{color: '#fff', fontSize: 12, fontWeight: '800'}}>10.0</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{`"Kapadokya'nın ruhunu hissettiğimiz harika bir tur oldu. Kesinlikle tavsiye ederim."`}</Text>
                        </View>
                    </ScrollView>

                    <View style={{height: 100}} />
                </View>
            </Animated.ScrollView>

            {/* Tam Ekran Lightbox (Zoom Özellikli) */}
            <Modal visible={lightboxVisible} transparent={true} animationType="fade" onRequestClose={() => setLightboxVisible(false)}>
                <View style={styles.lightboxContainer}>
                    <TouchableOpacity style={styles.lightboxCloseBtn} onPress={() => setLightboxVisible(false)}>
                        <FontAwesome name="times" size={28} color="#fff" />
                    </TouchableOpacity>
                    {activeImage && (
                        <ScrollView 
                           contentContainerStyle={styles.lightboxScroll}
                           maximumZoomScale={3}
                           minimumZoomScale={1}
                           centerContent
                           showsHorizontalScrollIndicator={false}
                           showsVerticalScrollIndicator={false}
                        >
                            <Image source={{ uri: activeImage }} style={styles.lightboxImage} resizeMode="contain" />
                        </ScrollView>
                    )}
                </View>
            </Modal>

            {/* Sabit Alt Satın Alma Barı */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Kişi başı</Text>
                    <Text style={styles.priceAmount}>{formatPriceWithContext(getDisplayPrice(tour.price, tour.currency || 'TRY', currency).amount, currency, language)}</Text>
                    
                    {/* Komut 12: Combo Upsell Button */}
                    <TouchableOpacity 
                      style={styles.comboUpsell}
                      onPress={() => router.push(`/checkout/upsell?id=${tour.id}&date=${selectedDate}&meal=true`)}
                    >
                      <PulsingBadge text="+ Yemek Ekle (%15 İndirim)" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.buyBtn, 
                        !selectedDate && { backgroundColor: '#cbd5e1' },
                        selectedDate && tour.availabilities?.find(a => a.date === selectedDate)?.capacity === 0 && { backgroundColor: '#ef4444' }
                    ]} 
                    disabled={!selectedDate || !!(selectedDate && tour.availabilities?.find(a => a.date === selectedDate)?.capacity === 0)}
                    onPress={() => router.push(`/checkout/upsell?id=${tour.id}&date=${selectedDate}`)}
                >
                    <Text 
                        style={[styles.buyBtnText, language === 'zh' && { fontSize: 20 }]} 
                        numberOfLines={1} 
                        adjustsFontSizeToFit
                    >
                        {!selectedDate ? 'Tarih Seçiniz' : (tour.availabilities?.find(a => a.date === selectedDate)?.capacity === 0 ? 'Kontenjan Dolu' : 'Rezervasyon Yap')}
                    </Text>
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
    
    incExcBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24 },
    incExcColumn: { flex: 1 },
    incExcDivider: { width: 1, backgroundColor: '#e2e8f0', marginHorizontal: 12 },
    incExcTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
    incExcRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
    incExcText: { fontSize: 13, color: '#0f172a', flex: 1, lineHeight: 18, fontWeight: '600' },
    
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
    buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    
    trustBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', padding: 12, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: '#a7f3d0' },
    trustBannerNonRef: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
    trustBannerText: { color: '#047857', fontSize: 13, fontWeight: '700', marginLeft: 10, flex: 1 },
    trustBannerTextNonRef: { color: '#dc2626' },

    locationBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
    locationIconWrap: { width: 44, height: 44, backgroundColor: '#fef2f2', borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    locationInfo: { flex: 1 },
    locationAddress: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
    locationBtn: { flexDirection: 'row', alignItems: 'center' },
    locationBtnText: { color: '#0071c2', fontWeight: '800', fontSize: 12 },
    hotelPickupNote: { fontSize: 12, color: '#10b981', fontWeight: '700', marginTop: 10, fontStyle: 'italic' },

    meteorologyBox: { backgroundColor: '#ffedd5', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#fdba74' },
    meteorologyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
    meteorologyTitle: { color: '#c2410c', fontWeight: '800', fontSize: 14 },
    meteorologyText: { color: '#9a3412', fontSize: 13, lineHeight: 18, marginBottom: 16 },
    crossSellBtn: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    crossSellBtnText: { color: '#047857', fontWeight: '800', fontSize: 12 },

    galleryNote: { fontSize: 13, color: '#10b981', fontWeight: '600', marginBottom: 16, fontStyle: 'italic' },
    galleryImage: { width: 160, height: 120, borderRadius: 12, backgroundColor: '#e2e8f0' },
    realPhotoBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    realPhotoText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    
    lightboxContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
    lightboxCloseBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, right: 20, zIndex: 100, padding: 10, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25 },
    lightboxScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: width, height: height },
    lightboxImage: { width: width, height: height * 0.8 },

    trustBadgesRow: { gap: 12, paddingRight: 24 },
    trustBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 8 },
    trustBadgeText: { fontSize: 13, fontWeight: '700', color: '#475569' },

    comboUpsell: { marginTop: 6 },
    pulsingBadge: { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fdba74' },
    pulsingBadgeText: { color: '#c2410c', fontSize: 11, fontWeight: '900' }
});
