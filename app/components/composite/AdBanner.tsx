import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import adsData from '../../data/ads.json';
import { useGamificationStore } from '../../store/gamification.store';
import { useSettingsStore } from '../../store/settings.store';
import { Ionicons } from '@expo/vector-icons';

export default function AdBanner() {
  const { currentProfileId } = useSettingsStore();
  const { data } = useGamificationStore();

  const isPremium = currentProfileId ? data[currentProfileId]?.isPremium : false;

  // Rotation aléatoire à chaque montage du composant
  const ad = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * adsData.length);
    return adsData[randomIndex];
  }, []);

  if (isPremium) return null; // Les premium ne voient pas de pubs

  return (
    <View style={styles.container}>
      <View style={styles.adHeader}>
        <Text style={styles.adBadge}>Publicité</Text>
        <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
      </View>

      <View style={[styles.banner, { backgroundColor: ad.backgroundColor }]}>
        <View style={styles.content}>
          <Text style={styles.brand}>{ad.brand}</Text>
          <Text style={styles.title}>{ad.title}</Text>
          <Text style={styles.desc} numberOfLines={1}>{ad.description}</Text>
        </View>
        <Pressable style={styles.cta} onPress={() => Linking.openURL(ad.url)}>
          <Text style={styles.ctaText}>{ad.cta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  adBadge: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  banner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  brand: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  desc: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.9,
  },
  cta: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  ctaText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
});
