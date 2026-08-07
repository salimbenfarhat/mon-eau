import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGamificationStore } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { THEMES } from '../lib/themes';

export default function WaterGuideScreen() {
  const { currentProfileId } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Bien choisir son eau 💧</Text>
      <Text style={[styles.intro, { color: theme.subText }]}>
        Toutes les eaux ne se valent pas. Selon votre âge, votre activité physique ou votre état de santé, certains minéraux sont à privilégier.
      </Text>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="water" size={24} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>L'Eau du Robinet</Text>
        </View>
        <Text style={[styles.text, { color: theme.text }]}>
          C'est l'option la plus économique et écologique. En France, elle est très contrôlée.
          {"\n"}<Text style={[styles.bold, { color: theme.primary }]}>Astuce :</Text> Si elle a un goût de chlore, laissez-la reposer en carafe ouverte au frigo pendant 1h ou utilisez un filtre.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="leaf" size={24} color="#10B981" />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Eau de Source vs Minérale</Text>
        </View>
        <Text style={[styles.text, { color: theme.text }]}>
          <Text style={styles.bold}>Eau de Source :</Text> Eau d'origine souterraine, potable à l'état naturel. Sa composition en minéraux peut varier. (Ex: Cristaline).
          {"\n\n"}
          <Text style={styles.bold}>Eau Minérale Naturelle :</Text> Sa composition est stable et elle possède des propriétés favorables à la santé reconnues par l'Académie de Médecine.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Comment lire l'étiquette ?</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Regardez les <Text style={styles.bold}>"Résidus à sec à 180°C"</Text> :
          {"\n"}• <Text style={styles.bold}>{"< 50 mg/L :"}</Text> Très faiblement minéralisée (Idéal pour les nourrissons).
          {"\n"}• <Text style={styles.bold}>50 - 500 mg/L :</Text> Faiblement minéralisée.
          {"\n"}• <Text style={styles.bold}>{"> 1500 mg/L :"}</Text> Riche en minéraux (À consommer avec modération).
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Comparatif des marques (FR)</Text>
        <View style={[styles.table, { borderColor: theme.card }]}>
          <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.background, borderColor: theme.card }]}>
            <Text style={[styles.cell, styles.bold, { color: theme.text }]}>Marque</Text>
            <Text style={[styles.cell, styles.bold, { color: theme.text }]}>Point fort</Text>
          </View>
          <View style={[styles.row, { borderColor: theme.card }]}>
            <Text style={[styles.cell, { color: theme.text }]}>Evian / Volvic</Text>
            <Text style={[styles.cell, { color: theme.text }]}>Neutre, tous publics</Text>
          </View>
          <View style={[styles.row, { borderColor: theme.card }]}>
            <Text style={[styles.cell, { color: theme.text }]}>Contrex / Hépar</Text>
            <Text style={[styles.cell, { color: theme.text }]}>Magnésium / Transit</Text>
          </View>
          <View style={[styles.row, { borderColor: theme.card }]}>
            <Text style={[styles.cell, { color: theme.text }]}>Courmayeur</Text>
            <Text style={[styles.cell, { color: theme.text }]}>Calcium (Os)</Text>
          </View>
          <View style={[styles.row, { borderColor: theme.card }]}>
            <Text style={[styles.cell, { color: theme.text }]}>Mont Roucous</Text>
            <Text style={[styles.cell, { color: theme.text }]}>Bébés (très pure)</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { marginBottom: 40, backgroundColor: theme.card }]}>
        <Text style={[styles.caution, { backgroundColor: theme.accent, color: theme.text }]}>
          <Ionicons name="warning" size={16} color="#B45309" /> Attention : Certaines eaux très minéralisées peuvent fatiguer les reins si elles sont consommées en excès. Variez vos plaisirs !
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 12 },
  intro: { fontSize: 16, color: '#4B5563', lineHeight: 22, marginBottom: 24 },
  section: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 8 },
  text: { fontSize: 15, color: '#374151', lineHeight: 20 },
  bold: { fontWeight: '700' },
  table: { marginTop: 12, borderTopWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8 },
  tableHeader: { backgroundColor: '#F3F4F6' },
  cell: { flex: 1, fontSize: 14, color: '#374151' },
  caution: { fontSize: 14, color: '#B45309', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, fontStyle: 'italic' },
});
