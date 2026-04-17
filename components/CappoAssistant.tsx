import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CappoAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', text: 'Maaşallah! Ben Tourkia akıllı asistanınız Cappo. Turları bulmakta, biletlerini getirmekte veya sayfalara gitmekte sana yardımcı olabilirim. Ne yapmak istersin?', isBot: true },
    ]);
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleAssistant = () => {
        if (!isOpen) {
            setIsOpen(true);
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => setIsOpen(false));
        }
    };

    const handleAction = (action: string) => {
        if (action === 'explore') {
            router.push('/(tabs)/explore');
            toggleAssistant();
        } else if (action === 'tickets') {
            router.push('/offline-tickets');
            toggleAssistant();
        } else if (action === 'orders') {
            router.push('/past-orders');
            toggleAssistant();
        }
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newUserMsg = { id: Date.now().toString(), text: inputText, isBot: false };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');

        // Simple mock AI logic
        setTimeout(() => {
            const lowerText = newUserMsg.text.toLowerCase();
            let responseText = "Anlayamadım. 'Bilet', 'Sipariş' veya 'Keşfet' demeyi deneyebilirsin.";
            
            if (lowerText.includes('bilet')) {
                responseText = "Hemen çevrimdışı biletlerine götürüyorum!";
                setTimeout(() => handleAction('tickets'), 1500);
            } else if (lowerText.includes('sipariş')) {
                responseText = "Geçmiş siparişlerini açıyorum...";
                setTimeout(() => handleAction('orders'), 1500);
            } else if (lowerText.includes('tur') || lowerText.includes('keşfet')) {
                responseText = "Seni yeni maceraları keşfedeceğin sayfaya alıyorum!";
                setTimeout(() => handleAction('explore'), 1500);
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), text: responseText, isBot: true }]);
        }, 800);
    };

    return (
        <>
            {/* Inline Trigger - Başlıkta Gösterim */}
            <TouchableOpacity style={styles.fab} onPress={toggleAssistant} activeOpacity={0.8}>
                <View style={styles.fabIconBg}>
                    <Text style={styles.cappoInsideText}>Cappo</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                </View>
                <Text style={styles.assistantLabel}>Yapay Zeka{"\n"}Asistanı</Text>
            </TouchableOpacity>

            {/* Asistan Modalı */}
            <Modal transparent visible={isOpen} animationType="none" onRequestClose={toggleAssistant}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
                    <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={toggleAssistant} />
                    
                    <Animated.View style={[
                        styles.container, 
                        { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }] }
                    ]}>
                        
                        {/* Başlık */}
                        <View style={styles.header}>
                            <View style={styles.headerTitleRow}>
                                <View style={styles.botAvatar}>
                                    <FontAwesome name="android" size={24} color="#008cb3" />
                                </View>
                                <View>
                                    <Text style={styles.title}>Cappo (AI)</Text>
                                    <Text style={styles.statusText}>Çevrimiçi</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={toggleAssistant} style={styles.closeBtn}>
                                <FontAwesome name="close" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Sohbet Geçmişi */}
                        <ScrollView style={styles.chatArea} showsVerticalScrollIndicator={false}>
                            {messages.map((msg) => (
                                <View key={msg.id} style={[styles.bubbleWrap, msg.isBot ? styles.bubbleBot : styles.bubbleUser]}>
                                    <Text style={[styles.msgText, msg.isBot ? styles.msgTextBot : styles.msgTextUser]}>
                                        {msg.text}
                                    </Text>
                                </View>
                            ))}

                            {/* Hızlı Aksiyon Yonga (Chip)ları */}
                            {messages.length === 1 && (
                                <View style={styles.actionsBox}>
                                    <Text style={styles.actionsHint}>Hızlıca yönlendireyim:</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('explore')}>
                                            <FontAwesome name="compass" size={14} color="#008cb3" />
                                            <Text style={styles.chipText}>Turları Keşfet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('tickets')}>
                                            <FontAwesome name="qrcode" size={14} color="#008cb3" />
                                            <Text style={styles.chipText}>Biletlerim</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('orders')}>
                                            <FontAwesome name="suitcase" size={14} color="#008cb3" />
                                            <Text style={styles.chipText}>Siparişlerim</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )}
                        </ScrollView>

                        {/* Mesaj Yazma Alanı */}
                        <View style={styles.inputArea}>
                            <TextInput 
                                style={styles.input} 
                                value={inputText} 
                                onChangeText={setInputText}
                                placeholder="Cappo'ya bir şey yaz..."
                                placeholderTextColor="#94a3b8"
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                                <FontAwesome name="paper-plane" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabIconBg: {
        width: '100%',
        height: '100%',
        borderRadius: 19,
        backgroundColor: '#febb02', // Altın sarısı (Booking stili ile uyumlu)
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    cappoInsideText: {
        color: '#003580',
        fontSize: 8,
        fontWeight: '900',
    },
    assistantLabel: {
        position: 'absolute',
        bottom: -24,
        fontSize: 9,
        fontWeight: '900',
        color: '#fff',
        width: 80,
        textAlign: 'center',
        lineHeight: 10,
        letterSpacing: -0.2,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#ef4444',
        width: 14,
        height: 14,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        zIndex: 10,
    },
    badgeText: { color: '#fff', fontSize: 7, fontWeight: '900' },
    
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.4)' },
    container: { backgroundColor: '#f8fafc', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 15 },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    botAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    title: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    statusText: { fontSize: 12, fontWeight: '700', color: '#10b981', marginTop: 2 },
    closeBtn: { width: 40, height: 40, backgroundColor: '#f1f5f9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    
    chatArea: { flex: 1, padding: 20 },
    bubbleWrap: { maxWidth: '80%', padding: 16, borderRadius: 20, marginBottom: 12 },
    bubbleBot: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    bubbleUser: { alignSelf: 'flex-end', backgroundColor: '#008cb3', borderBottomRightRadius: 4 },
    msgText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    msgTextBot: { color: '#334155' },
    msgTextUser: { color: '#fff' },
    
    actionsBox: { marginTop: 12, marginBottom: 24 },
    actionsHint: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginBottom: 12, marginLeft: 4 },
    chipScroll: { flexDirection: 'row' },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#bae6fd', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginRight: 12 },
    chipText: { fontSize: 13, fontWeight: '800', color: '#008cb3', marginLeft: 8 },
    
    inputArea: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    input: { flex: 1, backgroundColor: '#f1f5f9', paddingHorizontal: 20, height: 50, borderRadius: 25, fontSize: 15, fontWeight: '500', color: '#0f172a' },
    sendBtn: { width: 50, height: 50, backgroundColor: '#008cb3', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 12, shadowColor: '#008cb3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }
});
