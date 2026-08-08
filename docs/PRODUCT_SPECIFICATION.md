# 📄 Fiche Produit Détaillée : Mon Eau (My Water)

Ce document constitue la référence officielle du produit digital **Mon Eau**. Il détaille la vision, les fonctionnalités techniques, le modèle économique et la politique de confidentialité pour toute utilisation externe (Play Store, Marketing, IA, Partenaires).

---

## 1. Vision et Mission
**Mon Eau** est un compagnon d'hydratation intelligent conçu pour transformer une nécessité physiologique en une habitude engageante et ludique. L'application se distingue par son approche **"Privacy-First"** (données locales) et sa dimension **éco-solidaire**.

- **Slogan :** L'hydratation qui vous ressemble.
- **Cible :** Adultes, sportifs, femmes enceintes/allaitantes, parents (suivi des nourrissons).
- **Valeur Unique :** Calcul ultra-précis des besoins basé sur des critères physiologiques réels et gamification par une forêt virtuelle.

---

## 2. Fonctionnalités Clés

### 🩺 Santé et Personnalisation
- **Moteur de Calcul Scientifique :** Ajustement de l'objectif quotidien selon le poids, l'âge, le sexe et l'état physiologique (grossesse/allaitement).
- **Gestion Multi-Profils :** Possibilité de suivre plusieurs membres de la famille sur un seul appareil.
- **Alertes de Sécurité :** Détection de sur-hydratation (plus de 1L/heure) et alertes de déshydratation chronique.
- **Rappels Intelligents :** Notifications programmables pour ne jamais oublier de boire.

### 🎮 Gamification (Système "Forêt d'Eau")
- **Plante Virtuelle Évolutive :** Une plante au centre de l'accueil qui grandit en temps réel selon le % d'hydratation.
- **Économie de "Gouttes" :** Monnaie virtuelle gagnée à chaque verre bu.
- **Progression par Niveaux :** Système d'XP permettant de passer de "Graineur Novice" à "Maître des Océans".
- **Système de Badges :** Succès déblocables (ex: "Semaine Parfaite", "Lève-tôt") partageables sur les réseaux sociaux.

### 📊 Analytics et Éducation
- **Tableau de Bord Santé :** Graphiques sur 7 jours et analyse des tendances.
- **Rapport Médical PDF :** Exportation d'un rapport complet structuré pour les médecins ou le DMP (Dossier Médical Partagé).
- **Guide des Eaux :** Comparatif des eaux minérales, de source et du robinet avec conseils de lecture d'étiquettes.

### 🤝 Engagement Solidaire
- **Section Solidarité :** Mise en avant d'associations (UNICEF, Action contre la Faim) luttant pour l'accès à l'eau potable dans le monde.

---

## 3. Architecture Technique

- **Framework :** React Native (Expo SDK 54 / Native Gradle Build).
- **Langage :** TypeScript / Kotlin.
- **Gestion d'État :** Zustand (avec persistance locale via AsyncStorage).
- **UI/Animations :** React Native Reanimated, SVG, Ionicons.
- **PDF :** Expo-Print (Conversion HTML vers PDF).
- **Localisation :** Support complet du Français (extensible).

---

## 4. Politique de Confidentialité (Data Safety)

L'application suit une règle stricte de **Zéro Donnée Externe**.

- **Collecte :** Aucune donnée personnelle (Nom, Poids, Consommation) n'est transmise à des serveurs tiers ou au développeur.
- **Stockage :** 100% local sur l'appareil de l'utilisateur.
- **Sécurité :** Chiffrement natif Android/iOS des données au repos.
- **Suppression :** Totale lors de la suppression d'un profil ou de la désinstallation de l'app.
- **Publicité :** Régie interne statique (pas de tracking publicitaire via SDK tiers intrusifs).

---

## 5. Modèle de Monétisation (Freemium)

### Gratuit
- Accès au suivi de base, aux notifications, au guide des eaux et à la première plante.
- Bannières publicitaires rotatives (partenariats sélectionnés).

### Pack Premium "Expert Hydratation" (Prévu)
- Suppression des publicités.
- Thèmes visuels exclusifs (Océan, Nuit).
- Bonus de monnaie virtuelle (5000 Gouttes).
- Exportation illimitée des rapports PDF.

---

## 📅 Roadmap de Développement

1. **V1.0 (Actuelle) :** Lancement, Hydratation, Gamification de base, Analytics, Export PDF.
2. **V1.1 :** Intégration Google Play Billing, Nouveaux types de plantes.
3. **V1.2 :** Widget Android pour l'écran d'accueil, synchronisation Google Fit.
4. **V2.0 :** Mode Social (Classements anonymes), Partenariats avec des marques de gourdes connectées.

---
**Contact Auteur :** Salim Benfarhat - collab@sablab.fr
**GitHub :** [https://github.com/salimbenfarhat/mon-eau](https://github.com/salimbenfarhat/mon-eau)
