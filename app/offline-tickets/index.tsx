import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { OfflineTicket, clearOfflineTickets, getOfflineTickets, saveTicketOffline } from '../../services/offlineStorage';
import { fetchTours } from '../../services/tourApi';

export default function OfflineTicketsScreen() {
    const [tickets, setTickets] = useState<OfflineTicket[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await getOfflineTickets();
            // Test için eğer hiç bilet yoksa sahte bir tane oluşturalım:
            if (data.length === 0) {
                const tours = await fetchTours();
                if (tours.length > 0) {
                    await saveTicketOffline(tours[0], 'Demo Kullanıcı', 2);
                    const newData = await getOfflineTickets();
                    setTickets(newData);
                } else {
                    setTickets([]);
                }
            } else {
                setTickets(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleClear = async () => {
        await clearOfflineTickets();
        setTickets([]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {/* Go back */ }} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={16} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Çevrimdışı Biletlerim</Text>
                <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                    <FontAwesome name="trash-o" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBox}>
                    <FontAwesome name="wifi" size={16} color="#0369a1" />
                    <Text style={styles.infoText}>Bu biletleri internetin çekmediği müze veya dağ turu gibi yerlerde rehbere göstererek kullanabilirsiniz.</Text>
                </View>

                {loading ? (
                    <Text style={{ textAlign: 'center', marginTop: 40 }}>Yükleniyor...</Text>
                ) : tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <View key={ticket.id} style={styles.ticketCard}>
                            {/* Bilet Üst Kısım (Bilgiler) */}
                            <View style={styles.ticketTop}>
                                <Text style={styles.tourTitle}>{ticket.tour.title}</Text>
                                <View style={styles.ticketRow}>
                                    <View>
                                        <Text style={styles.label}>Yolcu</Text>
                                        <Text style={styles.value}>{ticket.travelerInfo.name}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Kişi</Text>
                                        <Text style={styles.value}>{ticket.travelerInfo.guests} Yetişkin</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Durum</Text>
                                        <Text style={[styles.value, { color: '#16a34a' }]}>Aktif</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Kesik Çizgi */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.notchLeft} />
                                <View style={styles.dividerLine} />
                                <View style={styles.notchRight} />
                            </View>

                            {/* Bilet Alt Kısım (QR & Harita Butonu) */}
                            <View style={styles.ticketBottom}>
                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value={ticket.qrCodeData}
                                        size={120}
                                        backgroundColor="white"
                                        color="#0f172a"
                                    />
                                </View>
                                <Text style={styles.ticketIdText}>Bilet No: {ticket.id.substring(0, 8).toUpperCase()}</Text>

                                {ticket.tour.meetingPoint ? (
                                    <TouchableOpacity 
                                        style={styles.offlineMapBtn}
                                        onPress={() => Linking.openURL(`https://maps.google.com/?q=${ticket.tour.meetingPoint?.lat},${ticket.tour.meetingPoint?.lng}`)}
                                    >
                                        <FontAwesome name="map-marker" size={16} color="#008cb3" />
                                        <Text style={styles.offlineMapText}>Buluşma Noktasına Yol Tarifi Al</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.offlineMapBtn}>
                                        <FontAwesome name="map-o" size={16} color="#008cb3" />
                                        <Text style={styles.offlineMapText}>Çevrimdışı Haritada Gör</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <FontAwesome name="ticket" size={48} color="#cbd5e1" />
                        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b', fontWeight: '600' }}>Çevrimdışı biletin bulunmuyor.</Text>
                    </View>
                )}

                <View style={{ height: 60 }} />
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
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0f172a',
    },
    clearBtn: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#e0f2fe',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#bae6fd',
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 13,
        color: '#0369a1',
        fontWeight: '600',
        lineHeight: 18,
    },
    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        overflow: 'hidden',
    },
    ticketTop: {
        padding: 24,
        backgroundColor: '#fff',
    },
    tourTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 20,
    },
    ticketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: '800',
        color: '#334155',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#fff',
    },
    notchLeft: {
        width: 20,
        height: 40,
        backgroundColor: '#f8fafc',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginLeft: -10,
    },
    dividerLine: {
        flex: 1,
        height: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        marginHorizontal: 10,
    },
    notchRight: {
        width: 20,
        height: 40,
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginRight: -10,
    },
    ticketBottom: {
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    qrContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    ticketIdText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748b',
        letterSpacing: 2,
        marginBottom: 24,
    },
    offlineMapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f9ff',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    offlineMapText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#008cb3',
        marginLeft: 8,
    }
});
