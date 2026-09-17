// Working copy and conceptual thresholds: no official classification or scoring formula.
export const differentialLevels = [
  {
    value: "1.0",
    label: "Trajet presque équivalent",
    detail: "Une expérience proche du trajet de référence.",
  },
  {
    value: "1.6",
    label: "Écart modéré",
    detail: "Des contraintes supplémentaires à identifier.",
  },
  {
    value: "2.0",
    label: "Écart significatif",
    detail: "Des différences qui pèsent sur le parcours.",
  },
  {
    value: "3.0",
    label: "Écart important",
    detail: "Des freins majeurs à l’autonomie.",
  },
  {
    value: "∞",
    label: "Parcours impossible / exclusion",
    detail: "La destination ne peut pas être atteinte.",
  },
];

export const situations = [
  {
    title: "Trajet de référence",
    detail: "Un point de comparaison, pas un usager universel.",
  },
  {
    title: "Usage d’un fauteuil",
    detail: "Pentes, largeur de passage, accès aux ascenseurs.",
  },
  {
    title: "Déficience visuelle",
    detail: "Repérage, guidage et information perceptible.",
  },
  {
    title: "Mobilité temporaire",
    detail: "Une blessure, des béquilles, un effort à limiter.",
  },
  {
    title: "Avancée en âge",
    detail: "Rythme, repos et continuité du cheminement.",
  },
  { title: "Grossesse", detail: "Fatigue, confort et possibilités de pause." },
];

export const measurementBenefits = [
  {
    title: "Révèle les obstacles invisibles",
    text: "Repérer les détours et les dépendances que les plans ne racontent pas.",
  },
  {
    title: "Priorise les interventions",
    text: "Identifier les points où une adaptation aurait le plus d’impact.",
  },
  {
    title: "Guide les décisions",
    text: "Éclairer la conception, l’organisation et les investissements.",
  },
  {
    title: "Rend visibles les inégalités",
    text: "Documenter des expériences qui restent trop souvent des anecdotes.",
  },
  {
    title: "Déclenche l’action",
    text: "Adapter, mesurer à nouveau et suivre les progrès d’autonomie.",
  },
];

export const placeCategories = [
  "Santé",
  "Services publics",
  "Commerces",
  "Musées",
  "Gares",
  "Théâtres & cinémas",
  "Lieux de travail",
];
