import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Tour, getDisplayPrice, formatCurrency } from '../../services/tourApi';
import { useRouter } from 'expo-router';

const { height: SCREEN_H } = Dimensions.get('window');

interface QuickPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  tour: Tour | null;
}

export const QuickPreviewModal: React.FC<QuickPreviewModalProps> = ({ visible, onClose, tour }) => {
  const router = useRouter();
  
  if (!tour) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalBackdrop} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: tour.image }} style={styles.sheetImage} />
            <View style={styles.sheetBody}>
              <Text style={styles.sheetTitle}>{tour.title}</Text>
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
                  onClose();
                  router.push(`/tour/${tour.id}`);
                }}
              >
                <Text style={styles.sheetPrimaryBtnText}>Paketi İncele & Rezerve Et</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  sheetPrimaryBtn: { backgroundColor: '#0071c2', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  sheetPrimaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
