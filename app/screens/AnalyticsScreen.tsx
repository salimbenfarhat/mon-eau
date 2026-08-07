import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable, Alert, Share } from 'react-native';
import { useHydrationStore, DayLog } from '../store/hydration.store';
import { useSettingsStore } from '../store/settings.store';
import { getTodayKey } from '../lib/dates';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { analyzeHydration, generateHTMLReport, HealthAlert } from '../lib/analytics';
import AdBanner from '../components/composite/AdBanner';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useGamificationStore } from '../store/gamification.store';
import { THEMES } from '../lib/themes';

const { width } = Dimensions.get('window');
const chartWidth = width - 32;
const chartHeight = 180;
const barWidth = 22;
const barSpacing = 12;
const labelHeight = 20;

const DailyBarChart = ({ data, theme }: { data: DayLog[], theme: any }) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => Math.max(d.goalMl, d.totalMl)), 1);
  const scaleY = (value: number) => (value / maxValue) * (chartHeight - labelHeight * 2);

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.background }]}>
      <Svg width={chartWidth} height={chartHeight}>
        <G y={chartHeight - labelHeight}>
          {data.map((item, index) => {
            const x = index * (barWidth + barSpacing) + (chartWidth - (data.length * (barWidth + barSpacing))) / 2;
            const barHeight = scaleY(item.totalMl);
            const goalHeight = scaleY(item.goalMl);

            return (
              <G key={item.date}>
                <Rect x={x} y={-goalHeight} width={barWidth} height={goalHeight} fill={theme.card} rx={4} />
                <Rect x={x} y={-barHeight} width={barWidth} height={barHeight} fill={theme.primary} rx={4} />
                <SvgText x={x + barWidth / 2} y={15} fontSize="10" fill={theme.subText} textAnchor="middle">
                  {format(new Date(item.date), 'dd/MM')}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default function AnalyticsScreen() {
  const { logs } = useHydrationStore();
  const { currentProfileId, profiles } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profile = currentProfileId ? profiles[currentProfileId] : null;

  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  if (!currentProfileId || !profile) {
    return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>Veuillez sélectionner un profil.</Text></View>;
  }

  const profileLogs = logs[currentProfileId] || {};
  const last7DaysKeys = Array.from({ length: 7 }, (_, i) => getTodayKey(subDays(new Date(), i)));
  const historyData: DayLog[] = last7DaysKeys
    .map(key => profileLogs[key])
    .filter((log): log is DayLog => log !== undefined)
    .reverse();

  const alerts = analyzeHydration(historyData);

  const handleExport = async () => {
    try {
      const html = generateHTMLReport(profile.name, historyData);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de générer le rapport PDF.');
      console.error(e);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Analyse Santé</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>7 derniers jours</Text>
      <DailyBarChart data={historyData} theme={theme} />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Points de vigilance</Text>
      {alerts.length > 0 ? (
        alerts.map((alert, i) => (
          <View key={i} style={[styles.alertCard, styles[alert.type], { backgroundColor: theme.background, borderColor: theme.card }]}>
            <Ionicons
              name={alert.type === 'warning' ? 'alert-circle' : alert.type === 'success' ? 'checkmark-circle' : 'information-circle'}
              size={24}
              color={alert.type === 'warning' ? '#EF4444' : alert.type === 'success' ? '#10B981' : '#3B82F6'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
              <Text style={[styles.alertMessage, { color: theme.subText }]}>{alert.message}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: theme.subText }]}>Pas assez de données pour l'analyse.</Text>
      )}

      <Pressable style={[styles.exportButton, { backgroundColor: theme.primary }]} onPress={handleExport}>
        <Ionicons name="document-text-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.exportButtonText}>Exporter mon rapport (DMP/PDF)</Text>
      </Pressable>

      <AdBanner />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12 },
  chartContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 24, elevation: 2 },
  alertCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  alertMessage: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  warning: { borderLeftColor: '#EF4444' },
  success: { borderLeftColor: '#10B981' },
  info: { borderLeftColor: '#3B82F6' },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic', marginBottom: 24 },
  exportButton: { flexDirection: 'row', backgroundColor: '#111827', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  exportButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
