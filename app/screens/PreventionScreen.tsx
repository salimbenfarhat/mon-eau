import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '../store/settings.store';
import { useGamificationStore } from '../store/gamification.store';
import { THEMES } from '../lib/themes';

export default function PreventionScreen() {
  const navigation = useNavigation<any>();
  const { setHasSeenPrevention, currentProfileId, profiles } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profile = currentProfileId ? profiles[currentProfileId] : null;
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  const handleFinish = () => {
    setHasSeenPrevention(true);
    if (!profile?.weightKg) {
      navigation.replace('Onboarding');
    } else {
      navigation.replace('Tabs');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={80} color="#EF4444" />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Message de Prévention Santé</Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            L'hydratation est essentielle à la vie, mais elle doit être adaptée à vos besoins réels.
            Les recommandations gouvernementales suggèrent généralement de boire entre <Text style={[styles.bold, { color: theme.primary }]}>1,5 et 2 litres d'eau par jour</Text> pour un adulte en bonne santé.
          </Text>

          <View style={styles.warningBox}>
            <Ionicons name="warning" size={24} color="#B45309" />
            <Text style={styles.warningText}>
              Attention : La consommation excessive d'eau en un temps très court (potomanie) peut être dangereuse pour la santé.
            </Text>
          </View>

          <Text style={[styles.subTitle, { color: theme.text }]}>Points de vigilance :</Text>
          <Text style={[styles.bullet, { color: theme.subText }]}>• En cas de forte chaleur ou de fièvre, vos besoins augmentent.</Text>
          <Text style={[styles.bullet, { color: theme.subText }]}>• Les nourrissons et les personnes âgées sont plus vulnérables à la déshydratation.</Text>
          <Text style={[styles.bullet, { color: theme.subText }]}>• Consultez un médecin si vous ressentez une soif anormale et persistante.</Text>
        </View>

        <Text style={styles.source}>Source : Ministère de la Santé / Santé Publique France</Text>
      </ScrollView>

      <Pressable style={[styles.button, { backgroundColor: theme.text }]} onPress={handleFinish}>
        <Text style={[styles.buttonText, { color: theme.background }]}>J'ai compris</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 24, paddingTop: 60, alignItems: 'center' },
  iconContainer: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 24 },
  card: { width: '100%', backgroundColor: '#F9FAFB', padding: 20, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  paragraph: { fontSize: 16, color: '#374151', lineHeight: 24, marginBottom: 16 },
  bold: { fontWeight: '700', color: '#1EA7FD' },
  warningBox: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  warningText: { flex: 1, marginLeft: 10, fontSize: 14, color: '#B45309', fontWeight: '500' },
  subTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  bullet: { fontSize: 15, color: '#4B5563', marginBottom: 8, lineHeight: 20 },
  source: { fontSize: 12, color: '#9CA3AF', marginTop: 32, fontStyle: 'italic' },
  button: { margin: 24, backgroundColor: '#111827', padding: 18, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
