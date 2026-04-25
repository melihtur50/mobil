import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useLocalSearchParams } from 'expo-router';

export default function ExploreScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const isComboView = type === 'combo';
  
  const [destination, setDestination] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [guests, setGuests] = useState('1');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>

        {/* Header */}
        <View style={[styles.header, isComboView && { backgroundColor: '#f97316' }]}>
          <Text style={styles.headerTitle}>
            {isComboView ? '🔥 Özel Kombo Paketler' : 'Hayalindeki Turu Bul'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isComboView 
              ? 'Havalimanına özel indirimli Tur + Yemek paketlerini keşfet.' 
              : 'Doğru filtrelerle en uygun tatili saniyeler içinde planla.'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* 1. Rota/Destinasyon */}
          <Text style={styles.label}>Gidilecek Yer</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="map-marker" size={20} color="#008cb3" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nereye gitmek istersin? (Örn: Kapadokya)"
              placeholderTextColor="#94a3b8"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* 2. Tarih */}
          <Text style={styles.label}>Tarih</Text>
          <TouchableOpacity style={styles.inputContainer}>
            <FontAwesome name="calendar" size={18} color="#008cb3" style={styles.icon} />
            <Text style={styles.inputTextPlaceholder}>Gidiş Tarihi Seçin</Text>
            <FontAwesome name="chevron-down" size={14} color="#cbd5e1" style={styles.rightIcon} />
          </TouchableOpacity>

          {/* 3. Bütçe */}
          <Text style={styles.label}>Fiyat Aralığı (₺)</Text>
          <View style={styles.budgetRow}>
            <View style={[styles.inputContainer, styles.budgetInputBox]}>
              <Text style={styles.currencyPrefix}>Min</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="0"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={budgetMin}
                onChangeText={setBudgetMin}
              />
            </View>
            <Text style={styles.budgetSeparator}>-</Text>
            <View style={[styles.inputContainer, styles.budgetInputBox]}>
              <Text style={styles.currencyPrefix}>Max</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="Limitsiz"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={budgetMax}
                onChangeText={setBudgetMax}
              />
            </View>
          </View>

          {/* 4. Kişi Sayısı */}
          <Text style={styles.label}>Kişi Sayısı</Text>
          <View style={styles.guestsContainer}>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests(prev => String(Math.max(1, parseInt(prev || '1') - 1)))}
            >
              <FontAwesome name="minus" size={16} color="#475569" />
            </TouchableOpacity>

            <TextInput
              style={styles.guestsInput}
              keyboardType="numeric"
              value={guests}
              onChangeText={setGuests}
            />

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests(prev => String(parseInt(prev || '1') + 1))}
            >
              <FontAwesome name="plus" size={16} color="#008cb3" />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Turları Bul</Text>
            <FontAwesome name="arrow-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <FontAwesome name="info-circle" size={16} color="#0369a1" />
            <Text style={styles.infoText}>Tourkia ile %100 Esnek İptal ve İade Garantisi. Turları listeledikten sonra ek filtrelere ulaşabilirsiniz.</Text>
          </View>

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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#008cb3',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#cffafe',
    fontWeight: '500',
    lineHeight: 22,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    height: 60,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  rightIcon: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  inputTextPlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  budgetInputBox: {
    flex: 1,
    marginBottom: 0,
  },
  currencyPrefix: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '800',
    color: '#008cb3',
  },
  budgetSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginHorizontal: 16,
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    height: 60,
    padding: 8,
    marginBottom: 32,
  },
  guestButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guestsInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#008cb3',
  },
  submitBtn: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
    lineHeight: 18,
  }
});
