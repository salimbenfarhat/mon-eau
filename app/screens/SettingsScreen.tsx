import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useGamificationStore } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { THEMES, ThemeId } from '../lib/themes';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { exportUserData, importUserData } from '../lib/backup';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { currentProfileId } = useSettingsStore();
  const { data, setTheme } = useGamificationStore();

  const profileData = currentProfileId ? data[currentProfileId] : null;
  const isPremium = profileData?.isPremium ?? false;
  const currentThemeId = profileData?.currentTheme ?? 'default';
  const theme = THEMES[currentThemeId];

  const handleThemeChange = (themeId: ThemeId) => {
    if (themeId !== 'default' && !isPremium) {
      Alert.alert(
        'Thème Premium',
        'Ce thème est réservé aux membres Premium. Rendez-vous dans la boutique pour débloquer le pack Expert !'
      );
      return;
    }
    setTheme(themeId);
  };

  const renderThemeOption = (id: ThemeId, name: string) => {
    const isSelected = currentThemeId === id;
    const isLocked = id !== 'default' && !isPremium;
    const themeColors = THEMES[id];

    return (
      <Pressable
        key={id}
        style={[
          styles.themeOption,
          { backgroundColor: themeColors.background, borderColor: isSelected ? theme.primary : theme.card },
          isSelected && [styles.selectedOption, { borderColor: theme.primary }]
        ]}
        onPress={() => handleThemeChange(id)}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.colorPreview, { backgroundColor: themeColors.primary }]} />
          <Text style={[styles.themeName, { color: themeColors.text }]}>{name}</Text>
        </View>
        {isLocked && <Ionicons name="lock-closed" size={20} color={theme.subText} />}
        {isSelected && <Ionicons name="checkmark-circle" size={24} color={theme.primary} />}
      </Pressable>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Réglages</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Apparence</Text>
        <Text style={[styles.sectionSubTitle, { color: theme.subText }]}>Choisissez le thème visuel de l'application</Text>

        {renderThemeOption('default', 'Clair (Défaut)')}
        {renderThemeOption('ocean', 'Océan Profond')}
        {renderThemeOption('night', 'Mode Nuit')}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Éducation & Conseils</Text>
        <Pressable
          style={[styles.button, { backgroundColor: '#10B981' }]}
          onPress={() => navigation.navigate('WaterGuide')}
        >
          <Ionicons name="book-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Bien choisir son eau (Guide)</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: '#EF4444', marginTop: 12 }]}
          onPress={() => navigation.navigate('Prevention')}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Prévention & Recommandations</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: '#EF4444', marginTop: 12 }]}
          onPress={() => navigation.navigate('Solidarity')}
        >
          <Ionicons name="heart-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Engagement Solidaire</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sauvegarde & Synchronisation</Text>
        <Text style={[styles.sectionSubTitle, { color: theme.subText }]}>Exportez vos données pour les transférer sur un autre appareil</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable style={[styles.button, { flex: 1, backgroundColor: '#4B5563' }]} onPress={exportUserData}>
            <Ionicons name="cloud-upload-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Exporter</Text>
          </Pressable>

          <Pressable style={[styles.button, { flex: 1, backgroundColor: '#4B5563' }]} onPress={importUserData}>
            <Ionicons name="cloud-download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Importer</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Données & Santé</Text>
        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => Alert.alert('Export', 'Fonctionnalité d\'exportation DMP en cours de développement.')}>
          <Ionicons name="share-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Exporter mon rapport médical (PDF)</Text>
        </Pressable>
      </View>

      <View style={[styles.section, { marginTop: 20 }]}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('About')}
        >
          <Ionicons name="information-circle-outline" size={20} color={theme.text} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, { color: theme.text }]}>À propos de l'application</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#111827' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 4 },
  sectionSubTitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    elevation: 1
  },
  selectedOption: { borderColor: '#1EA7FD' },
  colorPreview: { width: 24, height: 24, borderRadius: 12, marginRight: 12 },
  themeName: { fontSize: 16, fontWeight: '500' },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1EA7FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
