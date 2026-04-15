import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, userRole } = useAuth();

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} bounces={false}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>Demo Kullanıcı</Text>
                        <Text style={styles.email}>demo@tourkia.com</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <FontAwesome name="pencil" size={16} color="#008cb3" />
                    </TouchableOpacity>
                </View>

                {/* Loyalty Program */}
                <View style={styles.loyaltyWrapper}>
                    <LinearGradient
                        colors={['#008cb3', '#0369a1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.loyaltyCard}
                    >
                        <View style={styles.loyaltyTop}>
                            <View style={styles.loyaltyBadge}>
                                <FontAwesome name="star" size={12} color="#005e85" style={{ marginRight: 4 }} />
                                <Text style={styles.loyaltyBadgeText}>Sadakat Programı</Text>
                            </View>
                            <Text style={styles.pointsText}>1.450 Puan</Text>
                        </View>
                        <Text style={styles.loyaltyTitle}>TourkiaPuan™</Text>
                        <Text style={styles.loyaltyDesc}>Mevcut Bakiyeniz: ₺145 İndirim!</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hesap ve İşlemler</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/edit-profile')}>
                        <View style={styles.menuIconBox}>
                            <FontAwesome name="user-o" size={16} color="#008cb3" />
                        </View>
                        <Text style={styles.menuText}>Kişisel Bilgilerim</Text>
                        <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                    </TouchableOpacity>

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
                </View>

                <View style={styles.divider} />

                {userRole === 'agency' && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Acenta Paneli</Text>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBox, { backgroundColor: '#fff7ed' }]}>
                                    <FontAwesome name="upload" size={16} color="#f97316" />
                                </View>
                                <Text style={styles.menuText}>Yüklediğim Turlar</Text>
                                <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBox, { backgroundColor: '#fff7ed' }]}>
                                    <FontAwesome name="building-o" size={16} color="#f97316" />
                                </View>
                                <Text style={styles.menuText}>Acenta Bilgilerim</Text>
                                <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={styles.chevron} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />
                    </>
                )}

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
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#f1f5f9',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loyaltyWrapper: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    loyaltyCard: {
        borderRadius: 24,
        padding: 20,
        shadowColor: '#008cb3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    loyaltyTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    loyaltyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    loyaltyBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#005e85',
        textTransform: 'uppercase',
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#fff',
    },
    loyaltyTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
    },
    loyaltyDesc: {
        fontSize: 14,
        color: '#e0f2fe',
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    chevron: {
        marginLeft: 'auto',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 24,
        marginVertical: 24,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        paddingVertical: 16,
        borderRadius: 16,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ef4444',
    }
});
