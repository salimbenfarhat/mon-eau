import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGamificationStore } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { THEMES } from '../lib/themes';

const ASSOCIATIONS = [
  {
    name: "Action contre la Faim",
    mission: "Améliorer l'accès à l'eau potable et l'assainissement dans le monde.",
    url: "https://www.actioncontrelafaim.org/nos-missions/eau-assainissement-et-hygiene/",
    icon: "water-outline"
  },
  {
    name: "UNICEF",
    mission: "Fournir de l'eau salubre aux enfants dans les zones de conflit et de catastrophe.",
    url: "https://www.unicef.fr/notre-action/eau-hygiene-assainissement",
    icon: "people-outline"
  },
  {
    name: "Solidarités International",
    mission: "Répondre aux besoins vitaux des populations victimes de crises.",
    url: "https://www.solidarites.org/fr/nos-metiers/eau-hygiene-assainissement/",
    icon: "earth-outline"
  }
];

export default function SolidarityScreen() {
  const { currentProfileId } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Ionicons name="heart" size={40} color="#EF4444" />
        <Text style={[styles.title, { color: theme.text }]}>Engagement Solidaire</Text>
      </View>

      <Text style={[styles.intro, { color: theme.subText }]}>
        Pendant que nous suivons notre hydratation quotidienne, des millions de personnes n'ont pas encore accès à une source d'eau potable.
        {"\n\n"}
        Découvrez et soutenez ces organisations qui luttent chaque jour pour l'accès universel à l'eau.
      </Text>

      {ASSOCIATIONS.map((asso, index) => (
        <View key={index} style={[styles.assoCard, { backgroundColor: theme.card }]}>
          <View style={[styles.assoIcon, { backgroundColor: theme.accent }]}>
            <Ionicons name={asso.icon as any} size={30} color={theme.primary} />
          </View>
          <View style={styles.assoContent}>
            <Text style={[styles.assoName, { color: theme.text }]}>{asso.name}</Text>
            <Text style={[styles.assoMission, { color: theme.subText }]}>{asso.mission}</Text>
            <Pressable style={[styles.assoButton, { backgroundColor: theme.primary }]} onPress={() => handlePress(asso.url)}>
              <Text style={styles.assoButtonText}>Soutenir / En savoir plus</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.subText }]}>
          Mon Eau est une application indépendante. Nous ne prélevons aucune commission sur vos dons aux associations.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { alignItems: 'center', marginVertical: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 12 },
  intro: { fontSize: 16, color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  assoCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 },
  assoIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  assoContent: { flex: 1 },
  assoName: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  assoMission: { fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 18 },
  assoButton: { flexDirection: 'row', backgroundColor: '#1EA7FD', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start', alignItems: 'center' },
  assoButtonText: { color: '#FFF', fontWeight: '600', marginRight: 8, fontSize: 14 },
  footer: { marginTop: 40, marginBottom: 40, paddingHorizontal: 20 },
  footerText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' },
});
