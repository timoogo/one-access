# Primitives

Ce dossier contient les types fondamentaux utilisés par le modèle ONE:ACCESS.

Les primitives sont volontairement indépendantes des domaines métier. Elles ne connaissent ni les environnements, ni les parcours, ni les profils, ni les audits.

## Règles

- Une primitive ne dépend d'aucun autre domaine ONE:ACCESS.
- Les unités incompatibles doivent rester incompatibles au niveau TypeScript.
- Les conversions d'unités doivent être explicites.
- Les concepts métier ne doivent pas être introduits dans ce dossier.
- Les identifiants métier sont déclarés dans leur domaine respectif à partir de `EntityId`.

## Types

### `Brand<T, Name>`

Permet de créer des types nominalement distincts à partir de types TypeScript structurellement identiques.

### `EntityId<Name>`

Base commune pour les identifiants des entités ONE:ACCESS.

Les identifiants concrets (`NodeId`, `PathId`, `EquipmentId`, etc.) appartiennent à leurs domaines respectifs.

### Distance

- `Meters` : distances de parcours et dimensions exprimées en mètres.
- `Centimeters` : dimensions fines, notamment celles des équipements et passages.

### Duration

- `Seconds` : unité canonique de durée dans le modèle.

La conversion en minutes ou dans une autre unité d'affichage appartient à la couche de présentation.

### Percentage

- `Percentage` : valeur exprimée en points de pourcentage.
- `7` représente `7 %`, et non `0.07`.

### Elevation

- `ElevationMeters` : altitude ou niveau vertical absolu.
- `ElevationDeltaMeters` : différence d'altitude entre deux positions.

## Dépendances

Les autres domaines peuvent dépendre de `primitives`.

`primitives` ne doit jamais dépendre d'eux.
