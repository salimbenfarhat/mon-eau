# 🌊 Mon Eau : Game Design & Roadmap

Ce document définit la vision complète de l'application, fusionnant santé, gamification et monétisation.

---

## 🧭 1. Scénario Complet : Le Parcours du "Gardien de l'Eau"

| Phase | Action Utilisateur | Réaction App / Gamification |
| :--- | :--- | :--- |
| **1. Éveil** | Crée son profil (Poids, Âge, etc.). | L'app offre une **Graine de base** et 50 Gouttes de bienvenue. |
| **2. Engagement** | Ajoute son premier verre d'eau. | Son de "goutte" + XP gagné + La graine germe (animation). |
| **3. Routine** | Boit régulièrement toute la journée. | La plante grandit. Barre d'XP progresse. Rappels bienveillants. |
| **4. Triomphe** | Atteint 100% de son objectif. | La plante fleurit. Grosse récompense en Gouttes + Bonus de série (Streak). |
| **5. Expansion** | Accumule assez de Gouttes. | Va dans la **Boutique** pour acheter un Cactus ou un Arbre Tropical. |
| **6. Prestige** | Veut l'expérience ultime. | Achète le **Pack Premium** (Stripe) : Thème Nuit, Plantes Rares, Statistiques Santé. |

---

## 📈 2. Système de Progression (Niveaux)

L'utilisateur gagne **5 XP par verre** et **50 XP par objectif atteint**. Chaque niveau demande **100 XP**.

| Niveau | Titre | Récompense | Visuel Plante |
| :--- | :--- | :--- | :--- |
| **1** | Graineur Novice | - | Graine / Pousse |
| **2-5** | Arroseur Amateur | +20 Gouttes / niv | Jeune Plante |
| **6-10** | Gardien des Sources | Débloque le "Cactus" | Arbuste |
| **11-20** | Protecteur du Fleuve | Débloque la "Fleur de Lotus" | Arbre moyen |
| **21-50** | Seigneur de la Pluie | Multiplicateur Gouttes x1.2 | Grand Arbre |
| **50+** | Maître des Océans | Badge Légendaire | Forêt complète |

---

## 🏆 3. Catalogue des Badges (Succès)

| ID | Nom du Badge | Critère de Déblocage | Icône |
| :--- | :--- | :--- | :--- |
| `first_glass` | Premier Pas | Boire son tout premier verre. | `water` |
| `seven_day_streak` | Semaine Parfaite | Atteindre l'objectif 7 jours de suite. | `calendar` |
| `early_bird` | Lève-tôt | Boire 500ml avant 9h du matin. | `sunny` |
| `hydration_master` | Maître Hydratant | Boire un total de 100 Litres (cumulé). | `trophy` |
| `night_owl` | Hibou | Enregistrer un verre après 23h. | `moon` |
| `botanist` | Botaniste | Posséder 3 types de plantes différentes. | `leaf` |

---

## 🛒 4. Économie & Monétisation (Gouttes & Stripe)

### Gains (Gouttes)
- **Verre d'eau :** +10 Gouttes.
- **Objectif quotidien (100%) :** +100 Gouttes.
- **Nouveau record de série :** +200 Gouttes.

### Dépenses (Boutique)
- **Nouvelle Graine (Cactus) :** 500 Gouttes.
- **Nouvelle Graine (Fleur rare) :** 1500 Gouttes.
- **Engrais (Boost XP x2 pour 24h) :** 300 Gouttes.

### Premium (Stripe Payment Link)
- **Pack "Expert" (4.99€) :** 
    - Suppression des publicités (si ajoutées).
    - Thème Visuel "Océan Profond" & "Désert".
    - 5000 Gouttes offertes.
    - Export des données santé (PDF/CSV).

---

## 🗺️ 5. État d'Avancement & Checklist "App Complète"

### ✅ Fait (Prêt pour test)
- [x] Moteur d'hydratation (Calcul objectifs, Logs).
- [x] Multi-profils.
- [x] Store de Gamification (XP, Niveaux, Gouttes).
- [x] UI Plante Virtuelle (Animation de base).
- [x] Navigation & Boutique UI.
- [x] Build APK via Gradle Local.

### 🚧 À faire (Priorité Haute)
- [ ] Remplacer les alertes de paiement par des **Stripe Payment Links**.
- [ ] Ajouter des **vrais visuels/icones** pour les étapes de croissance.
- [ ] Implémenter le changement de plante actuelle dans la Home.

### 💡 Idées pour plus tard (Optionnel)
- [ ] Partage de réussite sur les réseaux sociaux.
- [ ] Widget pour l'écran d'accueil Android.
- [ ] Intégration Google Fit / Apple Health.
