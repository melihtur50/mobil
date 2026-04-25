import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Switch, StatusBar } from 'react-native';
import { fetchTours, Tour, TourkiaPoints } from '../../services/tourApi';
import { saveTicketOffline } from '../../services/offlineStorage';
import { scheduleMealReminder } from '../../services/notificationService';
import { useAppContext } from '../../context/AppContext';
import { processCommissionSplit } from '../../services/financeService';

const CountdownTimer = () => {
    const [seconds, setSeconds] = useState(15 * 60);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        <View style={styles.fomoBanner}>
            <View style={styles.timerRow}>
                <FontAwesome name="hourglass-half" size={14} color="#dc2626" />
                <Text style={styles.timerText}>{minutes}:{secs < 10 ? `0${secs}` : secs}</Text>
            </View>
            <Text style={styles.fomoText}>
                Kapadokya çok yoğun! Bu VIP paket <Text style={{fontWeight: '900'}}>15 dakika</Text> boyunca sizin için rezerve edilmiştir.
            </Text>
        </View>
    );
};

export default function CheckoutScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { currency, language } = useAppContext();
    const [tour, setTour] = useState<Tour | null>(null);
    
    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Points_Burner State
    const [usePoints, setUsePoints] = useState(false);

    useEffect(() => {
        const loadTour = async () => {
            const allTours = await fetchTours();
            const found = allTours.find(t => t.id === id) || allTours[0];
            setTour(found);
        };
        loadTour();
    }, [id]);

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(async () => {
            setIsProcessing(false);
            if (usePoints && TourkiaPoints.points > 0) {
                 TourkiaPoints.burn(Math.min(TourkiaPoints.points, tour!.price * 2));
            }
            const earned = Math.floor(finalAmount * 0.05);
            TourkiaPoints.add(earned);
            
            // Tur Tarihlerini Ayarla (Demo olduğu için bugüne kuruyoruz)
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 saatlik tur

            // AsyncStorage_Vault Secure Offline Storage 
            const newTicket = await saveTicketOffline(
                tour!, 
                "Demo Kullanıcı", 
                2, 
                true, // Demo olduğu için yemek paketi dahil varsayıyoruz
                { id: 'rest-1', name: 'Tourkia Partner Restaurant', address: 'Göreme, Nevşehir' },
                startDate.toISOString(),
                endDate.toISOString()
            );

            // Akıllı bildirimi planla
            await scheduleMealReminder(newTicket);

            // Komut 20: Auto-Commission-Splitter (Akıllı Komisyon Motoru)
            // Ödeme sonrası parayı Tourkia ve İşletme arasında bölüştür
            await processCommissionSplit(
                finalAmount, 
                'rest-1', // Demo restoran ID
                tour!.id,
                0.15 // %15 komisyon
            );

            alert(`🎉 %5 Kazanç: Bu alışverişten +${earned} TourkiaPuan hesabınıza eklendi.`);
            router.replace({ 
                pathname: '/checkout/success', 
                params: { 
                    date: 'En Yakın Müsaitlik', 
                    guests: 2, 
                    tourName: tour!.title, 
                    agencyName: tour!.agencyName,
                    hasMealPackage: tour!.price > 1000 ? 'true' : 'false' // Fiyat bazlı veya hasMealPackage flagine göre
                } 
            });
        }, 2200);
    };

    if (!tour) return null;

    const baseTotal = tour.price * 2;
    const discount = (usePoints && TourkiaPoints.points > 0) ? Math.min(TourkiaPoints.points, baseTotal) : 0;
    const finalAmount = baseTotal - discount;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="times" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Güvenli Ödeme</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <CountdownTimer />

                    {/* Sipariş Özeti */}
                    <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <FontAwesome name="map" size={16} color="#0071c2" style={{width: 24}}/>
                            <Text style={styles.summaryTextBold}>{tour.title}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <FontAwesome name="calendar" size={16} color="#64748b" style={{width: 24}}/>
                            <Text style={styles.summaryText}>15 Eylül - 10:00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <FontAwesome name="users" size={16} color="#64748b" style={{width: 24}}/>
                            <Text style={styles.summaryText}>2x Yetişkin Yolcu</Text>
                        </View>
                        <View style={styles.divider} />
                        {discount > 0 && (
                            <View style={[styles.summaryRow, { justifyContent: 'space-between' }]}>
                                <Text style={[styles.totalLabel, {color: '#10b981'}]}>TourkiaPuan İndirimi</Text>
                                <Text style={[styles.totalAmount, {color: '#10b981'}]}>-₺{discount.toLocaleString('tr-TR')}</Text>
                            </View>
                        )}
                        <View style={[styles.summaryRow, { marginBottom: 0, justifyContent: 'space-between' }]}>
                            <Text style={styles.totalLabel}>Ödenecek Tutar</Text>
                            <Text style={styles.totalAmount}>₺{finalAmount.toLocaleString('tr-TR')}</Text>
                        </View>
                    </View>

                    {/* Points_Burner Modülü */}
                    {TourkiaPoints.points > 0 && (
                        <View style={styles.pointsBurnerBox}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <FontAwesome name="database" size={16} color="#f59e0b" style={{marginRight: 8}} />
                                <Text style={styles.pointsBurnerTitle}>TourkiaPuan™ Kullan</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={styles.pointsBurnerText}>Hesabınızdaki <Text style={{fontWeight: '900'}}>{TourkiaPoints.points} Puan</Text> ile sepetinizde anında indirim yapabilirsiniz.</Text>
                                <Switch value={usePoints} onValueChange={setUsePoints} trackColor={{false: '#cbd5e1', true: '#f59e0b'}} thumbColor="#fff" />
                            </View>
                        </View>
                    )}

                    {/* Dinamik Hotel Pickup Modülü */}
                    {tour.hasHotelPickup && (
                        <View style={{ marginBottom: 4 }}>
                            <Text style={styles.sectionTitle}>Otelden Alınış (Hotel Pickup)</Text>
                            <View style={[styles.inputGroup, { borderColor: '#a7f3d0', backgroundColor: '#ecfdf5' }]}>
                                <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700', marginBottom: 8 }}>Rehberimiz sizi bu adresten ücretsiz alacaktır.</Text>
                                <TextInput 
                                    style={[styles.input, { borderBottomColor: '#a7f3d0', marginBottom: 0 }]} 
                                    placeholder="Lütfen Konakladığınız Otelin Adını Girin..." 
                                    placeholderTextColor="#34d399"
                                />
                            </View>
                        </View>
                    )}

                    {/* Komut 13: Frictionless Guest Checkout (Pürüzsüz Hızlı Ödeme) */}
                    <Text style={styles.sectionTitle}>Hızlı Alışveriş Bilgileri</Text>
                    <View style={styles.inputGroup}>
                        <View style={styles.guestNote}>
                            <FontAwesome name="flash" size={14} color="#f59e0b" />
                            <Text style={styles.guestNoteText}>Hızlı Kayıt: Ödemeden sonra hesabınız otomatik oluşturulacaktır.</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#94a3b8" />
                        <TextInput style={styles.input} placeholder="E-posta Adresi" keyboardType="email-address" placeholderTextColor="#94a3b8" />
                        <View style={styles.whatsappInputRow}>
                            <FontAwesome name="whatsapp" size={18} color="#25D366" style={{ marginRight: 8 }} />
                            <TextInput 
                                style={[styles.input, { flex: 1, borderBottomWidth: 0, marginBottom: 0 }]} 
                                placeholder="WhatsApp Numarası (+90...)" 
                                keyboardType="phone-pad" 
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                    </View>

                    {/* Komut 14: Localized Payment Gateway UI (Dile Göre Ödeme Yöntemi) */}
                    <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
                    <View style={styles.paymentSelector}>
                        {language === 'zh' ? (
                            <>
                                <TouchableOpacity style={styles.paymentMethod}>
                                    <FontAwesome name="cc-visa" size={20} color="#00A3EE" />
                                    <Text style={styles.paymentMethodText}>Alipay (支付宝)</Text>
                                    <FontAwesome name="circle-o" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.paymentMethod}>
                                    <FontAwesome name="wechat" size={20} color="#09B83E" />
                                    <Text style={styles.paymentMethodText}>WeChat Pay (微信支付)</Text>
                                    <FontAwesome name="circle-o" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.paymentMethod}>
                                    <FontAwesome name="apple" size={20} color="#000" />
                                    <Text style={styles.paymentMethodText}>Apple Pay</Text>
                                    <FontAwesome name="circle-o" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.paymentMethod}>
                                    <FontAwesome name="google" size={20} color="#4285F4" />
                                    <Text style={styles.paymentMethodText}>Google Pay</Text>
                                    <FontAwesome name="circle-o" size={18} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={[styles.paymentMethod, styles.paymentMethodActive]}>
                            <FontAwesome name="credit-card" size={18} color="#0071c2" />
                            <Text style={[styles.paymentMethodText, { color: '#0071c2' }]}>Kredi Kartı / Banka Kartı</Text>
                            <FontAwesome name="check-circle" size={18} color="#0071c2" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Kredi Kartı Formu */}
                    <Text style={styles.sectionTitle}>Kart Bilgileri</Text>
                    
                    <View style={styles.cardVisual}>
                        <FontAwesome name="cc-visa" size={40} color="#fff" style={styles.cardLogo} />
                        <Text style={styles.cardVisualNumber}>{cardNumber || '**** **** **** ****'}</Text>
                        <View style={styles.cardVisualFooter}>
                            <Text style={styles.cardVisualName}>DEMO KULLANICI</Text>
                            <Text style={styles.cardVisualExp}>{expiry || 'MM/YY'}</Text>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Kart Numarası" 
                            keyboardType="number-pad" 
                            maxLength={19}
                            value={cardNumber}
                            onChangeText={setCardNumber}
                        />
                        <View style={styles.rowInputs}>
                            <TextInput 
                                style={[styles.input, { flex: 1, marginRight: 12 }]} 
                                placeholder="AA/YY" 
                                maxLength={5}
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                            <TextInput 
                                style={[styles.input, { flex: 1 }]} 
                                placeholder="CVV" 
                                keyboardType="number-pad" 
                                maxLength={3}
                                secureTextEntry
                                value={cvv}
                                onChangeText={setCvv}
                            />
                        </View>
                    </View>

                    <Text style={styles.secureText}>
                        <FontAwesome name="lock" size={12} /> Tüm işlemleriniz 256-bit SSL sertifikası ile şifrelenmektedir.
                    </Text>

                    <View style={styles.trustBadgesBox}>
                        <View style={styles.trustBadgeItem}>
                            <FontAwesome name="shield" size={18} color="#10b981" />
                            <Text style={styles.trustBadgeLabel}>256-bit SSL</Text>
                        </View>
                        <View style={styles.trustBadgeItem}>
                            <FontAwesome name="check-square-o" size={18} color="#0071c2" />
                            <Text style={styles.trustBadgeLabel}>Secure Checkout</Text>
                        </View>
                        <View style={styles.trustBadgeItem}>
                            <FontAwesome name="certificate" size={18} color="#f59e0b" />
                            <Text style={styles.trustBadgeLabel}>TÜRSAB Onaylı</Text>
                        </View>
                    </View>

                    <View style={styles.disclaimerBox}>
                        <FontAwesome name="info-circle" size={14} color="#64748b" style={{ marginRight: 8 }} />
                        <Text style={styles.disclaimerText}>
                            <Text style={{ fontWeight: '700' }}>Önemli Not:</Text> {` "Ön Ödemeli Menü" tutarı Tourkia havuzunda toplanır. Tur sırasında vereceğiniz "Ekstra Siparişler" ise doğrudan restoranda ödenecektir.`}
                        </Text>
                    </View>
                    
                    <View style={{height: 100}} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Pay Action */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.payBtn} onPress={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>₺{finalAmount.toLocaleString('tr-TR')} Öde</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    scrollContent: { padding: 20 },
    
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12, marginTop: 12 },
    
    summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
    summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    summaryTextBold: { fontSize: 15, fontWeight: '800', color: '#0f172a', flex: 1 },
    summaryText: { fontSize: 14, color: '#475569', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
    totalLabel: { fontSize: 15, fontWeight: '700', color: '#475569' },
    totalAmount: { fontSize: 18, fontWeight: '900', color: '#0071c2' },

    pointsBurnerBox: { backgroundColor: '#fffbeb', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#fde68a', marginBottom: 16 },
    pointsBurnerTitle: { fontSize: 15, fontWeight: '800', color: '#d97706' },
    pointsBurnerText: { fontSize: 13, color: '#b45309', flex: 1, marginRight: 16, lineHeight: 18 },

    inputGroup: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
    input: { height: 50, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', fontSize: 15, color: '#0f172a', fontWeight: '500', marginBottom: 8 },
    rowInputs: { flexDirection: 'row', marginTop: 8 },

    cardVisual: { backgroundColor: '#003580', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#003580', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
    cardLogo: { alignSelf: 'flex-end' },
    cardVisualNumber: { color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: 2, marginVertical: 20 },
    cardVisualFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    cardVisualName: { color: '#e2e8f0', fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    cardVisualExp: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },

    secureText: { textAlign: 'center', color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 8 },

    disclaimerBox: { 
        flexDirection: 'row', 
        backgroundColor: '#f1f5f9', 
        borderRadius: 12, 
        padding: 12, 
        marginTop: 24, 
        borderWidth: 1, 
        borderColor: '#e2e8f0',
        alignItems: 'flex-start'
    },
    disclaimerText: { 
        flex: 1, 
        fontSize: 12, 
        color: '#64748b', 
        lineHeight: 18,
        fontWeight: '500'
    },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
    payBtn: { backgroundColor: '#0071c2', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    payBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },

    guestNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', padding: 10, borderRadius: 8, marginBottom: 16, gap: 8, borderWidth: 1, borderColor: '#fde68a' },
    guestNoteText: { fontSize: 11, color: '#b45309', fontWeight: '700' },
    whatsappInputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },

    paymentSelector: { marginBottom: 24, gap: 10 },
    paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
    paymentMethodActive: { borderColor: '#0071c2', backgroundColor: '#f0f9ff' },
    paymentMethodText: { fontSize: 14, fontWeight: '700', color: '#475569' },

    fomoBanner: { backgroundColor: '#fef2f2', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    timerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    timerText: { fontSize: 18, fontWeight: '900', color: '#dc2626' },
    fomoText: { fontSize: 13, color: '#991b1b', lineHeight: 18, fontWeight: '500' },

    trustBadgesBox: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    trustBadgeItem: { alignItems: 'center', gap: 6 },
    trustBadgeLabel: { fontSize: 10, fontWeight: '800', color: '#64748b' }
});
