import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, StatusBar } from 'react-native';

interface Message {
    id: string;
    text: string;
    sender: string;
    time: string;
    isMe: boolean;
    color?: string;
}

export default function GroupChatScreen() {
    const router = useRouter();
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Herkese merhaba! Yarınki tur için çok heyecanlıyım.', sender: 'Ayşe Demir', time: '14:20', isMe: false, color: '#f59e0b' },
        { id: '2', text: 'Merhabalar Ayşe Hanım, sormayın ben de öyleyim. Balon turu saat kaçta başlayacak bilen var mı?', sender: 'Mehmet Yılmaz', time: '14:25', isMe: false, color: '#10b981' },
        { id: '3', text: 'Değerli misafirlerimiz, sabah 05:00\'te tüm otellerden transfer araçlarımız hareket edecektir. 👋', sender: 'Tur Rehberi (Ali)', time: '15:00', isMe: false, color: '#ef4444' },
        { id: '4', text: 'Harika, teşekkürler bilgilendirme için!', sender: 'Demo Kullanıcı', time: '15:05', isMe: true }
    ]);

    const sendMessage = () => {
        if (!inputText.trim()) return;
        
        const newMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'Demo Kullanıcı',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        
        setMessages([...messages, newMsg]);
        setInputText('');
        
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            
            {/* WhatsApp Stili Üst Çubuk */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <FontAwesome name="angle-left" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View style={styles.groupAvatar}>
                        <FontAwesome name="users" size={20} color="#fff" />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.groupTitle}>Kapadokya Turu Grubu</Text>
                        <Text style={styles.groupMembers}>24 Katılımcı, 1 Rehber</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.headerRightIcon}>
                    <FontAwesome name="ellipsis-v" size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* Arka Plan Desenimiz Olabilir (Sade Bırakıyoruz) */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
                <ImageBackground 
                    source={{ uri: 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg' }} 
                    style={styles.chatBackground}
                    imageStyle={{ opacity: 0.15 }}
                >
                    <ScrollView 
                        ref={scrollViewRef}
                        contentContainerStyle={styles.chatContainer} 
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateBadgeText}>Bugün</Text>
                        </View>

                        <View style={styles.systemMessage}>
                            <FontAwesome name="lock" size={10} color="#64748b" />
                            <Text style={styles.systemText}>Bu gruba gönderdiğiniz mesajlar şifrelenir ve tur bittikten sonra otomatik silinir.</Text>
                        </View>

                        {messages.map((msg) => (
                            <View key={msg.id} style={[styles.bubbleWrapper, msg.isMe ? styles.bubbleMe : styles.bubbleThem]}>
                                <View style={[styles.messageBubble, msg.isMe ? styles.messageMe : styles.messageThem]}>
                                    {!msg.isMe && (
                                        <Text style={[styles.senderName, { color: msg.color || '#0f172a' }]}>{msg.sender}</Text>
                                    )}
                                    <Text style={[styles.messageText, msg.isMe && styles.messageTextMe]}>{msg.text}</Text>
                                    
                                    <View style={styles.timeWrapper}>
                                        <Text style={[styles.timeText, msg.isMe && styles.timeTextMe]}>{msg.time}</Text>
                                        {msg.isMe && <FontAwesome name="check-circle" size={10} color="#bae6fd" style={{ marginLeft: 4 }} />}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Alt Mesaj Yazma Çubuğu */}
                    <View style={styles.inputArea}>
                        <TouchableOpacity style={styles.attachBtn}>
                            <FontAwesome name="plus" size={20} color="#0071c2" />
                        </TouchableOpacity>
                        
                        <View style={styles.inputBox}>
                            <TextInput 
                                style={styles.textInput}
                                placeholder="Mesaj yazın..."
                                placeholderTextColor="#94a3b8"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                            />
                            <TouchableOpacity style={styles.cameraBtn}>
                                <FontAwesome name="camera" size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {inputText.trim().length > 0 ? (
                            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                                <FontAwesome name="paper-plane" size={16} color="#fff" style={{ marginLeft: -2 }} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.micBtn}>
                                <FontAwesome name="microphone" size={18} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    groupAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0071c2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerInfo: { justifyContent: 'center' },
    groupTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
    groupMembers: { fontSize: 12, color: '#64748b', fontWeight: '500' },
    headerRightIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    keyboardView: { flex: 1 },
    chatBackground: { flex: 1, backgroundColor: '#e2e8f0' },
    chatContainer: { padding: 16, paddingBottom: 24 },

    dateBadge: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
    dateBadgeText: { fontSize: 12, color: '#475569', fontWeight: '700' },
    
    systemMessage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 24, marginHorizontal: 12 },
    systemText: { fontSize: 11, color: '#92400e', fontWeight: '600', marginLeft: 8, lineHeight: 16, flex: 1 },

    bubbleWrapper: { width: '100%', marginBottom: 12 },
    bubbleMe: { alignItems: 'flex-end' },
    bubbleThem: { alignItems: 'flex-start' },

    messageBubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    messageMe: { backgroundColor: '#0071c2', borderTopRightRadius: 4 },
    messageThem: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
    
    senderName: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
    messageText: { fontSize: 15, color: '#334155', lineHeight: 22 },
    messageTextMe: { color: '#fff' },

    timeWrapper: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4, opacity: 0.8 },
    timeText: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
    timeTextMe: { color: '#baebfa' },

    inputArea: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
    attachBtn: { width: 40, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    
    inputBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, paddingLeft: 16, paddingRight: 8, minHeight: 44, maxHeight: 120 },
    textInput: { flex: 1, fontSize: 15, color: '#0f172a', paddingVertical: 10 },
    cameraBtn: { width: 36, height: 44, justifyContent: 'center', alignItems: 'center' },

    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0071c2', justifyContent: 'center', alignItems: 'center', marginLeft: 12, shadowColor: '#0071c2', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4 },
    micBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginLeft: 12, shadowColor: '#10b981', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4 }
});
