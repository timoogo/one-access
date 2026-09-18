# Measurement

Ce domaine contient les mesures utilisées pour décrire un parcours dans ONE:ACCESS.

## PathMeasurement

Le MVP représente les cinq dimensions principales :

- distance ;
- temps ;
- effort physique ;
- complexité ;
- autonomie.

La distance utilise `Meters` et le temps utilise `Seconds`.

Aucune échelle définitive n'est encore définie pour l'effort, la complexité et l'autonomie. Ces valeurs restent donc provisoires et ne constituent pas une formule ou un standard validé.

## Invariants

- Une mesure décrit un parcours ; elle ne modifie pas le parcours.
- Les mesures ne déterminent pas à elles seules quel parcours est préféré.
- Aucune pondération entre les cinq dimensions n'est définie dans le MVP.
- Aucun score global définitif n'est défini dans le MVP.
