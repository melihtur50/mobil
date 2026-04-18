import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CappoAssistant from '../CappoAssistant';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

export const SearchHeader = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, '#002B55']}
        style={styles.gradient}
      >
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.brandTitle}>Tourkia.com</Text>
            </View>
            <View style={styles.rightActions}>
              <CappoAssistant />
              <TouchableOpacity style={styles.iconBtn}>
                <FontAwesome name="bell-o" size={20} color="#fff" />
                <View style={styles.badge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <FontAwesome name="user-o" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.titleWrapper}>
            <Text style={styles.mainTitle}>Macera Başlıyor</Text>
            <View style={styles.activeIndicator} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: Colors.light.primary, 
    paddingBottom: 60,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  gradient: {
    paddingBottom: 20,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: Spacing.lg, 
    paddingTop: 10, 
    paddingBottom: 15 
  },
  welcomeText: { display: 'none' },
  brandTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#fff',
    marginTop: 2,
  },
  rightActions: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 15 
  },
  iconBtn: { 
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.accent,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  titleWrapper: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10 
  },
  mainTitle: { 
    color: Colors.light.secondary, 
    fontSize: 22, 
    fontWeight: '900', 
    letterSpacing: 0.5 
  },
  activeIndicator: {
    width: 40,
    height: 3,
    backgroundColor: Colors.light.secondary,
    borderRadius: 2,
    marginTop: 6,
  }
});
