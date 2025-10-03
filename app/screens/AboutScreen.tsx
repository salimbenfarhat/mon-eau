import React from "react";
import { View, Text, Pressable, Linking, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.title}>À propos</Text>

      <Text style={styles.text}>
        <Text style={styles.boldText}>Mon Eau</Text> est une application
        minimaliste pour suivre simplement votre hydratation quotidienne :
        objectif personnalisé, progression visuelle, et petites récompenses
        motivantes.
      </Text>

      {/* Photo auteur */}
      <Image
        source={{
          uri: "https://media.licdn.com/dms/image/v2/D4E03AQH6UGepqWABBg/profile-displayphoto-crop_800_800/B4EZi49ZKwHoAI-/0/1755449760597?e=1762387200&v=beta&t=MhGPysQqAdwLwfJBkx57iQRjLiWDhJ2h_HSi2BBlJJY",
        }}
        style={styles.image}
        accessible
        accessibilityLabel="Photo de profil"
      />

      {/* Auteur */}
      <Text style={styles.text}>
        Auteur :{" "}
        <Text
          style={styles.linkText}
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
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Code disponible (GitHub)
        </Text>
      </Pressable>

      {/* PayPal */}
      <Pressable
        accessibilityRole="button"
        onPress={() => Linking.openURL("https://salim.link/paypal")}
        style={[styles.button, styles.paypalButton]}
      >
        <Text style={styles.buttonText}>
          Soutenir le projet 💙
        </Text>
      </Pressable>

      {/* Contact */}
      <View style={styles.contactContainer}>
        <Text style={styles.boldText}>
          Vous avez un projet (app mobile, SaaS) ?
        </Text>
        <Text style={styles.text}>
          Contactez-moi :{" "}
          <Text style={styles.boldText}>collab@sablab.fr</Text>
        </Text>
      </View>

      {/* Crédits sons */}
      <View style={styles.creditsContainer}>
        <Text style={styles.boldText}>Crédits sons :</Text>
        <Text style={styles.creditsText}>
          • <Text style={styles.italicText}>Water Faucet 4</Text> —
          utilisé pour le splashscreen
        </Text>
        <Text style={styles.creditsText}>
          • <Text style={styles.italicText}>Water Faucet 1</Text> —
          utilisé pour le bouton +1 verre
        </Text>
        <Text style={[styles.creditsText, { marginTop: 4 }]}>
          Source :{" "}
          <Text
            style={styles.linkText}
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
