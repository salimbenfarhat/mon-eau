import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useHydrationStore, DayLog } from '../store/hydration.store';
import { useSettingsStore } from '../store/settings.store';
import { getTodayKey } from '../lib/dates';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const chartWidth = width - 32; // Screen width minus padding
const chartHeight = 200;
const barWidth = 20;
const barSpacing = 10;
const labelHeight = 20; // For date labels

const DailyBarChart = ({ data }: { data: DayLog[] }) => {
  if (data.length === 0) {
    return <Text style={styles.noDataText}>Aucune donnée pour le graphique.</Text>;
  }

  const maxGoal = Math.max(...data.map(d => d.goalMl), 1); // Ensure maxGoal is at least 1 to avoid division by zero
  const maxTotal = Math.max(...data.map(d => d.totalMl), 1);
  const maxValue = Math.max(maxGoal, maxTotal);

  const scaleY = (value: number) => (value / maxValue) * (chartHeight - labelHeight * 2); // Scale to chart height, leaving space for labels

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        <G y={chartHeight - labelHeight}> {/* Move origin to bottom-left for easier bar drawing */}
          {data.map((item, index) => {
            const x = index * (barWidth + barSpacing) + (chartWidth - (data.length * (barWidth + barSpacing))) / 2;
            const barHeight = scaleY(item.totalMl);
            const goalHeight = scaleY(item.goalMl);

            return (
              <G key={item.date}>
                {/* Goal Bar (background) */}
                <Rect
                  x={x}
                  y={-goalHeight} // Draw upwards from the bottom
                  width={barWidth}
                  height={goalHeight}
                  fill="#E0E0E0"
                  rx={3}
                  ry={3}
                />
                {/* Actual Hydration Bar */}
                <Rect
                  x={x}
                  y={-barHeight} // Draw upwards from the bottom
                  width={barWidth}
                  height={barHeight}
                  fill="#1EA7FD"
                  rx={3}
                  ry={3}
                />
                {/* Value Text */}
                <SvgText
                  x={x + barWidth / 2}
                  y={-barHeight - 5} // Position above the bar
                  fontSize="10"
                  fill="#333"
                  textAnchor="middle"
                >
                  {item.totalMl}
                </SvgText>
                {/* Date Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={15} // Position below the chart
                  fontSize="10"
                  fill="#6B7280"
                  textAnchor="middle"
                >
                  {format(new Date(item.date), 'dd/MM', { locale: fr })}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dayLogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dayLogDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1EA7FD',
    marginBottom: 8,
  },
  dayLogText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default function HistoryScreen() {
  const { logs } = useHydrationStore();
  const { currentProfileId } = useSettingsStore();

  if (!currentProfileId) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Historique</Text>
        <Text style={styles.noDataText}>Aucun profil sélectionné.</Text>
      </View>
    );
  }

  const profileLogs = logs[currentProfileId] || {};

  // Generate keys for the last 7 days
  const last7DaysKeys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i);
    last7DaysKeys.push(getTodayKey(date));
  }

  const historyData: DayLog[] = last7DaysKeys
    .map(key => profileLogs[key])
    .filter((log): log is DayLog => log !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort descending by date

  const renderDayLog = ({ item }: { item: DayLog }) => (
    <View style={styles.dayLogContainer}>
      <Text style={styles.dayLogDate}>{format(new Date(item.date), 'EEEE d MMMM yyyy', { locale: fr })}</Text>
      <Text style={styles.dayLogText}>Total bu : {item.totalMl} ml</Text>
      <Text style={styles.dayLogText}>Objectif : {item.goalMl} ml</Text>
      {item.entries.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: '500', color: '#4A5568' }}>Détails :</Text>
          {item.entries.map((entry, index) => (
            <Text key={entry.id} style={{ fontSize: 14, color: '#6B7280' }}>
              - {entry.ml} ml à {format(new Date(entry.ts), 'HH:mm', { locale: fr })}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Historique</Text>
      <Text style={styles.subHeader}>Vue des 7 derniers jours</Text>

      <DailyBarChart data={historyData} />

      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={renderDayLog}
          keyExtractor={(item) => item.date}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={false} // Disable FlatList scrolling as it's inside a ScrollView
        />
      ) : (
        <Text style={styles.noDataText}>Aucune donnée d'hydratation pour les 7 derniers jours.</Text>
      )}
    </ScrollView>
  );
}
