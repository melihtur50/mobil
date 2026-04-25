import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { useAppContext } from '../../context/AppContext';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll, showViewAll = false }) => {
  const { language } = useAppContext();
  
  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.title, 
          language === 'zh' && { fontSize: 24, letterSpacing: 1 }
        ]} 
        numberOfLines={1} 
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
});
