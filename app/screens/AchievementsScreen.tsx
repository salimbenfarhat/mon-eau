import React from 'react';
import { View, Text, FlatList, StyleSheet, Share, Pressable } from 'react-native';
import { useBadgesStore, Badge, ALL_BADGES, BadgeCriteria } from '../store/badges.store';
import { useSettingsStore } from '../store/settings.store';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useGamificationStore } from '../store/gamification.store';
import { THEMES } from '../lib/themes';
import { Image, ImageStyle } from 'react-native'; // For grayscale effect if using images, or just style for icons
import { ColorMatrix, Grayscale } from 'react-native-color-matrix-image-filters'; // You might need to install this: npx expo install react-native-color-matrix-image-filters

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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  badgeIcon: {
    marginRight: 16,
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1EA7FD',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  badgeUnlockedDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  lockedBadgeContainer: {
    opacity: 0.5, // Mute locked badges
  },
  noBadgesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default function AchievementsScreen() {
  const { unlockedBadges } = useBadgesStore();
  const { currentProfileId } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  if (!currentProfileId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.header, { color: theme.text }]}>Mes Badges</Text>
        <Text style={[styles.noBadgesText, { color: theme.subText }]}>Aucun profil sélectionné.</Text>
      </View>
    );
  }

  const profileUnlockedBadges = unlockedBadges[currentProfileId] || {};

  const handleShare = async (badgeName: string) => {
    try {
      await Share.share({
        message: `Je viens de débloquer le badge "${badgeName}" sur l'application Mon Eau ! 💧🌊 #MonEau #Hydratation`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const renderBadge = ({ item }: { item: BadgeCriteria }) => {
    const isUnlocked = profileUnlockedBadges[item.id];
    const iconColor = isUnlocked ? theme.primary : theme.subText; // Muted color for locked badges

    return (
      <View style={[styles.badgeContainer, { backgroundColor: theme.card }, !isUnlocked && styles.lockedBadgeContainer]}>
        <Ionicons name={item.icon as any} size={40} color={iconColor} style={styles.badgeIcon} />
        <View style={styles.badgeTextContainer}>
          <Text style={[styles.badgeName, { color: theme.primary }]}>{item.name}</Text>
          <Text style={[styles.badgeDescription, { color: theme.text }]}>{item.description}</Text>
          {isUnlocked && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={[styles.badgeUnlockedDate, { color: theme.subText }]}>Débloqué le {format(new Date(isUnlocked.unlockedAt), 'd MMMM yyyy', { locale: fr })}</Text>
              <Pressable onPress={() => handleShare(item.name)}>
                <Ionicons name="share-social-outline" size={20} color={theme.primary} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Mes Badges</Text>
      <Text style={[styles.subHeader, { color: theme.subText }]}>Découvrez vos accomplissements et comment les débloquer !</Text>
      {ALL_BADGES.length > 0 ? (
        <FlatList
          data={ALL_BADGES}
          renderItem={renderBadge}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={[styles.noBadgesText, { color: theme.subText }]}>Aucun badge défini pour le moment.</Text>
      )}
    </View>
  );
}
