import React from "react";
import { View, Text, Pressable, Linking, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGamificationStore } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { THEMES } from '../lib/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: '#333',
  },
  text: {
    color: "#111827",
  },
  boldText: {
    fontWeight: "700",
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "black",
  },
  button: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: 260,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  paypalButton: {
    backgroundColor: "#1EA7FD",
  },
  contactContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  creditsContainer: {
    marginTop: 16,
  },
  creditsText: {
    color: "#374151",
    marginTop: 4,
  },
  italicText: {
    fontStyle: "italic",
  },
});

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { currentProfileId } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const theme = THEMES[profileGamification?.currentTheme ?? 'default'];

  return (
    <View style={[styles.container, {
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
      backgroundColor: theme.background
    }]}>
      <Text style={[styles.title, { color: theme.text }]}>À propos</Text>

      <Text style={[styles.text, { color: theme.text }]}>
        <Text style={styles.boldText}>Mon Eau</Text> est une application
        minimaliste pour suivre simplement votre hydratation quotidienne :
        objectif personnalisé, progression visuelle, et petites récompenses
        motivantes.
      </Text>

      {/* Photo auteur */}
      <Image
        source={{
          uri: "https://github.com/salimbenfarhat.png",
        }}
        style={[styles.image, { borderColor: theme.card }]}
        accessible
        accessibilityLabel="Photo de profil de Salim Benfarhat"
      />

      {/* Auteur */}
      <Text style={[styles.text, { color: theme.text }]}>
        Auteur :{" "}
        <Text
          style={[styles.linkText, { color: theme.primary }]}
          onPress={() => Linking.openURL("https://salim.link")}
        >
          Salim Benfarhat
        </Text>
      </Text>

      {/* GitHub */}
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          Linking.openURL("https://github.com/salimbenfarhat/mon-eau")
        }
        style={[styles.button, { backgroundColor: theme.text }]}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          Code disponible (GitHub)
        </Text>
      </Pressable>

      {/* PayPal */}
      <Pressable
        accessibilityRole="button"
        onPress={() => Linking.openURL("https://salim.link/paypal")}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.buttonText}>
          Soutenir le projet 💙
        </Text>
      </Pressable>

      {/* Contact */}
      <View style={[styles.contactContainer, { borderColor: theme.card }]}>
        <Text style={[styles.boldText, { color: theme.text }]}>
          Vous avez un projet (app mobile, SaaS) ?
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Contactez-moi :{" "}
          <Text style={styles.boldText}>collab@sablab.fr</Text>
        </Text>
      </View>

      {/* Crédits sons */}
      <View style={styles.creditsContainer}>
        <Text style={[styles.boldText, { color: theme.text }]}>Crédits sons :</Text>
        <Text style={[styles.creditsText, { color: theme.subText }]}>
          • <Text style={styles.italicText}>Water Faucet 4</Text> —
          utilisé pour le splashscreen
        </Text>
        <Text style={[styles.creditsText, { color: theme.subText }]}>
          • <Text style={styles.italicText}>Water Faucet 1</Text> —
          utilisé pour le bouton +1 verre
        </Text>
        <Text style={[styles.creditsText, { marginTop: 4, color: theme.subText }]}>
          Source :{" "}
          <Text
            style={[styles.linkText, { color: theme.primary }]}
            onPress={() =>
              Linking.openURL(
                "https://elevenlabs.io/sound-effects/water-faucet"
              )
            }
          >
            ElevenLabs Sound Effects
          </Text>
        </Text>
      </View>
    </View>
  );
}
