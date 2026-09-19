// Scene composition is authored here. No gesture thresholds or camera territories.

export interface WorldPoint {
  readonly x: number;
  readonly y: number;
}

export interface AnnotationComposition {
  readonly text: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };

  readonly side: "top" | "bottom";

  readonly from: WorldPoint;
  readonly elbow: WorldPoint;
  readonly to: WorldPoint;

  readonly margin: number;
}

export interface WorldScene {
  readonly id: string;
  readonly kind: "pillar" | "info" | "endpoint";
  readonly contentId: string;
  readonly pillarNumber?: number;

  readonly node: WorldPoint;
  readonly via?: readonly WorldPoint[];

  readonly annotation: AnnotationComposition;

  readonly hold: number;
}

const below: AnnotationComposition = {
  text: {
    x: -140,
    y: 100,
    width: 280,
    height: 190,
  },

  side: "top",

  from: { x: 0, y: 16 },
  elbow: { x: 0, y: 62 },
  to: { x: 0, y: 88 },

  margin: 12,
};

const above: AnnotationComposition = {
  text: {
    x: -140,
    y: -250,
    width: 280,
    height: 190,
  },

  side: "bottom",

  from: { x: 0, y: -16 },
  elbow: { x: 0, y: -30 },
  to: { x: 0, y: -48 },

  margin: 12,
};

// A continuous route replaces the disconnected hub spokes.
// Each node is an actual route vertex.
//
// Travel duration is no longer authored per scene.
// It is derived from the actual distance travelled along the route.
//
// Values are world units, not measurements of a real accessible route.

export const scenes: readonly WorldScene[] = [
  {
    id: "departure",
    kind: "endpoint",
    contentId: "a",
    node: { x: 180, y: 300 },
    annotation: below,
    hold: 0.4,
  },

  {
    id: "info-constat",
    kind: "info",
    contentId: "constat",
    node: { x: 700, y: 300 },
    annotation: below,
    hold: 0.8,
  },

  {
    id: "info-detour",
    kind: "info",
    contentId: "detourNote",
    node: { x: 1300, y: 300 },
    annotation: below,
    hold: 0.55,
  },

  {
    id: "info-attente",
    kind: "info",
    contentId: "attenteNote",
    node: { x: 1850, y: 300 },
    annotation: below,
    hold: 0.55,
  },

  {
    id: "info-obstacle",
    kind: "info",
    contentId: "obstacleNote",
    node: { x: 2400, y: 300 },
    annotation: below,
    hold: 0.55,
  },

  {
    id: "info-assistance",
    kind: "info",
    contentId: "assistanceNote",
    node: { x: 2950, y: 300 },
    annotation: above,
    hold: 0.55,
  },

  {
    id: "info-observation",
    kind: "info",
    contentId: "observation",
    node: { x: 2950, y: 900 },
    annotation: below,
    hold: 0.9,
  },

  {
    id: "center",
    kind: "endpoint",
    contentId: "center",
    node: { x: 2350, y: 900 },
    annotation: below,
    hold: 0.75,
  },

  // 01 — DISTANCE
  {
    id: "pillar-distance",
    kind: "pillar",
    contentId: "distance",
    pillarNumber: 1,
    node: { x: 1750, y: 900 },
    annotation: below,
    hold: 0.7,
  },

  {
    id: "info-distance-1",
    kind: "info",
    contentId: "stepDistance",
    pillarNumber: 1,
    node: { x: 1150, y: 900 },
    annotation: below,
    hold: 1,
  },

  // 02 — TEMPS
  {
    id: "pillar-time",
    kind: "pillar",
    contentId: "temps",
    pillarNumber: 2,
    node: { x: 550, y: 900 },
    annotation: above,
    hold: 0.7,
  },

  {
    id: "info-time-1",
    kind: "info",
    contentId: "stepTemps",
    pillarNumber: 2,
    node: { x: 550, y: 1500 },
    annotation: below,
    hold: 1,
  },

  // 03 — EFFORT
  {
    id: "pillar-effort",
    kind: "pillar",
    contentId: "effort",
    pillarNumber: 3,
    node: { x: 1150, y: 1500 },
    annotation: below,
    hold: 0.7,
  },

  {
    id: "info-effort-1",
    kind: "info",
    contentId: "stepEffort",
    pillarNumber: 3,
    node: { x: 1750, y: 1500 },

    via: [
      { x: 1350, y: 1420 },
      { x: 1550, y: 1580 },
    ],

    annotation: below,
    hold: 1,
  },

  // 04 — COMPLEXITÉ
  {
    id: "pillar-complexity",
    kind: "pillar",
    contentId: "complexite",
    pillarNumber: 4,
    node: { x: 2350, y: 1500 },
    annotation: below,
    hold: 0.7,
  },

  {
    id: "info-complexity-1",
    kind: "info",
    contentId: "stepComplexite",
    pillarNumber: 4,
    node: { x: 2950, y: 1500 },

    via: [{ x: 2650, y: 1420 }],

    annotation: above,
    hold: 1,
  },

  // 05 — AUTONOMIE
  {
    id: "pillar-autonomy",
    kind: "pillar",
    contentId: "autonomie",
    pillarNumber: 5,
    node: { x: 2950, y: 2100 },
    annotation: below,
    hold: 0.7,
  },

  {
    id: "info-autonomy",
    kind: "info",
    contentId: "stepAutonomie",
    pillarNumber: 5,
    node: { x: 2350, y: 2100 },
    annotation: below,
    hold: 1,
  },

  // Preserve the existing editorial order:
  // overview, Universal Design, neutrality, B.

  {
    id: "info-universal",
    kind: "info",
    contentId: "universalNote",
    node: { x: 1750, y: 2100 },
    annotation: below,
    hold: 0.9,
  },

  {
    id: "info-neutrality",
    kind: "info",
    contentId: "neutralityNote",
    node: { x: 1150, y: 2100 },
    annotation: below,
    hold: 1,
  },

  {
    id: "destination",
    kind: "endpoint",
    contentId: "b",
    node: { x: 550, y: 2100 },
    annotation: below,
    hold: 0.6,
  },
];

export const overviewAfter = "info-autonomy";

export const motion = {
  arrival: 0.65,
  connector: 0.14,
  annotation: 0.26,

  overview: 3.2,
  overviewHold: 1,
  exit: 1.3,

  // Travel speed is derived from the distance along the route.
  //
  // Example with these values:
  // 200 units  -> 0.9
  // 400 units  -> 1.0
  // 600 units  -> 1.5
  // 800 units  -> 2.0
  // 1200+      -> 2.4 max
  travel: {
    unitsPerSecond: 400,
    minDuration: 0.9,
    maxDuration: 2.4,
  },

  pixelsPerUnit: 620,

  // Explicit keyboard / node-click navigation.
  navigationDuration: 2,
} as const;