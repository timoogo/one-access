# Comparison

Ce domaine représente la comparaison ONE:ACCESS entre deux parcours préférés.

## PathComparison

Une comparaison contient :

- un parcours de référence ;
- un parcours comparé ;
- les mesures associées à chacun.

Chaque parcours comparé provient d'un audit et référence son parcours préféré.

## Invariant A → B

Les deux parcours doivent relier exactement la même origine A et la même destination B.

```text
Référence
A ─────────────────── B

Comparé
A ───── C ───── D ─── B

ONE:ACCESS mesure le différentiel nécessaire pour atteindre la même destination depuis le même point de départ.

Mesures

La comparaison exploite les cinq dimensions définies par PathMeasurement :

distance ;
temps ;
effort physique ;
complexité ;
autonomie.

Le MVP ne définit :

aucune pondération définitive ;
aucune formule globale définitive ;
aucun seuil réglementaire ;
aucun score ONE:ACCESS définitif.

La visualisation peut utiliser des valeurs illustratives tant qu'elles sont explicitement traitées comme telles.

Responsabilités

comparison compare des résultats issus des autres domaines.

Il ne :

modifie pas l'environnement ;
sélectionne pas le parcours préféré ;
détermine pas l'utilisabilité d'un parcours ;
invente pas de règles d'accessibilité.
MVP

Le MVP utilise PathComparison pour alimenter la démonstration visuelle du différentiel entre un parcours de référence et un parcours comparé.

Les mécanismes avancés de scoring, résilience, dépendances et contraintes sont hors du périmètre du MVP.
