import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';
import { getGlobalStats, getDailyRevenueData } from '../services/financeService';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

const AnalyticsChart = ({ data }: { data: any[] }) => {
  if (data.length === 0) return null;
  const max = Math.max(...data.map(d => d.amount), 1);
  const chartHeight = 150;
  const chartWidth = width - 80;
  const step = chartWidth / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * step,
    y: chartHeight - (d.amount / max) * (chartHeight - 20)
  }));

  const d = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <View style={styles.chartContainer}>
      <Svg height={chartHeight} width={chartWidth}>
        <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6366f1" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </SvgGradient>
        <Path
          d={`${d} L ${points[points.length - 1].x},${chartHeight} L 0,${chartHeight} Z`}
          fill="url(#grad)"
        />
        <Path
          d={d}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
        />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" />
        ))}
      </Svg>
    </View>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ todayNetProfit: 0, todayComboTotal: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTourists] = useState(142); // Mock for Komut 23
  const [topTour] = useState('Kapadokya Balon Turu'); // Mock for Komut 23
  
  useEffect(() => {
    const load = async () => {
      const s = await getGlobalStats();
      const c = await getDailyRevenueData();
      setStats(s);
      setChartData(c);
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SUPERADMIN PANEL</Text>
          <Text style={styles.headerTitle}>God-Mode Dashboard</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <FontAwesome name="times" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Metric Grid */}
        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
              <FontAwesome name="users" size={18} color="#38bdf8" />
            </View>
            <Text style={styles.metricLabel}>Aktif Turist</Text>
            <Text style={styles.metricValue}>{activeTourists}</Text>
            <Text style={styles.metricTrend}>+12% Bugün</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <FontAwesome name="shopping-bag" size={18} color="#10b981" />
            </View>
            <Text style={styles.metricLabel}>Kombo Satış</Text>
            <Text style={styles.metricValue}>₺{stats.todayComboTotal.toLocaleString()}</Text>
            <Text style={styles.metricTrend}>+5.4%</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <FontAwesome name="bank" size={18} color="#f59e0b" />
            </View>
            <Text style={styles.metricLabel}>Net Kâr (15%)</Text>
            <Text style={styles.metricValue}>₺{stats.todayNetProfit.toLocaleString()}</Text>
            <Text style={styles.metricTrend}>Hedef: ₺50K</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
              <FontAwesome name="star" size={18} color="#f43f5e" />
            </View>
            <Text style={styles.metricLabel}>Trend Tur</Text>
            <Text style={styles.metricValueSmall} numberOfLines={1}>{topTour}</Text>
            <Text style={styles.metricTrend}>98 Görüntüleme</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Haftalık Hasılat Grafiği</Text>
          <AnalyticsChart data={chartData} />
          <View style={styles.chartLabels}>
            {chartData.map((d, i) => (
                <Text key={i} style={styles.chartLabelText}>{d.date.split('-')[2]}</Text>
            ))}
          </View>
        </View>

        {/* Live Operations */}
        <View style={styles.liveSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Canlı Operasyon Akışı</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>CANLI</Text>
            </View>
          </View>
          
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.logItem}>
              <View style={styles.logIcon}>
                <FontAwesome name="check-circle" size={14} color="#10b981" />
              </View>
              <View style={styles.logContent}>
                <Text style={styles.logText}>
                  <Text style={{fontWeight: '700', color: '#fff'}}>Wei Chen</Text> adlı turist bir bilet okuttu.
                </Text>
                <Text style={styles.logTime}>{i * 4} dk önce • Sultan Sofrası</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff' },
  headerSubtitle: { fontSize: 11, fontWeight: '800', color: '#6366f1', letterSpacing: 1 },
  closeBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  metricCard: { width: (width - 52) / 2, backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginBottom: 4 },
  metricValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
  metricValueSmall: { fontSize: 15, fontWeight: '900', color: '#fff' },
  metricTrend: { fontSize: 10, fontWeight: '700', color: '#10b981', marginTop: 4 },

  chartSection: { backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 20, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 20 },
  chartContainer: { height: 150, alignItems: 'center', justifyContent: 'center' },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
  chartLabelText: { fontSize: 10, color: '#64748b', fontWeight: '700' },

  liveSection: { backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 20, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(244, 63, 94, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f43f5e' },
  liveBadgeText: { fontSize: 10, fontWeight: '900', color: '#f43f5e' },

  logItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  logIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' },
  logContent: { flex: 1 },
  logText: { fontSize: 13, color: '#94a3b8' },
  logTime: { fontSize: 11, color: '#64748b', marginTop: 2 }
});
