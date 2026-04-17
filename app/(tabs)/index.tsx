import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category, Destination, fetchCategories, fetchDestinations, fetchTours, Tour, subscribeTours, getDisplayPrice, formatCurrency } from '../../services/tourApi';
import CappoAssistant from '../../components/CappoAssistant';
import ProfessionalDatePicker from '../../components/ProfessionalDatePicker';
import GuestPicker from '../../components/GuestPicker';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<Tour | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [searchDate, setSearchDate] = useState<Date>(new Date());
  const [guestPickerVisible, setGuestPickerVisible] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const filteredTours = tours.filter(tour => {
    const term = searchText.toLowerCase();
    // Extended filtering to match "ATV", "Balon", "Gün Doğumu" specifically to Cappadocia tours for extra immersion
    const isSpecialKeyword = (term.includes('atv') || term.includes('balon') || term.includes('doğumu')) && tour.title.toLowerCase().includes('kapadokya');
    return tour.title.toLowerCase().includes(term) || (tour.slug || '').toLowerCase().includes(term) || isSpecialKeyword;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedTours, fetchedDests, fetchedCats] = await Promise.all([
          fetchTours(),
          fetchDestinations(),
          fetchCategories()
        ]);
        setTours(fetchedTours);
        setDestinations(fetchedDests);
        setCategories(fetchedCats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Live_Pulse_Sync
    const unsubscribe = subscribeTours(async () => {
        const updated = await fetchTours();
        setTours(updated);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003580" />
        <Text style={styles.loadingText}>Fiyatlar aranıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003580" />
      
      {/* Booking.com Style Header & Search */}
      <View style={styles.topBlueHeader}>
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          {/* Logo & Icons */}
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>Tourkia.com</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
              <CappoAssistant />
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconBtn}><FontAwesome name="bell-o" size={20} color="#fff" /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}><FontAwesome name="user-o" size={20} color="#fff" /></TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Service Tabs */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1 }}>TURLAR</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Massive Booking Style Search Form */}
        <View style={styles.searchFormWrapper}>
          <View style={styles.searchForm}>
            {/* Destination Input (Dynamic) */}
            <View style={styles.formRow}>
              <FontAwesome name="search" size={20} color="#333" style={styles.formIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Nereye veya ne yapmak istiyorsunuz?"
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setSearchFocused(true)}
              />
              {searchFocused && (
                <TouchableOpacity onPress={() => { setSearchFocused(false); setSearchText(''); }}>
                  <FontAwesome name="times-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {searchFocused && (
              <View style={styles.dropdownContainer}>
                {searchText.length === 0 ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <FontAwesome name="line-chart" size={14} color="#0071c2" style={{ marginRight: 8 }} />
                      <Text style={styles.dropdownTitle}>BUGÜN EN ÇOK ARANANLAR</Text>
                    </View>
                    <View style={styles.quickAccessTags}>
                      {[
                        { label: 'Kapadokya', pop: true },
                        { label: 'Balon Turu', pop: true },
                        { label: 'ATV Safari', pop: false },
                        { label: 'Gün Doğumu', pop: true },
                        { label: 'İtalya', pop: false },
                        { label: 'Günübirlik', pop: false }
                      ].map(item => (
                        <TouchableOpacity key={item.label} style={styles.tagBtn} onPress={() => setSearchText(item.label)}>
                          {item.pop && <FontAwesome name="fire" size={12} color="#ff4d4d" style={{ marginRight: 4 }} />}
                          <Text style={styles.tagText}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.dropdownTitle}>SON ARANANLAR</Text>
                    </View>
                    {tours.slice(0, 2).map(tour => (
                      <TouchableOpacity key={'recent-'+tour.id} style={styles.dropdownItem} onPress={() => router.push(`/tour/${tour.id}`)}>
                        <FontAwesome name="history" size={16} color="#666" style={{ width: 24, textAlign: 'center' }} />
                        <Text style={styles.dropdownItemText}>{tour.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <>
                    <Text style={styles.dropdownTitle}>ARAMA SONUÇLARI</Text>
                    {filteredTours.length > 0 ? (
                      filteredTours.map(tour => (
                        <TouchableOpacity key={'search-'+tour.id} style={styles.dropdownItem} onPress={() => router.push(`/tour/${tour.id}`)}>
                          <FontAwesome name="map-marker" size={16} color="#0071c2" style={{ width: 24, textAlign: 'center' }} />
                          <Text style={styles.dropdownItemText}>{tour.title}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noResultText}>Sonuç bulunamadı.</Text>
                    )}
                  </>
                )}
              </View>
            )}
            <View style={styles.formDivider} />
            
            {/* Dates */}
            <TouchableOpacity style={styles.formRow} onPress={() => setDatePickerVisible(true)}>
              <FontAwesome name="calendar-o" size={20} color="#333" style={styles.formIcon} />
              <Text style={styles.formText}>
                {searchDate.getDate()} {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][searchDate.getMonth()]} {searchDate.getFullYear()}
              </Text>
            </TouchableOpacity>
            <View style={styles.formDivider} />
            
            {/* Guests */}
            <TouchableOpacity style={styles.formRow} onPress={() => setGuestPickerVisible(true)}>
              <FontAwesome name="user-o" size={20} color="#333" style={styles.formIcon} />
              <Text style={styles.formText}>{adults} yetişkin · {children} çocuk</Text>
            </TouchableOpacity>

            {/* Giant Yellow Search Button */}
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Ara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Kombo Paketler Carousel ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Efsane Kombo Paketler 🔥</Text>
          <Text style={styles.sectionSubtitle}>Tur + Gurme Yemek bir arada!</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comboScroll}>
          {tours.filter(t => t.price > 1000).slice(0, 4).map((tour, idx) => (
            <TouchableOpacity 
              key={'combo-'+tour.id} 
              style={styles.comboCard}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedCombo(tour);
                setModalVisible(true);
              }}
            >
              <Image source={{ uri: tour.image }} style={styles.comboImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.comboOverlay}>
                 <View style={styles.comboContent}>
                   <Text style={styles.comboPriceTag}>{formatCurrency(getDisplayPrice(tour.price, tour.currency || 'TRY').amount, 'TRY')}</Text>
                   <Text style={styles.comboTitle} numberOfLines={1}>{tour.title}</Text>
                   <View style={styles.comboIncluded}>
                      <FontAwesome name="map-marker" size={12} color="#fff" />
                      <Text style={styles.comboPlus}>+</Text>
                      <FontAwesome name="cutlery" size={12} color="#fff" />
                      <Text style={styles.comboLabel}>MAP + MEAL KLASİĞİ</Text>
                   </View>
                 </View>
              </LinearGradient>
              <View style={styles.comboBadge}>
                <Text style={styles.comboBadgeText}>-%15 AVANTAJ</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories as Destinations/Features */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trend Kategoriler</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.bookingCatPill}>
              <Text style={styles.bookingCatPillText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─── Hazır Kombo Paketler (Dikey Kart Tasarımı) ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popüler Kombolar 🏆</Text>
          <Text style={styles.sectionSubtitle}>Tur ve Lezzet bir arada, daha avantajlı!</Text>
        </View>
        <View style={styles.verticalComboSection}>
          {tours.filter(t => t.price > 1200).slice(0, 3).map((tour, idx) => (
            <View key={'vcombo-'+tour.id} style={styles.vComboCard}>
              <View style={styles.vComboImageContainer}>
                <Image source={{ uri: tour.image }} style={styles.vComboImage} />
                <View style={styles.vComboIconBadge}>
                  <Text style={styles.vComboIconText}>🗺️ + 🍽️</Text>
                </View>
              </View>
              
              <View style={styles.vComboContent}>
                <Text style={styles.vComboHeader}>{tour.title} + Tourkia Lezzet</Text>
                <Text style={styles.vComboDesc}>Kapadokya'nın en iyi turu ve en ünlü restoranı bu pakette birleşti.</Text>
                
                <View style={styles.vComboPriceRow}>
                   <View>
                      <Text style={styles.vComboPriceLabel}>Paket Fiyatı</Text>
                      <Text style={styles.vComboPrice}>{formatCurrency(getDisplayPrice(tour.price, 'TRY').amount, 'TRY')}</Text>
                   </View>
                   <View style={styles.vComboSaveBadge}>
                      <Text style={styles.vComboSaveText}>%15 TASARRUF</Text>
                   </View>
                </View>

                <View style={styles.vComboActionRow}>
                  <TouchableOpacity 
                    style={styles.vComboDetailsBtn}
                    onPress={() => {
                      setSelectedCombo(tour);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.vComboDetailsText}>İçeriği Gör</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.vComboBuyBtn}
                    onPress={() => router.push(`/checkout/${tour.id}`)}
                  >
                    <Text style={styles.vComboBuyText}>Hemen Al</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>



        {/* Tours / Accommodations Box */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sizin için önerilen turlar</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toursScroll}>
          {tours.map(tour => (
            <TouchableOpacity key={tour.id} style={styles.bookingTourCard} activeOpacity={0.9} onPress={() => router.push(`/tour/${tour.id}`)}>
              <View style={styles.tourImageContainer}>
                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                
                {tour.isPremiumPartner && (
                  <View style={styles.premiumBadge}>
                    <FontAwesome name="bolt" size={12} color="#fbbf24" />
                    <Text style={styles.premiumText}>Premium Partner</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.heartButton}>
                  <FontAwesome name="heart-o" size={18} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Live_Pulse_Sync Banner */}
              {tour.lastBookedAt && (Date.now() - tour.lastBookedAt < 3600000) && (
                  <View style={{ backgroundColor: '#fee2e2', padding: 8, flexDirection: 'row', alignItems: 'center' }}>
                     <FontAwesome name="bolt" color="#ef4444" size={12} style={{marginRight: 6}} />
                     <Text style={{ fontSize: 11, color: '#dc2626', fontWeight: '800' }}>Son Dakika: Az önce 1 rezervasyon yapıldı!</Text>
                  </View>
              )}

              <View style={styles.tourContent}>
                <Text style={styles.tourTitle} numberOfLines={2}>{tour.title}</Text>
                
                {tour.totalReviews && tour.totalReviews > 0 ? (
                  <View style={styles.socialProofContainer}>
                    <FontAwesome name="star" size={14} color="#febb02" />
                    <Text style={styles.socialProofRating}>{tour.rating}</Text>
                    <Text style={styles.socialProofCount}>({tour.totalReviews} değerlendirme)</Text>
                  </View>
                ) : (
                  <View style={styles.newExperienceBadge}>
                    <FontAwesome name="star-o" size={12} color="#0071c2" />
                    <Text style={styles.newExperienceText}>İlk Yorumu Sen Yap</Text>
                  </View>
                )}

                {/* Agency Verification Badge & Tooltip */}
                {tour.isVerifiedAgency && (
                  <View style={styles.agencyAuthWrapper}>
                    <TouchableOpacity 
                      style={styles.verifiedAgencyBadge}
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation();
                        setActiveTooltipId(activeTooltipId === tour.id ? null : tour.id);
                      }}
                    >
                      <FontAwesome name="check-circle" size={12} color="#10b981" />
                      <Text style={styles.verifiedAgencyText}>Doğrulanmış Acenta</Text>
                    </TouchableOpacity>

                    {activeTooltipId === tour.id && (
                      <View style={styles.tooltipBalloon}>
                        <Text style={styles.tooltipTitle}>{tour.agencyName}</Text>
                        <Text style={styles.tooltipText}>TÜRSAB No: {tour.tursabNo}</Text>
                        <TouchableOpacity style={styles.tooltipClose} onPress={() => setActiveTooltipId(null)}>
                          <FontAwesome name="times" size={10} color="#94a3b8" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                <Text style={styles.tourDuration}>{tour.duration} • Harika deneyim</Text>
                
                {!!tour.stockCount && tour.stockCount < 5 && (
                  <View style={styles.stockWarning}>
                    <FontAwesome name="fire" size={14} color="#dc2626" />
                    <Text style={styles.stockWarningText}>Son {tour.stockCount} Yer!</Text>
                  </View>
                )}

                {tour.badge && (
                  <Text style={styles.earlyBirdText}>{tour.badge}</Text>
                )}

                <View style={styles.tourFooter}>
                  <Text style={styles.tourPriceLabel}>1 gece, 2 yetişkin</Text>
                  {tour.discountPrice ? (
                    <View style={styles.priceRow}>
                      <Text style={styles.originalPriceStrikethrough}>
                        {formatCurrency(getDisplayPrice(tour.price, tour.currency || 'TRY').amount, getDisplayPrice(tour.price, tour.currency || 'TRY').currency)}
                      </Text>
                      <Text style={styles.tourPriceDiscounted}>
                        {formatCurrency(getDisplayPrice(tour.discountPrice, tour.currency || 'TRY').amount, getDisplayPrice(tour.discountPrice, tour.currency || 'TRY').currency)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.tourPrice}>
                      {formatCurrency(getDisplayPrice(tour.price, tour.currency || 'TRY').amount, getDisplayPrice(tour.price, tour.currency || 'TRY').currency)}
                    </Text>
                  )}
                  {getDisplayPrice(tour.price, tour.currency || 'TRY').isConverted ? (
                    <Text style={[styles.priceSubText, { color: '#0071c2', fontStyle: 'italic', fontWeight: '700' }]}>*Tahmini Döviz Karşılığı</Text>
                  ) : (
                    <Text style={styles.priceSubText}>Vergiler ve ücretler dahildir</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ─── Snap-on Modal (Quick Preview) ─── */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            {selectedCombo && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedCombo.image }} style={styles.sheetImage} />
                <View style={styles.sheetBody}>
                  <Text style={styles.sheetTitle}>{selectedCombo.title}</Text>
                  <Text style={styles.sheetSubtitle}>Kapadokya Karma Deneyimi</Text>
                  
                  <View style={styles.featureRow}>
                    <View style={styles.featureItem}>
                      <View style={[styles.featureIcon, { backgroundColor: '#eff6ff' }]}>
                        <FontAwesome name="map" size={14} color="#3b82f6" />
                      </View>
                      <View>
                        <Text style={styles.featureLabel}>Tur Detayı</Text>
                        <Text style={styles.featureValue}>Profesyonel Rehber + Transfer</Text>
                      </View>
                    </View>
                    <View style={styles.featureItem}>
                      <View style={[styles.featureIcon, { backgroundColor: '#fff7ed' }]}>
                        <FontAwesome name="cutlery" size={14} color="#ea580c" />
                      </View>
                      <View>
                        <Text style={styles.featureLabel}>Özel Menü</Text>
                        <Text style={styles.featureValue}>Testi Kebabı + Sınırsız İçecek</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.sheetDescription}>
                    Bu kombo paket ile hem Kapadokya'nın eşsiz vadilerini gezecek hem de 
                    bölgenin en ünlü restoranında Tourkia üyelerine özel fix menünün tadını çıkaracaksınız.
                  </Text>

                  <TouchableOpacity 
                    style={styles.sheetPrimaryBtn}
                    onPress={() => {
                      setModalVisible(false);
                      router.push(`/tour/${selectedCombo.id}`);
                    }}
                  >
                    <Text style={styles.sheetPrimaryBtnText}>Paketi İncele & Rezerve Et</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <ProfessionalDatePicker 
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelectDate={(date) => setSearchDate(date)}
        initialDate={searchDate}
      />

      <GuestPicker 
        visible={guestPickerVisible}
        onClose={() => setGuestPickerVisible(false)}
        onConfirm={(a, c) => {
          setAdults(a);
          setChildren(c);
        }}
        initialAdults={adults}
        initialChildren={children}
      />
    </View>
  );
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '700', color: '#003580' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  
  topBlueHeader: { backgroundColor: '#003580', paddingBottom: 60 /* Forms overlap this */ },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  headerIcons: { flexDirection: 'row', gap: 20 },
  iconBtn: { padding: 4 },
  
  tabsScroll: { paddingHorizontal: 20, marginBottom: 10 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  tabItemActive: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: '#fff' },
  tabText: { color: '#bbccdd', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  tabTextActive: { color: '#fff', fontWeight: '800' },

  mainScroll: { flex: 1, marginTop: -40 /* Bring up to overlap header */ },
  
  searchFormWrapper: { paddingHorizontal: 16, marginBottom: 24 },
  searchForm: { backgroundColor: '#febb02', padding: 4, borderRadius: 8, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  formRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 50, borderRadius: 4 },
  formDivider: { height: 1, backgroundColor: '#febb02' },
  formIcon: { width: 24, marginRight: 12 },
  formTextActive: { fontSize: 16, fontWeight: '800', color: '#333' },
  formText: { fontSize: 16, fontWeight: '500', color: '#666' },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '800', color: '#333', height: '100%' },
  dropdownContainer: { backgroundColor: '#fff', padding: 16 },
  dropdownTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', marginBottom: 12, marginTop: 8, letterSpacing: 0.5 },
  quickAccessTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagText: { fontSize: 13, color: '#334155', fontWeight: '700' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  dropdownItemText: { fontSize: 15, color: '#334155', fontWeight: '700', flex: 1 },
  noResultText: { fontSize: 14, color: '#94a3b8', fontStyle: 'italic', paddingVertical: 10 },
  searchButton: { backgroundColor: '#0071c2', height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  searchButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  geniusBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 16, padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#e6e6e6' },
  geniusContent: { flex: 1, paddingRight: 16 },
  geniusTitle: { fontSize: 16, fontWeight: '900', color: '#000', marginBottom: 6 },
  geniusDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  sectionHeader: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#000' },
  sectionSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  categoryScroll: { paddingHorizontal: 16, gap: 10, marginBottom: 32 },
  bookingCatPill: { borderWidth: 1, borderColor: '#0071c2', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff' },
  bookingCatPillText: { fontSize: 14, fontWeight: '700', color: '#0071c2' },

  destScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 32 },
  bookingDestCard: { width: 140, height: 140, borderRadius: 8, overflow: 'hidden' },
  bookingDestImage: { width: '100%', height: '100%' },
  bookingDestOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  bookingDestName: { position: 'absolute', top: 12, left: 12, color: '#fff', fontSize: 16, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },

  toursScroll: { paddingHorizontal: 16, gap: 16, marginBottom: 20 },
  bookingTourCard: { width: 300, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e6e6e6', paddingBottom: 16 },
  tourImageContainer: { position: 'relative', width: '100%', height: 200 },
  tourImage: { width: '100%', height: '100%' },
  premiumBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  premiumText: { color: '#fff', fontSize: 10, fontWeight: '900', marginLeft: 4, letterSpacing: 0.5 },
  heartButton: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },

  
  tourContent: { padding: 12 },
  tourTitle: { fontSize: 16, fontWeight: '800', color: '#000', marginBottom: 6 },
  socialProofContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  socialProofRating: { fontSize: 13, fontWeight: '800', color: '#000' },
  socialProofCount: { fontSize: 12, color: '#666', fontWeight: '500' },
  newExperienceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8, gap: 4, borderWidth: 1, borderColor: '#bae6fd' },
  newExperienceText: { color: '#0071c2', fontSize: 11, fontWeight: '800' },
  
  agencyAuthWrapper: { position: 'relative', zIndex: 10, alignSelf: 'flex-start', marginBottom: 8 },
  verifiedAgencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, gap: 4, borderWidth: 1, borderColor: '#a7f3d0' },
  verifiedAgencyText: { color: '#047857', fontSize: 11, fontWeight: '700' },
  tooltipBalloon: { position: 'absolute', top: '100%', left: 0, marginTop: 4, backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, zIndex: 999, width: 150, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  tooltipTitle: { color: '#fff', fontSize: 12, fontWeight: '800', marginBottom: 2 },
  tooltipText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  tooltipClose: { position: 'absolute', top: 2, right: 6, padding: 4 },

  tourDuration: { fontSize: 12, color: '#0071c2', fontWeight: '700', marginBottom: 8 },
  stockWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#fecaca' },
  stockWarningText: { color: '#dc2626', fontSize: 12, fontWeight: '800', marginLeft: 6 },
  earlyBirdText: { alignSelf: 'flex-start', backgroundColor: '#e2f4ea', color: '#0d652d', fontSize: 12, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 16 },
  
  tourFooter: { alignItems: 'flex-end', marginTop: 8 },
  tourPriceLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  tourPrice: { fontSize: 20, fontWeight: '900', color: '#000' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  originalPriceStrikethrough: { fontSize: 13, color: '#94a3b8', textDecorationLine: 'line-through', marginBottom: 2, fontWeight: '600' },
  tourPriceDiscounted: { fontSize: 22, fontWeight: '900', color: '#0071c2' },
  priceSubText: { fontSize: 12, color: '#666', marginTop: 2 },

  // Combo Carousel Styles
  comboScroll: { paddingHorizontal: 16, gap: 16, paddingBottom: 24 },
  comboCard: { width: 280, height: 180, borderRadius: 20, overflow: 'hidden', backgroundColor: '#eee', elevation: 12, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  comboImage: { width: '100%', height: '100%' },
  comboOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 16 },
  comboContent: {},
  comboPriceTag: { backgroundColor: '#febb02', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 12, fontWeight: '900', color: '#000', marginBottom: 6 },
  comboTitle: { color: '#fff', fontSize: 18, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  comboIncluded: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  comboPlus: { color: '#fff', fontSize: 14, fontWeight: '700' },
  comboLabel: { color: '#fff', fontSize: 10, fontWeight: '800', opacity: 0.9, marginLeft: 4 },
  comboBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  comboBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  // Bottom Sheet Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: SCREEN_H * 0.7, width: '100%', overflow: 'hidden' },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 10, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  sheetImage: { width: '100%', height: 220 },
  sheetBody: { padding: 24 },
  sheetTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  sheetSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '600', marginBottom: 20 },
  featureRow: { flexDirection: 'column', gap: 16, marginBottom: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  featureLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  featureValue: { fontSize: 14, fontWeight: '700', color: '#334155' },
  sheetDescription: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 30 },
  sheetPrimaryBtn: { backgroundColor: '#0071c2', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#0071c2', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sheetPrimaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  // Vertical Combo Styles
  verticalComboSection: { paddingHorizontal: 16, marginBottom: 32 },
  vComboCard: { backgroundColor: '#fff', borderRadius: 24, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#005f80', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  vComboImageContainer: { height: 180, position: 'relative' },
  vComboImage: { width: '100%', height: '100%' },
  vComboIconBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, elevation: 4 },
  vComboIconText: { fontSize: 14, fontWeight: '900' },
  vComboContent: { padding: 20 },
  vComboHeader: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  vComboDesc: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 20 },
  vComboPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  vComboPriceLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 },
  vComboPrice: { fontSize: 24, fontWeight: '900', color: '#0071c2' },
  vComboSaveBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  vComboSaveText: { color: '#16a34a', fontSize: 11, fontWeight: '800' },
  vComboActionRow: { flexDirection: 'row', gap: 12 },
  vComboDetailsBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  vComboDetailsText: { color: '#334155', fontSize: 14, fontWeight: '800' },
  vComboBuyBtn: { flex: 1.5, height: 50, borderRadius: 14, backgroundColor: '#0071c2', justifyContent: 'center', alignItems: 'center', shadowColor: '#0071c2', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  vComboBuyText: { color: '#fff', fontSize: 14, fontWeight: '900' }
});
