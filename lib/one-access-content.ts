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

export type PlaceCategory = {
  id: string;
  label: string;
  rationale: string;
  observations: string[];
  examples: string[];
};

// Priorités de déploiement proposées par ONE:ACCESS.
// Ce ne sont pas des classifications réglementaires existantes.
export const placeCategories: PlaceCategory[] = [
  {
    id: "sante",
    label: "Santé",
    rationale:
      "L’accès aux soins peut devenir matériellement inégal lorsque rejoindre une consultation, un examen ou un service suppose un parcours plus long, plus complexe ou dépendant d’une assistance. Nous proposons de prioriser ces lieux, où un écart d’accès peut retarder ou compliquer une démarche de santé.",
    observations: [
      "Détours entre l’entrée et le service de soins",
      "Dépendance à un ascenseur ou à l’aide du personnel",
      "Attente introduite par le parcours accessible",
      "Écarts de temps, d’effort et d’autonomie",
    ],
    examples: ["Hôpitaux", "cabinets", "centres de soins", "pharmacies"],
  },
  {
    id: "services-publics",
    label: "Services publics",
    rationale:
      "Ce type de lieu conditionne l’accès effectif aux droits, aux démarches administratives et aux services essentiels. Nous proposons de le prioriser : lorsque le guichet ou le rendez-vous n’est atteignable qu’au prix d’un parcours plus difficile, c’est l’exercice même de la démarche qui devient inégal.",
    observations: [
      "Écart entre l’accueil principal et le guichet concerné",
      "Parcours distinct de celui du public général",
      "Recours à un tiers pour atteindre un service",
      "Continuité de la démarche jusqu’à la sortie du lieu",
    ],
    examples: ["Mairies", "préfectures", "bureaux de poste", "services sociaux"],
  },
  {
    id: "transports-gares",
    label: "Transports / gares",
    rationale:
      "Un déplacement est une chaîne : un seul maillon inaccessible peut suffire à l’interrompre. Nous proposons de prioriser ces lieux parce qu’une correspondance, un quai ou un ascenseur indisponible peut allonger tout le trajet, voire le rendre impossible.",
    observations: [
      "Correspondances plus longues ou plus complexes",
      "Accès aux quais et aux véhicules",
      "Existence d’un itinéraire alternatif crédible",
      "Conséquences d’un parcours accessible interrompu",
    ],
    examples: ["Gares", "stations de métro", "pôles d’échange", "aéroports"],
  },
  {
    id: "commerces",
    label: "Commerces",
    rationale:
      "Acheter du pain, retirer un colis, faire ses courses : ces gestes ordinaires composent l’autonomie du quotidien. Ce type de lieu est proposé car un écart d’accès y réduit directement la liberté de choisir où et quand s’approvisionner.",
    observations: [
      "Écart entre l’entrée principale et l’entrée utilisable",
      "Circulation entre les rayons, les caisses et les services",
      "Accès aux espaces annexes, comme cabines ou sanitaires",
      "Choix de commerces réellement accessibles à proximité",
    ],
    examples: ["Supermarchés", "commerces de proximité", "centres commerciaux", "banques"],
  },
  {
    id: "culture-musees",
    label: "Culture / musées",
    rationale:
      "L’enjeu n’est pas seulement d’entrer, mais de vivre la visite. Nous proposons de prioriser ces lieux pour observer si le parcours accessible offre une expérience équivalente : mêmes espaces, même continuité, mêmes possibilités de participer à la vie culturelle.",
    observations: [
      "Salles ou œuvres atteignables par un parcours distinct",
      "Visite plus longue ou fragmentée",
      "Placement et accès aux espaces de spectacle",
      "Dépendance à une assistance pour certaines parties du lieu",
    ],
    examples: ["Musées", "théâtres", "cinémas", "bibliothèques", "monuments"],
  },
  {
    id: "lieux-de-travail",
    label: "Lieux de travail",
    rationale:
      "L’accès à l’emploi ne s’arrête pas à la porte du bâtiment. Nous proposons de prioriser ces lieux car le parcours quotidien entre l’entrée, le poste de travail et les espaces communs se répète chaque jour : un écart qui semble mineur peut s’y cumuler.",
    observations: [
      "Parcours entre l’entrée et le poste de travail",
      "Accès aux salles de réunion, sanitaires et espaces communs",
      "Dépendance à un badge, un ascenseur ou un accompagnement",
      "Effet cumulé d’un même écart répété chaque jour",
    ],
    examples: ["Bureaux", "sites industriels", "campus", "espaces de coworking"],
  },
];
