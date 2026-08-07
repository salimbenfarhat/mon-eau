import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useSettingsStore } from '../store/settings.store';
import { useHydrationStore } from '../store/hydration.store';
import { useGamificationStore } from '../store/gamification.store';
import { useBadgesStore } from '../store/badges.store';
import { Alert } from 'react-native';

export async function exportUserData() {
  try {
    const backupData = {
      version: 1,
      timestamp: Date.now(),
      settings: useSettingsStore.getState(),
      hydration: useHydrationStore.getState(),
      gamification: useGamificationStore.getState(),
      badges: useBadgesStore.getState(),
    };

    const fileName = `mon-eau-backup-${new Date().toISOString().split('T')[0]}.json`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exporter mes données Mon Eau',
      UTI: 'public.json',
    });
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert('Erreur', 'Impossible d\'exporter les données.');
  }
}

export async function importUserData() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const fileUri = result.assets[0].uri;
    const content = await FileSystem.readAsStringAsync(fileUri);
    const backupData = JSON.parse(content);

    // Validation basique
    if (!backupData.settings || !backupData.hydration || !backupData.gamification) {
      throw new Error('Fichier de sauvegarde invalide.');
    }

    Alert.alert(
      'Confirmer l\'importation',
      'Attention : Cela va écraser vos données actuelles par celles du fichier. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Importer',
          onPress: () => {
            // Mise à jour des stores via setState (Zustand)
            useSettingsStore.setState(backupData.settings);
            useHydrationStore.setState(backupData.hydration);
            useGamificationStore.setState(backupData.gamification);
            if (backupData.badges) useBadgesStore.setState(backupData.badges);

            Alert.alert('Succès', 'Vos données ont été importées avec succès !');
          },
        },
      ]
    );
  } catch (error) {
    console.error('Import failed:', error);
    Alert.alert('Erreur', 'Impossible d\'importer les données. Assurez-vous que le fichier est valide.');
  }
}
