# Jeux de Données pour la Vérification des Règles d'Hydratation

Ce document fournit des jeux de données pour tester la fonction `calculateDailyGoal` et vérifier que les objectifs d'hydratation quotidiens sont correctement calculés en fonction des différents profils d'utilisateurs.

Les objectifs sont basés sur les recommandations de l'EFSA (2010) et des règles générales, comme détaillé dans `HydrationRules.md`.

## Structure des Données de Test

Chaque ligne du tableau représente un profil utilisateur avec ses caractéristiques et l'objectif d'hydratation attendu en millilitres (ml).

| Nom du Profil | Poids (kg) | Âge (ans/mois) | Sexe | Enceinte | Allaitante | Taille Verre (ml) | Objectif Attendu (ml) | Notes |
| :------------ | :--------- | :------------- | :--- | :------- | :--------- | :---------------- | :-------------------- | :---- |
| **Enfants**   |            |                |      |          |            |                   |                       |       |
| Bébé Léo      | 5          | 3 mois         | male | false    | false      | 50                | 725                   | 5kg * 145ml/kg |
| Bébé Mia      | 9          | 9 mois         | male | false    | false      | 100               | 900                   | EFSA 6-12 mois: 800-1000ml |
| Enfant Chloé  | 12         | 2         | female | false    | false      | 150               | 1300                  | EFSA 2-3 ans: 1300ml |
| Enfant Tom    | 20         | 6         | male | false    | false      | 200               | 1600                  | EFSA 4-8 ans: 1600ml |
| Garçon Max    | 35         | 10        | male | false    | false      | 250               | 2100                  | EFSA 9-13 ans (garçons): 2100ml |
| Fille Léa     | 35         | 10        | female | false    | false      | 250               | 1900                  | EFSA 9-13 ans (filles): 1900ml |
|               |            |           |      |          |            |                   |                       |       |
| **Adultes**   |            |           |      |          |            |                   |                       |       |
| Homme Adulte  | 70         | 30        | male | false    | false      | 250               | 2500                  | EFSA adultes (hommes): 2500ml |
| Femme Adulte  | 60         | 30        | female | false    | false      | 250               | 2000                  | EFSA adultes (femmes): 2000ml |
| Femme Enceinte | 60 | 30        | female | true     | false      | 250               | 2300                  | EFSA femmes enceintes: +300ml |
| Femme Allaitante | 60 | 30        | female | false    | true       | 250               | 2700                  | EFSA femmes allaitantes: +700ml |
|               |            |           |      |          |            |                   |                       |       |
| **Personnes Âgées** |            |           |      |          |            |                   |                       |       |
| Homme Senior  | 75         | 70        | male | false    | false      | 200               | 2500                  | EFSA personnes âgées (hommes): 2500ml |
| Femme Senior  | 65         | 70        | female | false    | false      | 200               | 2000                  | EFSA personnes âgées (femmes): 2000ml |
|               |            |           |      |          |            |                   |                       |       |
| **Cas Limites / Sans Âge** |            |           |      |          |            |                       |       |
| Homme Poids Seul | 70         | null      | male | false    | false      | 250               | 2100                  | 70kg * 30ml/kg (fallback poids) |
| Femme Poids Seul | 60         | null      | female | false    | false      | 250               | 1800                  | 60kg * 30ml/kg (fallback poids) |
| Homme Défaut  | null       | null      | male | false    | false      | 250               | 2500                  | Default adulte homme |
| Femme Défaut  | null       | null      | female | false    | false      | 250               | 2000                  | Default adulte femme |
| Enfant Jeune  | 10         | 1         | male | false    | false      | 150               | 1300                  | Age 1-3 ans, même si poids faible |
