import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useGamificationStore, PlantType } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../lib/themes';

const SHOP_ITEMS = [
  { id: 'cactus', name: 'Graine de Cactus', type: 'cactus' as PlantType, price: 500, icon: 'paw-outline' },
  { id: 'flower', name: 'Graine de Fleur', type: 'flower' as PlantType, price: 1000, icon: 'flower-outline' },
  { id: 'tree', name: 'Graine de Chêne', type: 'tree' as PlantType, price: 2500, icon: 'leaf-outline' },
];

const PREMIUM_ITEMS = [
  { id: 'premium_pack', name: 'Pack Expert Hydratation', price: '4.99€', description: 'Plantes rares + Thèmes Ocean/Nuit + Zéro Pub' },
];

export default function ShopScreen() {
  const { currentProfileId } = useSettingsStore();
  const { data, unlockPlant, addGouttes, setPremium } = useGamificationStore();

  const profileData = currentProfileId ? data[currentProfileId] : null;
  const currentGouttes = profileData?.gouttes ?? 0;
  const isPremium = profileData?.isPremium ?? false;
  const theme = THEMES[profileData?.currentTheme ?? 'default'];

  const handleBuyWithGouttes = (item: typeof SHOP_ITEMS[0]) => {
    if (unlockPlant(item.id, item.price)) {
      Alert.alert('Succès', `Vous avez débloqué la ${item.name} !`);
    } else {
      Alert.alert('Gouttes insuffisantes', `Il vous manque ${item.price - currentGouttes} gouttes.`);
    }
  };

  const handlePremiumRequest = () => {
    Alert.alert(
      'Pack Premium',
      'Le pack Premium sera bientôt disponible via Google Play Billing. Restez à l\'écoute !'
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Boutique</Text>
        <View style={styles.balanceContainer}>
          <Ionicons name="water" size={20} color="#D97706" />
          <Text style={styles.balanceText}>{currentGouttes} gouttes</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Plantes Virtuelles</Text>
      {SHOP_ITEMS.map((item) => {
        const isUnlocked = profileData?.unlockedPlants.includes(item.id);
        return (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.card }]}>
            <View style={[styles.itemIconContainer, { backgroundColor: theme.background }]}>
              <Ionicons name={item.icon as any} size={32} color={theme.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: theme.subText }]}>{item.price} gouttes</Text>
            </View>
            <Pressable
              onPress={() => handleBuyWithGouttes(item)}
              disabled={isUnlocked}
              style={[styles.buyButton, { backgroundColor: theme.primary }, isUnlocked && styles.disabledButton]}
            >
              <Text style={styles.buyButtonText}>{isUnlocked ? 'Débloqué' : 'Acheter'}</Text>
            </Pressable>
          </View>
        );
      })}

      <Text style={[styles.sectionTitle, { marginTop: 32, color: theme.text }]}>Offres Premium</Text>
      {PREMIUM_ITEMS.map((item) => (
        <View key={item.id} style={[styles.itemCard, styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.itemDescription, { color: theme.subText }]}>{item.description}</Text>
          </View>
          <Pressable onPress={handlePremiumRequest} style={[styles.premiumButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.premiumButtonText}>{item.price}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  balanceContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 8, borderRadius: 20 },
  balanceText: { marginLeft: 6, fontWeight: '700', color: '#B45309' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#374151', marginBottom: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, elevation: 2 },
  itemIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  itemPrice: { fontSize: 14, color: '#6B7280' },
  itemDescription: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  buyButton: { backgroundColor: '#1EA7FD', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  disabledButton: { backgroundColor: '#D1D5DB' },
  buyButtonText: { color: '#FFF', fontWeight: '600' },
  premiumCard: { borderColor: '#6366F1', borderWidth: 1 },
  premiumButton: { backgroundColor: '#6366F1', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  premiumButtonText: { color: '#FFF', fontWeight: '700' },
});
