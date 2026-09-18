# Environment

Ce domaine décrit la structure physique dans laquelle les parcours ONE:ACCESS existent.

Il représente **ce qui existe dans l'environnement**, indépendamment des profils utilisateurs, des audits et de l'accessibilité.

## EnvironmentGraph

`EnvironmentGraph` représente un environnement sous forme de graphe.

Il possède :

- un `EnvironmentId` ;
- un ensemble de `Node` ;
- un ensemble de `Edge`.

```text
EnvironmentGraph
│
├── Node
│
├── Node
│    ╲
│     Edge
│      ╲
└────── Node
````

## Node

Un `Node` représente un point structurel significatif du graphe.

Il possède :

* un `NodeId` ;
* une `SpatialPosition`.

Un `Node` ne détermine pas à lui seul la nature ou l'accessibilité du lieu qu'il représente.

## Edge

Un `Edge` représente une connexion physique possible entre deux `Node`.

Il possède :

* un `EdgeId` ;
* un `source` ;
* un `target` ;
* une `EdgeDirection` ;
* une `PathGeometry`.

La géométrie décrit la forme spatiale de la connexion.

La distance n'est pas stockée directement sur l'`Edge`. Elle peut être calculée depuis sa géométrie. Une éventuelle distance constatée lors d'un audit appartient au domaine de la mesure.

## EdgeDirection

La direction indique dans quel sens une connexion peut être parcourue :

* `forward` : `source → target`
* `backward` : `source ← target`
* `bidirectional` : `source ↔ target`

Cette direction décrit une propriété de l'environnement et non d'un profil utilisateur.

## Invariants

* `Environment` ne connaît aucun `Profile`.
* `Environment` ne décide pas si quelque chose est accessible ou inaccessible.
* Un `Node` décrit une position structurelle, pas un profil d'utilisateur.
* Un `Edge` décrit une connexion physique, pas un parcours sélectionné.
* La géométrie reste la source structurelle du tracé.
* Les contraintes liées à un profil ou à un contexte appartiennent à l'audit, pas à l'environnement.

## Dépendances

`environment` peut dépendre de :

* `primitives`
* `geo`

`environment` ne dépend pas de :

* `profile`
* `path`
* `audit`
* `measurement`
* `comparison`

## MVP

Pour le MVP, le domaine `environment` reste volontairement minimal.

La modélisation détaillée des équipements physiques — ascenseurs, escaliers, portes, rampes et autres équipements — pourra être ajoutée lorsque les besoins du moteur l'exigeront.
