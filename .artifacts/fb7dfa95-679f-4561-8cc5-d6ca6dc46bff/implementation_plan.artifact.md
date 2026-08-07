# Plan d'implémentation : Gamification & Monétisation

Ce plan détaille l'ajout d'un système de monnaie virtuelle (Gouttes), d'une forêt virtuelle évolutive et d'une intégration Stripe pour la monétisation.

## User Review Required

> [!IMPORTANT]
> L'intégration Stripe nécessite des clés API (Publishable Key). Pour le développement, nous utiliserons le mode "Test" de Stripe. L'utilisateur devra fournir ces clés ou configurer un backend minimal pour traiter les paiements.

## Proposed Changes

### 1. Store de Gamification
Création d'un nouveau store Zustand pour gérer l'économie du jeu.

#### [NEW] [gamification.store.ts](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/store/gamification.store.ts)
- Gestion des `gouttes` (monnaie).
- Gestion de l'XP et du `niveau`.
- Inventaire des plantes débloquées.
- État de la plante actuelle.

### 2. Lien Hydratation -> Gamification
Mise à jour de la logique métier pour récompenser l'utilisateur.

#### [MODIFY] [hydration.store.ts](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/store/hydration.store.ts)
- Appel du `gamificationStore` dans `addGlass` pour ajouter des gouttes (+10 par verre) et de l'XP.
- Bonus de gouttes lors de l'atteinte de l'objectif quotidien (+100 gouttes).

### 3. Interface Utilisateur (UI)
Rendre le système visible et interactif.

#### [NEW] [VirtualPlant.tsx](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/components/composite/VirtualPlant.tsx)
- Composant utilisant `react-native-reanimated` pour afficher une plante qui grandit selon le pourcentage d'hydratation du jour.

#### [MODIFY] [HomeScreen.tsx](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/screens/HomeScreen.tsx)
- Intégration du composant `VirtualPlant` au centre du cercle de progression.
- Affichage du solde de "Gouttes" dans l'en-tête.

### 4. Monétisation & Boutique
Installation de Stripe et création de l'interface d'achat.

#### [NEW] [ShopScreen.tsx](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/screens/ShopScreen.tsx)
- Liste des items achetables avec des Gouttes (ex: "Graine de Cactus").
- Bouton "Soutenir le projet" (Achat In-App via Stripe).

#### [MODIFY] [AppNavigator.tsx](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/app/navigation/AppNavigator.tsx)
- Ajout de l'onglet "Boutique" dans la barre de navigation.

### 5. Configuration Stripe
#### [MODIFY] [App.tsx](file:///C:/Users/Shadow/SABLAB/PERSO/mon-eau/App.tsx)
- Enveloppement de l'application avec `StripeProvider`.

## Verification Plan

### Automated Tests
- Vérifier que l'ajout d'un verre incrémente bien le solde de gouttes dans le store.
- Vérifier que le changement de niveau se déclenche au bon seuil d'XP.

### Manual Verification
- Ouvrir l'application et vérifier l'affichage de la plante.
- Simuler un achat dans la boutique (mode test Stripe).
