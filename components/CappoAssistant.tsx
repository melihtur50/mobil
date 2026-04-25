import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { AnimatedButton } from './common/AnimatedButton';

export default function CappoAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', text: 'Maaşallah! Ben Tourkia akıllı asistanınız Cappo. Turları bulmakta, biletlerini getirmekte veya sayfalara gitmekte sana yardımcı olabilirim. Ne yapmak istersin?', isBot: true },
    ]);
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    // Floating Pulse Animation
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const startPulse = () => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              })
            ])
          ).start();
        };
        startPulse();
    }, []);

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
            {/* Pulsing FAB Trigger */}
            <View style={{ alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity style={styles.fab} onPress={toggleAssistant} activeOpacity={0.8}>
                        <View style={styles.fabIconBg}>
                            <Text style={styles.cappoInsideText}>Cappo</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                <Text style={styles.aiLabel}>Yapay Zeka</Text>
            </View>

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
                                    <FontAwesome name="android" size={24} color={Colors.light.secondary} />
                                </View>
                                <View>
                                    <Text style={styles.title}>Cappo (AI)</Text>
                                    <Text style={styles.statusText}>Sizin için burada</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={toggleAssistant} style={styles.closeBtn}>
                                <FontAwesome name="close" size={20} color={Colors.light.textMuted} />
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

                            {/* Hızlı Aksiyonlar */}
                            {messages.length === 1 && (
                                <View style={styles.actionsBox}>
                                    <Text style={styles.actionsHint}>Nasıl yardımcı olayım?</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('explore')}>
                                            <FontAwesome name="compass" size={14} color={Colors.light.secondary} />
                                            <Text style={styles.chipText}>Keşfet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('tickets')}>
                                            <FontAwesome name="ticket" size={14} color={Colors.light.secondary} />
                                            <Text style={styles.chipText}>Biletler</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.chip} onPress={() => handleAction('orders')}>
                                            <FontAwesome name="history" size={14} color={Colors.light.secondary} />
                                            <Text style={styles.chipText}>Geçmiş</Text>
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
                                placeholderTextColor={Colors.light.textMuted}
                                onSubmitEditing={sendMessage}
                            />
                            <AnimatedButton style={styles.sendBtn} onPress={sendMessage} haptic="medium">
                                <FontAwesome name="paper-plane" size={18} color={Colors.light.primary} />
                            </AnimatedButton>
                        </View>

                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.secondary,
        ...Shadows.md,
    },
    fabIconBg: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cappoInsideText: {
        color: Colors.light.primary,
        fontSize: 10,
        fontWeight: '900',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: Colors.light.accent,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    badgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
    
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 26, 51, 0.6)' },
    container: { backgroundColor: Colors.light.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '85%', ...Shadows.lg },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    botAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.light.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    title: { fontSize: 18, fontWeight: '900', color: Colors.light.primary },
    statusText: { fontSize: 13, fontWeight: '700', color: Colors.light.success, marginTop: 2 },
    closeBtn: { width: 40, height: 40, backgroundColor: Colors.light.background, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    
    chatArea: { flex: 1, padding: Spacing.lg },
    bubbleWrap: { maxWidth: '85%', padding: 16, borderRadius: 20, marginBottom: 16 },
    bubbleBot: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4, ...Shadows.sm },
    bubbleUser: { alignSelf: 'flex-end', backgroundColor: Colors.light.primary, borderBottomRightRadius: 4 },
    msgText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    msgTextBot: { color: Colors.light.text },
    msgTextUser: { color: '#fff' },
    
    actionsBox: { marginTop: 12, marginBottom: 24 },
    actionsHint: { fontSize: 12, fontWeight: '700', color: Colors.light.textMuted, marginBottom: 12 },
    chipScroll: { flexDirection: 'row' },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.light.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.md, marginRight: 12 },
    chipText: { fontSize: 13, fontWeight: '800', color: Colors.light.primary, marginLeft: 8 },
    
    inputArea: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.light.border },
    input: { flex: 1, backgroundColor: Colors.light.background, paddingHorizontal: 20, height: 54, borderRadius: 27, fontSize: 15, fontWeight: '600', color: Colors.light.primary },
    sendBtn: { width: 54, height: 54, backgroundColor: Colors.light.secondary, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginLeft: 12, ...Shadows.md },
    aiLabel: {
        fontSize: 7.5,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        marginTop: 4,
        letterSpacing: 0.5,
    }
});
