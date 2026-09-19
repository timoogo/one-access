// Narrative copy for /philosophie, kept apart from geometry/motion — same
// split as lib/one-access-content.ts vs config/animations/*.config.ts.
// Grounded in docs/vault/04-only-mvp.md (§1 problème, §2 proposition,
// §4 universal design, §5 neutralité technique, §6 unité A→B, §7 cinq
// dimensions). No formula, threshold or mechanism is invented beyond it.

import type { WorldScene } from "@/config/animations/philosophy.config";
import { alternateBendLabels } from "./world";

export const centerLabel = {
  primary: "ONE:ACCESS",
  secondary: "PHILOSOPHIE",
} as const;

export const endpointLabels = { a: "A", b: "B" } as const;

// The opening question is fully visible before scrolling.
export const introQuestion = {
  mast: ["ONE:ACCESS", "PHILOSOPHIE"],
  question: ["C’EST QUOI", "ONE:ACCESS ?"],
  cue: "SCROLL ↓",
} as const;

// Existing pillar names, shared by annotations and navigation.
export const pillarName: Record<string, string> = {
  distance: "DISTANCE",
  temps: "TEMPS",
  effort: "EFFORT PHYSIQUE",
  complexite: "COMPLEXITÉ",
  autonomie: "AUTONOMIE",
};

// Existing information copy; composition and timing live outside this file.
export const pillarStepText: Record<string, string> = {
  stepDistance: "LA DISTANCE NE DIT RIEN SEULE. C’EST L’ÉCART QUI NOUS INTÉRESSE.",
  stepTemps: "LE TEMPS RÉVÈLE CE QUE LA DISTANCE NE DIT PAS : L’ATTENTE QUI S’AJOUTE.",
  stepEffort: "MÊME DESTINATION. EFFORT DIFFÉRENT.",
  stepComplexite: "PLUS D’ÉTAPES, PLUS DE DÉCISIONS, PLUS DE RISQUES DE RUPTURE.",
  stepAutonomie: "ATTEINDRE B NE VEUT PAS DIRE L’ATTEINDRE SEUL.",
};

// Shared wording for the visual representation and semantic transcript.
export function sceneKicker(scene: WorldScene): string {
  const prefix = scene.kind === "pillar" ? "PILIER" : "STEP";
  return `${prefix} 0${scene.pillarNumber}`;
}

export function sceneBody(scene: WorldScene): string {
  return scene.kind === "pillar" ? pillarName[scene.contentId] : pillarStepText[scene.contentId];
}

// Existing journey annotations. The four bend markers use a kicker only.
export const journeyAnnotationText: Record<string, { kicker: string; body?: string }> = {
  constat: { kicker: "CONSTAT", body: "« ACCESSIBLE » NE VEUT PAS DIRE « ÉQUIVALENT »." },
  detourNote: { kicker: "DÉTOUR" },
  attenteNote: { kicker: "ATTENTE" },
  obstacleNote: { kicker: "OBSTACLE" },
  assistanceNote: { kicker: "ASSISTANCE" },
  observation: { kicker: "OBSERVATION", body: "UN ACCÈS PEUT EXISTER SANS ÊTRE ÉQUIVALENT." },
  universalNote: { kicker: "UNIVERSAL DESIGN", body: "UN MÊME PARCOURS, QUAND C’EST POSSIBLE." },
  neutralityNote: { kicker: "NEUTRALITÉ", body: "ONE:ACCESS NE DIT PAS COMMENT CONSTRUIRE. IL MESURE CE QUE LA SOLUTION PRODUIT." },
};

// Full narrative, always in the DOM — the reduced-motion / static
// presentation's primary content, and the animated presentation's
// screen-reader-only equivalent. Nothing here depends on the animation.
export const fullNarrative = [
  {
    heading: "C’est quoi ONE:ACCESS ?",
    paragraphs: [
      "Cette question n’a pas de réponse immédiate ici : elle se construit progressivement, comme sur la page elle-même.",
    ],
  },
  {
    heading: "Accessible ≠ équivalent",
    paragraphs: [
      "Le parcours part de A. « Accessible » décrit un premier segment du trajet.",
      "« Accessible » ne veut pas dire « équivalent ».",
    ],
  },
  {
    heading: "Même A. Même B.",
    paragraphs: [
      "Deux parcours partent du même point vers la même destination : un trajet de référence, direct, et un second trajet qui rencontre, sur le tracé, " +
        alternateBendLabels.map((bend) => bend.label.toLowerCase()).join(", ") + ".",
      "Un accès peut exister sans être équivalent.",
    ],
  },
  {
    heading: "ONE:ACCESS, au centre",
    paragraphs: [
      "ONE:ACCESS veut mesurer quelque chose : l’écart réel entre ce parcours de référence et le parcours réellement disponible.",
    ],
  },
  {
    heading: "Distance",
    paragraphs: [
      "La distance ne dit rien seule. C’est l’écart entre un repère de référence (≈ 80 m, illustratif) et le parcours comparé (≈ 233 m, illustratif) qui nous intéresse.",
    ],
  },
  {
    heading: "Temps",
    paragraphs: [
      "Le temps révèle ce que la distance ne dit pas : l’attente qui s’ajoute (≈ 2 min contre ≈ 11 min, illustratif).",
    ],
  },
  {
    heading: "Effort physique",
    paragraphs: [
      "Même destination, effort différent : un trajet peut être lisse, un autre accidenté.",
    ],
  },
  {
    heading: "Complexité",
    paragraphs: [
      "Plus d’étapes, plus de décisions, plus de risques de rupture du parcours.",
    ],
  },
  {
    heading: "Autonomie",
    paragraphs: [
      "Atteindre B ne veut pas dire l’atteindre seul : un parcours peut être interrompu par un point où l’intervention d’un tiers devient nécessaire avant de pouvoir continuer.",
    ],
  },
  {
    heading: "Ce que révèle le dézoom",
    paragraphs: [
      "Tout ce qui vient d’être parcouru — A, le virage accessible/équivalent, les deux trajets, les cinq piliers — appartient à une seule et même carte, centrée sur ONE:ACCESS.",
    ],
  },
  {
    heading: "La réponse",
    paragraphs: [
      "« On ne mesure pas seulement si vous pouvez arriver à B. On mesure ce qu’il vous en coûte pour y arriver. »",
    ],
  },
  {
    heading: "Universal design",
    paragraphs: [
      "Un même parcours, quand c’est possible : ONE:ACCESS privilégie le trajet commun plutôt qu’un trajet séparé, sans imposer que tout le monde emprunte toujours exactement le même chemin.",
    ],
  },
  {
    heading: "Neutralité technique",
    paragraphs: [
      "ONE:ACCESS ne dit pas comment construire. Deux solutions différentes peuvent produire des parcours différents.",
      "Il mesure ce que la solution produit.",
    ],
  },
  {
    heading: "B",
    paragraphs: [
      "Le trajet atteint B. Toute cette page était elle-même un parcours : A → philosophie ONE:ACCESS → B.",
    ],
  },
] as const;

// The animation and semantic navigation share these existing strings.
export function sceneText(scene: WorldScene): { kicker: string; body: string; short: string } {
  if (scene.pillarNumber) {
    const name = Object.values(pillarName)[scene.pillarNumber - 1];
    return { kicker: sceneKicker(scene), body: sceneBody(scene), short: name };
  }
  if (scene.contentId === "a" || scene.contentId === "b") return { kicker: "", body: scene.contentId.toUpperCase(), short: scene.contentId.toUpperCase() };
  if (scene.contentId === "center") return { kicker: centerLabel.secondary, body: centerLabel.primary, short: centerLabel.primary };
  const text = journeyAnnotationText[scene.contentId];
  return { kicker: text.kicker, body: text.body ?? "", short: text.kicker };
}
