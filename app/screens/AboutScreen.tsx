import React from "react";
import { View, Text, Pressable, Linking, Image } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>À propos</Text>

      <Text style={{ color: "#111827" }}>
        <Text style={{ fontWeight: "700" }}>Mon Eau</Text> est une application
        minimaliste pour suivre simplement votre hydratation quotidienne :
        objectif personnalisé, progression visuelle, et petites récompenses
        motivantes.
      </Text>

      {/* Photo auteur */}
      <Image
        source={{
          uri: "https://media.licdn.com/dms/image/v2/D4E03AQH6UGepqWABBg/profile-displayphoto-crop_800_800/B4EZi49ZKwHoAI-/0/1755449760597?e=1762387200&v=beta&t=MhGPysQqAdwLwfJBkx57iQRjLiWDhJ2h_HSi2BBlJJY",
        }}
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
        accessible
        accessibilityLabel="Photo de profil"
      />

      {/* Auteur */}
      <Text>
        Auteur :{" "}
        <Text
          style={{ textDecorationLine: "underline", color: "black" }}
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
        style={{
          backgroundColor: "#111827",
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          width: 260,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Code disponible (GitHub)
        </Text>
      </Pressable>

      {/* PayPal */}
      <Pressable
        accessibilityRole="button"
        onPress={() => Linking.openURL("https://salim.link/paypal")}
        style={{
          backgroundColor: "#1EA7FD",
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          width: 260,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Soutenir le projet 💙
        </Text>
      </Pressable>

      {/* Contact */}
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          marginTop: 8,
        }}
      >
        <Text style={{ fontWeight: "700", marginBottom: 4 }}>
          Vous avez un projet (app mobile, SaaS) ?
        </Text>
        <Text>
          Contactez-moi :{" "}
          <Text style={{ fontWeight: "700" }}>collab@sablab.fr</Text>
        </Text>
      </View>

      {/* Crédits sons */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "700" }}>Crédits sons :</Text>
        <Text style={{ color: "#374151", marginTop: 4 }}>
          • <Text style={{ fontStyle: "italic" }}>Water Faucet 4</Text> —
          utilisé pour le splashscreen
        </Text>
        <Text style={{ color: "#374151" }}>
          • <Text style={{ fontStyle: "italic" }}>Water Faucet 1</Text> —
          utilisé pour le bouton +1 verre
        </Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          Source :{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
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
