import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatsScreen() {
    const router = useRouter();

    const chatRooms = [
        {
            id: 1,
            title: 'Kapadokya VIP Balon Turu',
            date: '15 Nisan 2026',
            guests: 15,
            status: 'active',
            lastMessagePrefix: '🎤 ',
            lastMessageText: 'Değerli Misafirlerimiz...',
            lastMessageAuthor: '(Rehber)'
        },
        {
            id: 2,
            title: 'Büyük İtalya Turu',
            date: '5 Nisan 2026',
            guests: 45,
            status: 'archived',
            lastMessagePrefix: '',
            lastMessageText: 'Harika bir turdu, teşekkürler!',
            lastMessageAuthor: '(Ayşe T.)'
        }
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>OPERASYON PANELİ</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Tur Operasyon & Chat Merkezi Banner */}
                <LinearGradient
                    colors={['#ff5f00', '#e03a00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroBanner}
                >
                    <Ionicons name="chatbubbles" size={100} color="rgba(255,255,255,0.15)" style={styles.bannerIconBg} />
                    
                    <Text style={styles.heroTitle}>Tur Operasyon & Chat Merkezi</Text>
                    <Text style={styles.heroSubtitle}>
                        Tur başlangıcından 24 saat önce otomatik açılan ve bitiminden 24 saat sonra salt okunur arşivlenen müşteri gruplarınızı buradan yönetin. Hızlı duyurular gönderin ve toplanma noktaları belirleyin.
                    </Text>
                </LinearGradient>

                <View style={styles.cardsContainer}>
                    {chatRooms.map((room) => {
                        const isActive = room.status === 'active';

                        return (
                            <View 
                                key={room.id} 
                                style={[styles.chatCard, isActive ? styles.chatCardActive : styles.chatCardArchived]}
                            >
                                {/* Üst Kısım: Başlık ve Rozet */}
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                        <Text style={[styles.tourTitle, !isActive && { color: '#475569' }]} numberOfLines={1}>
                                            {room.title}
                                        </Text>
                                    </View>
                                    
                                    <View style={[styles.statusBadge, isActive ? styles.badgeLive : styles.badgeReadonly]}>
                                        {isActive && <View style={styles.dot} />}
                                        <Text style={[styles.statusBadgeText, isActive ? styles.badgeTextLive : styles.badgeTextReadonly]}>
                                            {isActive ? 'CANLI SOHBET' : 'SALT OKUNUR'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Alt Başlık: Tarih & Misafir Sayısı */}
                                <Text style={styles.tourDetails}>
                                    Tarih: {room.date} • {room.guests} Misafir
                                </Text>

                                {/* Son Mesaj Kutusu */}
                                <View style={styles.lastMessageBox}>
                                    <Text style={styles.lastMessageLabel} numberOfLines={2}>
                                        <Text style={isActive ? styles.labelActive : styles.labelArchived}>Son Mesaj: </Text>
                                        <Text style={styles.messageContent}>{`"${room.lastMessagePrefix}${room.lastMessageText}" `}</Text>
                                        <Text style={styles.messageAuthor}>{room.lastMessageAuthor}</Text>
                                    </Text>
                                </View>

                                {/* Alt Kısım: Durum ve Buton */}
                                <View style={styles.cardFooter}>
                                    <Text style={styles.statusLabel}>
                                        DURUM: <Text style={isActive ? styles.statusActiveText : styles.statusArchivedText}>
                                            {isActive ? 'AKTİF' : 'ARŞİVLENDİ'}
                                        </Text>
                                    </Text>

                                    <TouchableOpacity style={[styles.actionBtn, isActive ? styles.btnActive : styles.btnArchived]}>
                                        <Text style={styles.actionBtnText}>
                                            {isActive ? 'Sohbete Katıl' : 'Arşivi Gör'}
                                        </Text>
                                        {isActive && <FontAwesome name="arrow-right" size={12} color="#fff" style={{ marginLeft: 6 }} />}
                                    </TouchableOpacity>
                                </View>

                            </View>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 8, marginLeft: -8 },
    headerBarTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
    
    scrollContent: { padding: 20, paddingBottom: 60 },

    heroBanner: { borderRadius: 20, padding: 24, overflow: 'hidden', position: 'relative', marginBottom: 24, shadowColor: '#ea580c', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
    bannerIconBg: { position: 'absolute', right: -20, bottom: -20, transform: [{ rotate: '-15deg' }] },
    heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 12, letterSpacing: -0.5 },
    heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', lineHeight: 20 },

    cardsContainer: { gap: 16 },

    chatCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    chatCardActive: { borderWidth: 2, borderColor: '#f97316' },
    chatCardArchived: { borderWidth: 1, borderColor: '#e2e8f0' },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    tourTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeLive: { backgroundColor: '#ffedd5' },
    badgeReadonly: { backgroundColor: '#f1f5f9' },
    
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ea580c', marginRight: 6 },
    statusBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    badgeTextLive: { color: '#ea580c' },
    badgeTextReadonly: { color: '#64748b' },

    tourDetails: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 16 },

    lastMessageBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 20 },
    lastMessageLabel: { fontSize: 13, lineHeight: 18 },
    labelActive: { fontWeight: '900', color: '#ea580c' },
    labelArchived: { fontWeight: '900', color: '#64748b' },
    messageContent: { color: '#334155', fontWeight: '500' },
    messageAuthor: { color: '#64748b', fontStyle: 'italic' },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    statusLabel: { fontSize: 11, fontWeight: '900', color: '#cbd5e1', letterSpacing: 0.5 },
    statusActiveText: { color: '#10b981' },
    statusArchivedText: { color: '#94a3b8' },

    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    btnActive: { backgroundColor: '#ea580c', shadowColor: '#ea580c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    btnArchived: { backgroundColor: '#475569' },
    actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' }
});
