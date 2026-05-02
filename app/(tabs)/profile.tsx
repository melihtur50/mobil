import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Animated, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ReferralService } from '../../services/referralService';

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, userRole, isGuest } = useAuth();
    const { language, setLanguage, currency, setCurrency, points, userPromoCode, t } = useAppContext();
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;
    const [referralModalVisible, setReferralModalVisible] = useState(false);
    const [promoCode, setPromoCode] = useState(userPromoCode || '');

    React.useEffect(() => {
        const initReferral = async () => {
            const code = await ReferralService.getOrCreatePromoCode('ALEX');
            setPromoCode(code);
        };
        initReferral();

        if (!isGuest) {
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true
                })
            ).start();
        }
    }, [isGuest]);

    const shimmerPos = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 600]
    });

    if (isGuest) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.guestContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.guestHeader}>
                        <View style={styles.guestIconCircle}>
                            <FontAwesome name="user-circle-o" size={80} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.guestTitle}>Tourkia Dünyasına Hoş Geldiniz</Text>
                        <Text style={styles.guestSubtitle}>Biletlerinize erişmek, favorilerinizi kaydetmek ve özel fırsatlardan yararlanmak için giriş yapın.</Text>
                    </View>

                    <View style={styles.guestActions}>
                        <AnimatedButton style={styles.guestLoginBtn} onPress={() => router.push('/login')} haptic="medium">
                            <Text style={styles.guestLoginBtnText}>Giriş Yap</Text>
                        </AnimatedButton>

                        <AnimatedButton style={styles.guestRegisterBtn} onPress={() => router.push('/register')} haptic="medium">
                            <Text style={styles.guestRegisterBtnText}>Şimdi Kayıt Ol</Text>
                        </AnimatedButton>
                    </View>

                    <View style={styles.guestInfoCards}>
                        <View style={styles.infoSmallCard}>
                            <FontAwesome name="ticket" size={20} color={Colors.light.primary} />
                            <Text style={styles.infoCardText}>Biletlerim</Text>
                        </View>
                        <View style={styles.infoSmallCard}>
                            <FontAwesome name="heart" size={20} color={Colors.light.accent} />
                            <Text style={styles.infoCardText}>Favorilerim</Text>
                        </View>
                        <View style={styles.infoSmallCard}>
                            <FontAwesome name="star" size={20} color={Colors.light.secondary} />
                            <Text style={styles.infoCardText}>VIP Statü</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    const handleLogout = () => {
        Alert.alert(
            "Çıkış Yap",
            "Çıkış yapıyorsunuz, emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                { 
                    text: "Çıkış Yap", 
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const MenuItem = ({ title, icon, color, route, secondaryIcon }: any) => (
      <AnimatedButton style={styles.menuItem} onPress={() => route && router.push(route)} haptic="light">
          <View style={[styles.menuIconBox, { backgroundColor: color + '10' }]}>
              <FontAwesome name={icon} size={16} color={color} />
          </View>
          <Text style={styles.menuText}>{title}</Text>
          <FontAwesome name={secondaryIcon || "chevron-right"} size={12} color={Colors.light.border} />
      </AnimatedButton>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} bounces={false}>

                <View style={styles.header}>
                    <View style={styles.avatarWrapper}>
                      <Image
                          source={{ uri: userRole === 'agency' ? 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=200&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
                          style={styles.avatar}
                      />
                      <View style={styles.activeStatus} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{userRole === 'agency' ? 'Demo Acenta' : 'Demo Kullanıcı'}</Text>
                        <Text style={styles.email}>{userRole === 'agency' ? 'acenta@tourkia.com' : 'demo@tourkia.com'}</Text>
                    </View>
                    <AnimatedButton style={styles.editBtn} onPress={() => router.push('/edit-profile')} haptic="medium">
                        <FontAwesome name="pencil" size={16} color={Colors.light.primary} />
                    </AnimatedButton>
                </View>

                {/* VIP Digital Card */}
                {userRole === 'customer' && (
                    <AnimatedButton 
                        style={styles.vipContainer} 
                        onPress={() => router.push('/vip-privileges')}
                        haptic="heavy"
                    >
                        <LinearGradient
                            colors={[Colors.light.primary, '#002B55']}
                            style={styles.vipCard}
                        >
                            <Animated.View style={[styles.shimmerBox, { transform: [{ translateX: shimmerPos }] }]}>
                                <LinearGradient
                                    colors={['transparent', 'rgba(212, 175, 55, 0.05)', 'rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.05)', 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.shimmerGradient}
                                />
                            </Animated.View>

                            <View style={styles.vipHeader}>
                                <Text style={styles.vipBrand}>TOURKIA <Text style={{fontWeight: '300', color: Colors.light.secondary}}>VIP</Text></Text>
                                <FontAwesome name="check-circle" size={24} color={Colors.light.secondary} />
                            </View>

                            <View style={styles.vipBody}>
                                <Text style={styles.vipLabel}>Ayrıcalıklı Üye</Text>
                                <Text style={styles.vipName}>DEMO KULLANICI</Text>
                                <Text style={styles.vipStatus}>PLATINUM TIER</Text>
                            </View>

                            <View style={styles.vipFooter}>
                                <View>
                                    <Text style={styles.vipFooterLabel}>ÜYELİK KODU</Text>
                                    <Text style={styles.vipFooterValue}>TK-9921-2024</Text>
                                </View>
                                <FontAwesome name="qrcode" size={32} color={Colors.light.secondary} />
                            </View>
                        </LinearGradient>
                    </AnimatedButton>
                )}

                {/* Komut 25: Referral-Gamification-Loop */}
                {!isGuest && (
                    <View style={styles.section}>
                        <AnimatedButton 
                            style={styles.referralCard} 
                            onPress={() => setReferralModalVisible(true)}
                            haptic="medium"
                        >
                            <LinearGradient
                                colors={['#8b5cf6', '#6366f1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.referralGradient}
                            >
                                <View style={styles.referralInfo}>
                                    <View style={styles.pointsBadge}>
                                        <FontAwesome name="gift" size={16} color="#fff" />
                                        <Text style={styles.pointsText}>{points} EUR Puan</Text>
                                    </View>
                                    <Text style={styles.referralTitle}>Arkadaşını Davet Et</Text>
                                    <Text style={styles.referralSubtitle}>Her başarılı davette 10 EUR kazan!</Text>
                                </View>
                                <FontAwesome name="share-alt" size={24} color="rgba(255,255,255,0.8)" />
                            </LinearGradient>
                        </AnimatedButton>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>UYGULAMA AYARLARI</Text>
                    <View style={styles.cardGroup}>
                      {/* Language Selector */}
                      <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                          <FontAwesome name="language" size={16} color={Colors.light.textMuted} />
                          <Text style={styles.settingLabel}>{t('language')}</Text>
                        </View>
                        <View style={styles.optionGroup}>
                          <AnimatedButton 
                            style={[styles.optionBtn, language === 'tr' && styles.optionActive]} 
                            onPress={() => setLanguage('tr')}
                          >
                            <Text style={[styles.optionText, language === 'tr' && styles.optionTextActive]}>TR</Text>
                          </AnimatedButton>
                          <AnimatedButton 
                            style={[styles.optionBtn, language === 'en' && styles.optionActive]} 
                            onPress={() => setLanguage('en')}
                          >
                            <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>EN</Text>
                          </AnimatedButton>
                        </View>
                      </View>

                      {/* Currency Selector */}
                      <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                          <FontAwesome name="money" size={16} color={Colors.light.textMuted} />
                          <Text style={styles.settingLabel}>{t('currency')}</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionGroup}>
                          {['TRY', 'USD', 'EUR', 'GBP'].map((cur: any) => (
                            <AnimatedButton 
                              key={cur}
                              style={[styles.optionBtn, currency === cur && styles.optionActive]} 
                              onPress={() => setCurrency(cur)}
                            >
                              <Text style={[styles.optionText, currency === cur && styles.optionTextActive]}>{cur}</Text>
                            </AnimatedButton>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{userRole === 'agency' ? 'YÖNETİM PANELİ' : 'HESABIM'}</Text>
                    <View style={styles.cardGroup}>
                      {userRole === 'customer' ? (
                        <>
                          <MenuItem title="Ödeme Yöntemleri" icon="credit-card" color={Colors.light.primary} route="/payment-cards" />
                          <MenuItem title="Biletlerim & Voucher" icon="ticket" color={Colors.light.primary} route="/tickets" />
                          <MenuItem title="Hediye Kahveni Al ☕" icon="coffee" color="#f97316" route="/coffee-reward" />
                          <MenuItem title="Hesap Ayarları" icon="cog" color={Colors.light.textMuted} route="/edit-profile" />
                        </>
                      ) : userRole === 'agency' ? (
                        <>
                          <MenuItem title="Paneli Görüntüle" icon="dashboard" color={Colors.light.primary} route="/dashboard" />
                          <MenuItem title="Rezervasyonlar" icon="check-square-o" color={Colors.light.success} route="/bookings" />
                          <MenuItem title="Turlarımı Yönet" icon="globe" color={Colors.light.primary} route="/my-tours" />
                        </>
                      ) : (
                        <>
                          <MenuItem title="God-Mode Dashboard" icon="bolt" color="#6366f1" route="/admin-dashboard" />
                          <MenuItem title="Global Finans Takibi" icon="bank" color="#f59e0b" route="/admin-dashboard" />
                          <MenuItem title="Tüm İşletmeler" icon="users" color="#10b981" />
                        </>
                      )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DESTEK & YASAL</Text>
                    <View style={styles.cardGroup}>
                      <MenuItem title="Yardım Merkezi" icon="question-circle" color={Colors.light.textMuted} />
                      <MenuItem title="Gizlilik Politikası" icon="shield" color={Colors.light.textMuted} />
                    </View>
                </View>

                <View style={styles.logoutWrapper}>
                  <AnimatedButton style={styles.logoutBtn} onPress={handleLogout} haptic="heavy">
                      <FontAwesome name="sign-out" size={16} color={Colors.light.error} style={{ marginRight: 12 }} />
                      <Text style={styles.logoutText}>Oturumu Kapat</Text>
                  </AnimatedButton>
                </View>

                <Text style={styles.version}>Tourkia v1.2.0 (Premium Edit)</Text>

            </ScrollView>

            <Modal
                visible={referralModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setReferralModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Davet Et & Kazan</Text>
                            <TouchableOpacity onPress={() => setReferralModalVisible(false)}>
                                <FontAwesome name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.promoCodeBox}>
                                <Text style={styles.promoLabel}>SENİN PROMO KODUN</Text>
                                <View style={styles.codeRow}>
                                    <Text style={styles.codeText}>{promoCode}</Text>
                                    <TouchableOpacity onPress={() => ReferralService.shareInvite(promoCode)}>
                                        <FontAwesome name="copy" size={20} color="#6366f1" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.referralStepsTitle}>Nasıl Çalışır?</Text>
                            <View style={styles.stepItem}>
                                <View style={styles.stepDot}><Text style={styles.stepNum}>1</Text></View>
                                <Text style={styles.stepText}>Linkini WhatsApp veya Telegram'dan arkadaşına gönder.</Text>
                            </View>
                            <View style={styles.stepItem}>
                                <View style={styles.stepDot}><Text style={styles.stepNum}>2</Text></View>
                                <Text style={styles.stepText}>Arkadaşın ilk rezervasyonunda <Text style={{fontWeight:'800'}}>%5 İndirim</Text> kazansın.</Text>
                            </View>
                            <View style={styles.stepItem}>
                                <View style={styles.stepDot}><Text style={styles.stepNum}>3</Text></View>
                                <Text style={styles.stepText}>Rezervasyon tamamlandığında cüzdanına <Text style={{fontWeight:'800'}}>10 EUR</Text> yüklensin!</Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.shareButton}
                                onPress={() => ReferralService.shareInvite(promoCode)}
                            >
                                <FontAwesome name="whatsapp" size={20} color="#fff" style={{marginRight: 10}} />
                                <Text style={styles.shareButtonText}>Arkadaşlarınla Paylaş</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.light.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    container: { flex: 1 },
    
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 40, paddingBottom: 32 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff', ...Shadows.sm },
    activeStatus: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.light.success, borderWidth: 2, borderColor: '#fff' },
    headerInfo: { flex: 1, marginLeft: 16 },
    name: { fontSize: 22, fontWeight: '900', color: Colors.light.primary, marginBottom: 2 },
    email: { fontSize: 13, color: Colors.light.textMuted, fontWeight: '600' },
    editBtn: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
    
    section: { paddingHorizontal: Spacing.lg, marginBottom: 24 },
    sectionTitle: { fontSize: 11, fontWeight: '900', color: Colors.light.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
    cardGroup: { backgroundColor: '#fff', borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.sm, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)', marginBottom: 16 },
    
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.light.background },
    settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingLabel: { fontSize: 13, fontWeight: '700', color: Colors.light.text },
    optionGroup: { flexDirection: 'row', gap: 8 },
    optionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.sm, backgroundColor: Colors.light.background },
    optionActive: { backgroundColor: Colors.light.secondary },
    optionText: { fontSize: 12, fontWeight: '800', color: Colors.light.textMuted },
    optionTextActive: { color: Colors.light.primary },

    menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.light.background },
    menuIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    menuText: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.light.text },
    
    vipContainer: { paddingHorizontal: Spacing.lg, marginBottom: 32 },
    vipCard: { height: 210, borderRadius: BorderRadius.xxl, padding: 24, overflow: 'hidden', ...Shadows.lg },
    shimmerBox: { position: 'absolute', top: 0, left: 0, width: 300, height: '200%', transform: [{ rotate: '45deg' }] },
    shimmerGradient: { width: '100%', height: '100%' },
    vipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    vipBrand: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
    vipBody: { flex: 1, justifyContent: 'center' },
    vipLabel: { color: Colors.light.secondary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
    vipName: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 2 },
    vipStatus: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700' },
    vipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    vipFooterLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '800', marginBottom: 2 },
    vipFooterValue: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 1 },

    logoutWrapper: { paddingHorizontal: Spacing.lg, marginTop: 10 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F5', paddingVertical: 18, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: '#FFE5E5' },
    logoutText: { fontSize: 16, fontWeight: '900', color: Colors.light.error },
    version: { textAlign: 'center', fontSize: 11, color: Colors.light.textMuted, marginTop: 24, fontWeight: '700', letterSpacing: 0.5 },

    referralCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.md },
    referralGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    referralInfo: { flex: 1 },
    pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
    pointsText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    referralTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 2 },
    referralSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.light.primary },
    modalBody: {},
    promoCodeBox: { backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 32 },
    promoLabel: { fontSize: 10, fontWeight: '900', color: '#64748b', letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
    codeRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
    codeText: { fontSize: 32, fontWeight: '900', color: '#6366f1', letterSpacing: 2 },

    referralStepsTitle: { fontSize: 16, fontWeight: '800', color: Colors.light.primary, marginBottom: 16 },
    stepItem: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
    stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
    stepNum: { fontSize: 12, fontWeight: '900', color: '#6366f1' },
    stepText: { fontSize: 14, color: '#475569', fontWeight: '500', flex: 1 },

    shareButton: { backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 16, marginTop: 16 },
    shareButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    guestContent: { flexGrow: 1, backgroundColor: Colors.light.background, padding: 24, justifyContent: 'center', alignItems: 'center' },
    guestHeader: { alignItems: 'center', marginBottom: 40 },
    guestIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...Shadows.md },
    guestTitle: { fontSize: 24, fontWeight: '900', color: Colors.light.primary, textAlign: 'center', marginBottom: 12 },
    guestSubtitle: { fontSize: 15, color: Colors.light.textMuted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
    guestActions: { width: '100%', gap: 16, marginBottom: 48 },
    guestLoginBtn: { backgroundColor: Colors.light.primary, width: '100%', height: 60, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', ...Shadows.md },
    guestLoginBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
    guestRegisterBtn: { backgroundColor: '#fff', width: '100%', height: 60, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.light.border },
    guestRegisterBtnText: { color: Colors.light.primary, fontSize: 16, fontWeight: '900' },
    guestInfoCards: { flexDirection: 'row', gap: 12 },
    infoSmallCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.sm },
    infoCardText: { fontSize: 10, fontWeight: '900', color: Colors.light.textMuted, marginTop: 8 }
});
