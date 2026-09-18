# Path

Ce domaine décrit les parcours possibles à travers un environnement ONE:ACCESS.

Un `Path` représente une solution A → B dans un `EnvironmentGraph`.

Il ne détermine pas si ce parcours est accessible, préférable ou obligatoire pour un profil donné. Ces décisions appartiennent à l'audit.

## Path

Un `Path` possède :

- un `PathId` ;
- une origine (`origin`) ;
- une destination (`destination`) ;
- une suite ordonnée de `PathSegment`.

```text
Path

A ───── C ───── D ───── B
│                       │
origin             destination

L'origine et la destination sont explicites même si elles peuvent être déduites des segments.

Cette redondance est volontaire : A et B constituent un invariant métier central de ONE:ACCESS.

Deux parcours comparés doivent relier la même origine à la même destination.

PathSegment

Un PathSegment représente l'utilisation d'un Edge par un parcours.

Il possède :

un edgeId ;
un from ;
un to.

Edge.source et Edge.target décrivent la structure de la connexion dans l'environnement.

PathSegment.from et PathSegment.to décrivent le sens dans lequel un parcours particulier emprunte cette connexion.

Environment

source ───── Edge ───── target


Path

from   ───── Edge ───── to

Cette distinction permet notamment à un parcours d'emprunter un Edge bidirectionnel dans l'un ou l'autre sens.

Géométrie

PathSegment ne duplique pas la géométrie de l'Edge.

Il référence l'Edge, dont la PathGeometry constitue la représentation spatiale de la connexion.

La géométrie complète d'un parcours peut donc être reconstruite à partir de la suite ordonnée de ses segments et de l'environnement associé.

Invariants
Un Path appartient conceptuellement à un environnement.
Tous les segments d'un Path forment une séquence continue.
Le premier segment commence à origin.
Le dernier segment termine à destination.
Chaque PathSegment référence un Edge existant dans l'environnement concerné.
Le sens from → to doit être compatible avec la direction de l'Edge.
Un Path ne connaît aucun Profile.
Un Path n'est pas intrinsèquement accessible ou inaccessible.
Un Path n'est pas intrinsèquement préféré.
Les métriques ONE:ACCESS ne sont pas stockées dans Path.

Ces invariants pourront être vérifiés par des fonctions dédiées lorsque le moteur en aura besoin ; ils ne nécessitent pas d'être dupliqués dans les types du MVP.

Relation avec l'audit

Plusieurs Path peuvent relier les mêmes points A et B.

              ┌──── Path 1 ────┐
A ────────────┼──── Path 2 ────┼──────── B
              └──── Path 3 ────┘

L'audit évalue ces parcours dans le contexte d'un profil et peut désigner un parcours préféré.

Le choix du parcours préféré n'appartient donc pas au domaine path.

Dépendances

path peut dépendre de :

primitives
environment

path ne dépend pas de :

profile
audit
measurement
comparison
MVP

Pour le MVP, path reste volontairement limité à :

PathId
Path
PathSegment

Les caractéristiques avancées d'un parcours seront ajoutées uniquement lorsqu'un besoin métier concret les nécessitera.
