# Instructions de Build (Gradle Local)

Cette méthode permet de générer la version de production sans utiliser les serveurs Expo (EAS), évitant ainsi les files d'attente.

## 🚀 Génération des fichiers de production

Toutes les commandes doivent être exécutées depuis le dossier `android/`.

### 1. Générer l'APK (pour installation directe)
Idéal pour tester la version finale sur votre téléphone avant la publication.
```bash
cd android
./gradlew assembleRelease
```
**Fichier généré :** `android/app/build/outputs/apk/release/app-release.apk`

### 2. Générer le Bundle (pour le Play Store)
Format requis pour importer l'application sur la Google Play Console.
```bash
cd android
./gradlew bundleRelease
```
**Fichier généré :** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔑 Signature de l'application (Release)

Pour que Google accepte votre fichier, il doit être signé.
1. Générez une clé (keystore) si vous n'en avez pas.
2. Configurez les variables dans `android/gradle.properties` :
   - `MYAPP_RELEASE_STORE_FILE=my-release-key.keystore`
   - `MYAPP_RELEASE_KEY_ALIAS=my-key-alias`
   - `MYAPP_RELEASE_STORE_PASSWORD=*****`
   - `MYAPP_RELEASE_KEY_PASSWORD=*****`

---

## 📦 Checklist Play Store

### Ressources graphiques obligatoires :
- [ ] **Feature Graphic** : Image 1024x500.
- [ ] **Icône Haute Résolution** : 512x512.
- [ ] **Captures d'écran** : Téléphone, Tablette 7" et 10".

### Administratif :
- [ ] **Lien Politique de Confidentialité** : Obligatoire pour le Store.
- [ ] **Description optimisée** : Utiliser les points clés du README.
