# 💰 Plan de Monétisation : "Mon Eau"

Ce document détaille les stratégies de revenus pour l'application, en équilibrant expérience utilisateur et rentabilité.

---

## 🚀 1. Modèle "Freemium" (Actuel)
L'application est gratuite avec des fonctionnalités de base. Le contenu avancé est verrouillé.

### A. Publicité (Régie Interne)
- **Format :** Bannières natives discrètes en bas des écrans (Accueil, Analyse).
- **Rotation :** Système aléatoire d'annonceurs ciblés (Fintech, Hébergement, Crypto).
- **Suppression :** Option incluse dans le Pack Premium.

### B. Pack Premium "Expert Hydratation" (4.99€ - Achat Unique)
- **Contenu :**
    - Suppression totale des publicités.
    - Accès aux thèmes exclusifs (Océan Profond, Mode Nuit).
    - Bonus immédiat de 5000 Gouttes.
    - Exportation des rapports de santé avancés.
- **Paiement :** Intégration via **Stripe Payment Links** (Zéro serveur).

---

## 📈 2. Évolutions de Monétisation (Phase 2)

### A. Boutique de "Gouttes" (Consommables)
Vente de packs de monnaie virtuelle pour accélérer la croissance de la forêt :
- **Petit Flacon :** 1000 gouttes (0.99€).
- **Grande Bouteille :** 5000 gouttes (2.99€).
- **Citerne :** 20 000 gouttes (7.99€).

### B. Abonnement "Soutien Mensuel" (1.99€/mois)
Pour les utilisateurs qui souhaitent soutenir le projet sur le long terme :
- Badge spécial "Mécène".
- Participation au choix des prochaines plantes.
- Une partie reversée aux associations (via la page Solidarité).

### C. Affiliation & Partenariats
- **Boutique d'Accessoires :** Liens affiliés vers des gourdes réutilisables, des pailles filtrantes (ex: Lifestraw) ou des filtres à eau (ex: Brita).
- **Partenariat Marques :** Codes promos exclusifs de marques d'eau minérale directement dans le "Guide des Eaux".

---

## 🛠️ 3. Implémentation Technique "Serverless"
Pour garder des coûts fixes à 0€ :
1.  **Stripe Payment Links :** Utilisation des URLs Stripe avec redirection (Return URL) vers l'app.
2.  **RevenueCat (Optionnel) :** Si on passe sur des abonnements réels via les stores (App Store/Play Store) sans gérer de serveur.
3.  **Local Storage :** Le statut Premium est stocké localement et sécurisé via les clés de signature de l'APK.

---

## 📊 4. KPIs (Indicateurs de succès)
- **Taux de conversion Premium :** Objectif 2% des utilisateurs actifs.
- **CTR (Clics sur Pubs) :** Analyser quelles marques intéressent le plus les utilisateurs.
- **Engagement Boutique :** Suivre le nombre de plantes débloquées avec les Gouttes.
