# Geo

Ce domaine contient les représentations spatiales utilisées par ONE:ACCESS.

Il décrit **où se trouve quelque chose** et **quelle forme possède un tracé**, sans connaître la sémantique métier du parcours.

## Types

### `GeoPoint`

Coordonnée géographique élémentaire.

Contient :
- latitude
- longitude
- élévation optionnelle

Un `GeoPoint` ne connaît ni bâtiment, ni étage, ni parcours, ni équipement.

### `LevelReference`

Référence optionnelle à un niveau lorsque la position se trouve dans un environnement multi-niveaux.

Deux représentations sont possibles et mutuellement exclusives :
- `levelNumber`
- `levelLabel`

Exemples : `2`, `"R+2"`, `"B1"`, `"Mezzanine"`.

### `SpatialPosition`

Position exploitable par ONE:ACCESS.

Elle associe :
- un `GeoPoint`
- éventuellement un `LevelReference`

Le niveau ne fait volontairement pas partie de `GeoPoint`.

### `PathGeometry`

Décrit la forme spatiale d'un tracé à partir d'une suite ordonnée de `SpatialPosition`.

`PathGeometry` ne porte aucune information métier sur le parcours.

## Responsabilités

`geo` peut représenter :

- une position géographique ;
- une position dans un environnement multi-niveaux ;
- la géométrie d'un tracé.

`geo` ne doit pas déterminer :

- si un parcours est accessible ;
- si un passage est obligatoire ;
- quel profil peut emprunter un passage ;
- ce qu'est un équipement ;
- quel parcours est préféré ;
- les mesures ONE:ACCESS.

Ces responsabilités appartiennent aux autres domaines.

## Relation avec les parcours

Une géométrie et un segment de parcours sont deux concepts distincts.

`PathGeometry` décrit **la forme du tracé**.

`PathSegment` décrit **la signification métier d'une liaison entre deux éléments du graphe** et peut référencer une `PathGeometry`.

Ainsi, les composants de visualisation peuvent exploiter la géométrie sans connaître les règles métier de ONE:ACCESS.

## Dépendances

`geo` peut dépendre de `primitives`.

`geo` ne dépend pas de `environment`, `path`, `profile`, `audit`, `measurement` ou `comparison`.