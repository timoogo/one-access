# Audit

Ce domaine représente l'évaluation des parcours d'un environnement pour un profil donné.

## Audit

Un `Audit` relie :

- un environnement ;
- un profil ;
- les parcours évalués ;
- éventuellement un parcours préféré.

Le parcours préféré est choisi parmi les parcours évalués comme utilisables.

ONE:ACCESS ne suppose pas encore que ce choix est effectué automatiquement par un algorithme : il peut être déterminé par l'audit.

## PathAssessment

`PathAssessment` représente le résultat minimal de l'évaluation d'un parcours pour le profil concerné.

Pour le MVP, il indique uniquement si le parcours est utilisable.

Les raisons, contraintes, passages obligatoires et dépendances à des équipements sont volontairement reportés après le MVP.

## Invariants

- Un audit concerne exactement un environnement et un profil.
- Les parcours évalués appartiennent à l'environnement concerné.
- `preferredPathId`, lorsqu'il existe, référence un parcours évalué et utilisable.
- L'accessibilité n'est jamais une propriété intrinsèque d'un `Path`.
- Le caractère préféré d'un parcours appartient à l'audit.

## MVP

Le modèle est volontairement minimal.

Les contraintes contextuelles, équipements, passages obligatoires, causes d'indisponibilité et mécanismes avancés de sélection seront ajoutés ultérieurement.
