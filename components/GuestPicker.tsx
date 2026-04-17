import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface GuestPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (adults: number, children: number) => void;
  initialAdults?: number;
  initialChildren?: number;
}

export default function GuestPicker({
  visible,
  onClose,
  onConfirm,
  initialAdults = 2,
  initialChildren = 0,
}: GuestPickerProps) {
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleManualEntry = (field: string, currentVal: number) => {
    setEditingField(field);
    setTempValue(currentVal.toString());
  };

  const saveManualEntry = () => {
    const val = parseInt(tempValue) || 0;
    if (editingField === 'adults') setAdults(Math.max(1, val));
    if (editingField === 'children') setChildren(Math.max(0, val));
    setEditingField(null);
  };

  const CounterRow = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    field 
  }: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void, 
    min?: number,
    field: string
  }) => (
    <View style={styles.counterRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.rowLabel}>{label}</Text>
        {label === 'Yetişkin' && <Text style={styles.rowSubLabel}>13 yaş ve üstü</Text>}
        {label === 'Çocuk' && <Text style={styles.rowSubLabel}>0 - 12 yaş</Text>}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlBtn, value <= min && styles.controlBtnDisabled]} 
          onPress={() => value > min && onChange(value - 1)}
          disabled={value <= min}
        >
          <FontAwesome name="minus" size={14} color={value <= min ? '#cbd5e1' : '#003580'} />
        </TouchableOpacity>

        {editingField === field ? (
          <TextInput
            style={styles.manualInput}
            value={tempValue}
            onChangeText={setTempValue}
            keyboardType="number-pad"
            autoFocus
            onBlur={saveManualEntry}
            onSubmitEditing={saveManualEntry}
          />
        ) : (
          <TouchableOpacity onPress={() => handleManualEntry(field, value)} style={styles.valueDisplay}>
            <Text style={styles.valueText}>{value}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={() => onChange(value + 1)}
        >
          <FontAwesome name="plus" size={14} color="#003580" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <SafeAreaView style={styles.modalContent}>
            {/* Header */}
            <LinearGradient
              colors={['#003580', '#005f9e']}
              style={styles.header}
            >
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <FontAwesome name="times" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Kişi ve Oda Sayısı</Text>
              <View style={{ width: 40 }} />
            </LinearGradient>

            <View style={styles.body}>
              <CounterRow 
                label="Yetişkin" 
                value={adults} 
                onChange={setAdults} 
                min={1} 
                field="adults"
              />
              <View style={styles.divider} />
              <CounterRow 
                label="Çocuk" 
                value={children} 
                onChange={setChildren} 
                field="children"
              />
              
              <View style={styles.infoBox}>
                <FontAwesome name="info-circle" size={16} color="#0071c2" />
                <Text style={styles.infoText}>
                  Çocuklu rezervasyonlarda tur ekibi sizinle iletişime geçerek yaş teyidi yapabilir.
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={() => {
                  onConfirm(adults, children);
                  onClose();
                }}
              >
                <Text style={styles.confirmBtnText}>Uygula ve Devam Et</Text>
              </TouchableOpacity>
              <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 24,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  labelContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  rowSubLabel: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  controlBtnDisabled: {
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  valueDisplay: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  manualInput: {
    width: 40,
    height: 40,
    fontSize: 20,
    fontWeight: '900',
    color: '#003580',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#003580',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  confirmBtn: {
    backgroundColor: '#003580',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#003580',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
