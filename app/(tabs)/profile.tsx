import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, userRole, login } = useAuth();
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false
            })
        ).start();
    }, []);

    const shimmerPos = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 600]
    });

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

    const agencyMenuItems = [
        { title: 'Genel Bakış', icon: 'dashboard', color: '#0f172a', route: '/dashboard' },
        { title: 'Rezervasyonlar', icon: 'check-square-o', color: '#3b82f6', route: '/bookings' },
        { title: 'Turlarım & Yönetim', icon: 'globe', color: '#10b981', route: '/my-tours' },
        { title: 'Operasyon & Chat', icon: 'comments-o', color: '#f59e0b', route: '/chats' },
        { title: 'Hızlı Tur Satışı', icon: 'plus', color: '#6366f1', route: '/quick-book' },
        { title: 'Finans & Fatura', icon: 'money', color: '#14b8a6', route: '/finance' },
        { title: 'B2B Kampanyalar', icon: 'star-o', color: '#f43f5e', route: '/deals' },
        { title: 'İçerik (Blog Yönetimi)', icon: 'edit', color: '#4f46e5', route: '/blog' }
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} bounces={false}>

                <View style={styles.header}>
                    <Image
                        source={{ uri: userRole === 'agency' ? 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=200&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{userRole === 'agency' ? 'Demo Acenta' : 'Demo Kullanıcı'}</Text>
                        <Text style={styles.email}>{userRole === 'agency' ? 'acenta@tourkia.com' : 'demo@tourkia.com'}</Text>
                        
                        {/* HIZLI ROL DEĞİŞTİRİCİ - TEST İÇİN */}
                        <TouchableOpacity 
                            style={{ marginTop: 8, backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' }}
                            onPress={() => login(userRole === 'agency' ? 'customer' : 'agency')}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#008cb3' }}>
                                Rol Değiştir: {userRole === 'agency' ? 'Acenta 🔄' : 'Müşteri 🔄'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <FontAwesome name="pencil" size={16} color="#008cb3" />
                    </TouchableOpacity>
                </View>

                {/* VIP Digital Card - Apple Wallet Style */}
                {userRole === 'customer' && (
                    <TouchableOpacity 
                        style={styles.vipContainer} 
                        activeOpacity={0.9}
                        onPress={() => router.push('/vip-privileges')}
                    >
                        <LinearGradient
                            colors={['#1e293b', '#0f172a']}
                            style={styles.vipCard}
                        >
                            {/* Gold Shimmer Overlay */}
                            <Animated.View style={[styles.shimmerBox, { transform: [{ translateX: shimmerPos }] }]}>
                                <LinearGradient
                                    colors={['transparent', 'rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.1)', 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.shimmerGradient}
                                />
                            </Animated.View>

                            <View style={styles.vipHeader}>
                                <Text style={styles.vipBrand}>TOURKIA <Text style={{fontWeight: '300'}}>VIP</Text></Text>
                                <View style={styles.vipChip} />
                            </View>

                            <View style={styles.vipBody}>
                                <Text style={styles.vipLabel}>Ayrıcalıklı Misafir</Text>
                                <Text style={styles.vipName}>DEMO KULLANICI</Text>
                                <Text style={styles.vipStatus}>PLATINUM MEMBER</Text>
                            </View>

                            <View style={styles.vipFooter}>
                                <View>
                                    <Text style={styles.vipFooterLabel}>VIP ID</Text>
                                    <Text style={styles.vipFooterValue}>TK-9921-2024</Text>
                                </View>
                                <FontAwesome name="qrcode" size={32} color="rgba(251, 191, 36, 0.8)" />
                            </View>
                            
                            <View style={styles.vipGoldBorder} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{userRole === 'agency' ? 'Acenta Ayarları' : 'Hesap ve İşlemler'}</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/edit-profile')}>
                        <View style={styles.menuIconBox}>
                            <FontAwesome name="user-o" size={16} color="#008cb3" />
                        </View>
                        <Text style={styles.menuText}>{userRole === 'agency' ? 'Kurumsal Profil' : 'Kişisel Bilgilerim'}</Text>
                        <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                    </TouchableOpacity>

                    {userRole === 'customer' && (
                        <>
                            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/offline-tickets')}>
                                <View style={styles.menuIconBox}>
                                    <FontAwesome name="qrcode" size={16} color="#008cb3" />
                                </View>
                                <Text style={styles.menuText}>Çevrimdışı Biletlerim</Text>
                                <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/past-orders')}>
                                <View style={styles.menuIconBox}>
                                    <FontAwesome name="suitcase" size={16} color="#64748b" />
                                </View>
                                <Text style={styles.menuText}>Geçmiş Siparişlerim</Text>
                                <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Acenta Paneli Menüsü - SADECE ACENTA */}
                {userRole === 'agency' && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>ACENTA BİLGİ & YÖNETİM</Text>

                            <TouchableOpacity 
                                style={[styles.menuItem, { backgroundColor: '#fff7ed', borderRadius: 12, paddingHorizontal: 12 }]} 
                                onPress={() => router.push('/waiter-dashboard')}
                            >
                                <View style={[styles.menuIconBox, { backgroundColor: '#ffedd5' }]}>
                                    <FontAwesome name="cutlery" size={16} color="#ea580c" />
                                </View>
                                <Text style={[styles.menuText, { color: '#ea580c' }]}>Garson Paneli (Restoran)</Text>
                                <FontAwesome name="chevron-right" size={12} color="#fed7aa" style={styles.chevron} />
                            </TouchableOpacity>

                            {agencyMenuItems.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.menuItem} 
                                    onPress={() => item.route && router.push(item.route as any)}
                                >
                                    <View style={styles.menuIconBox}>
                                        <FontAwesome name={item.icon as any} size={16} color={item.color} />
                                    </View>
                                    <Text style={styles.menuText}>{item.title}</Text>
                                    <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                <View style={styles.divider} />

                <View style={[styles.section, { marginBottom: 40 }]}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <FontAwesome name="sign-out" size={16} color="#ef4444" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    container: { flex: 1 },
    
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24, backgroundColor: '#fff' },
    avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#f1f5f9' },
    headerInfo: { flex: 1, marginLeft: 16 },
    name: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
    email: { fontSize: 14, color: '#64748b', fontWeight: '500' },
    editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f9ff', alignItems: 'center', justifyContent: 'center' },
    
    loyaltyWrapper: { paddingHorizontal: 24, marginBottom: 24 },
    loyaltyCard: { borderRadius: 24, padding: 20, shadowColor: '#008cb3', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
    loyaltyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    loyaltyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    loyaltyBadgeText: { fontSize: 10, fontWeight: '900', color: '#005e85', textTransform: 'uppercase' },
    pointsText: { fontSize: 14, fontWeight: '900', color: '#fff' },
    loyaltyTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
    loyaltyDesc: { fontSize: 14, color: '#e0f2fe', fontWeight: '600' },
    
    section: { paddingHorizontal: 24, marginBottom: 8 },
    sectionTitle: { fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    menuText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#334155' },
    chevron: { marginLeft: 'auto' },
    
    divider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 24, marginVertical: 24 },
    
    // VIP Card Styles
    vipContainer: { paddingHorizontal: 24, marginBottom: 32 },
    vipCard: { height: 200, borderRadius: 20, padding: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
    shimmerBox: { position: 'absolute', top: 0, left: 0, width: 300, height: '200%', transform: [{ rotate: '45deg' }] },
    shimmerGradient: { width: '100%', height: '100%' },
    vipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    vipBrand: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
    vipChip: { width: 40, height: 30, borderRadius: 6, backgroundColor: 'rgba(251, 191, 36, 0.3)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.5)' },
    vipBody: { flex: 1, justifyContent: 'center' },
    vipLabel: { color: '#fbbf24', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
    vipName: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 4 },
    vipStatus: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
    vipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    vipFooterLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', marginBottom: 2 },
    vipFooterValue: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
    vipGoldBorder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: '#fbbf24', opacity: 0.8 },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 16, borderRadius: 16 },
    logoutText: { fontSize: 15, fontWeight: '800', color: '#ef4444' }
});
