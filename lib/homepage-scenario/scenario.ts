import type { Audit } from "@/domain/audit/audit";
import type { AuditId } from "@/domain/audit/audit-id";
import type { PathComparison } from "@/domain/comparison/path-comparison";
import type { EnvironmentGraph } from "@/domain/environment/environment-graph";
import type { EnvironmentId } from "@/domain/environment/environment-id";
import type { EdgeId } from "@/domain/environment/edge-id";
import type { NodeId } from "@/domain/environment/node-id";
import type { PathMeasurement } from "@/domain/measurement/path-measurement";
import type { Path } from "@/domain/path/path";
import type { PathId } from "@/domain/path/path-id";
import type { PathSegment } from "@/domain/path/path-segment";
import type { Meters } from "@/domain/primitives/distance";
import type { Seconds } from "@/domain/primitives/duration";
import type { Profile } from "@/domain/profile/profile";
import type { ProfileId } from "@/domain/profile/profile-id";

// Fictional indoor topology. Geographic positions are synthetic, not a real site.
// Labels, schematic coordinates and scroll timing belong to this demo, not domain/.
function node(id: string, label: string, x: number, y: number, levelNumber: number) {
  return { id: id as NodeId, label, x, y, position: {
    geoPoint: { latitude: y / 100000, longitude: x / 100000 }, levelNumber,
  } };
}

export const places = {
  entrance: node("entrance", "A · Entrée", 40, 0, 0),
  lift: node("lift-1", "Ascenseur", 160, 60, 0),
  landing: node("landing", "C · Palier", 290, 0, 1),
  reception: node("reception", "Personnel", 400, 60, 1),
  platform: node("lift-2", "Élévateur", 520, 60, 1),
  foyer: node("foyer", "F · Foyer", 640, 0, 2),
  room: node("room", "B · Salle", 760, 0, 2),
};

const referenceNodes = [places.entrance, places.landing, places.foyer, places.room];
const adaptedNodes = [places.entrance, places.lift, places.landing, places.reception, places.platform, places.foyer, places.room];

function segments(nodes: readonly (typeof places.entrance)[]): PathSegment[] {
  return nodes.slice(1).map((to, i) => ({
    edgeId: `${nodes[i].id}/${to.id}` as EdgeId, from: nodes[i].id, to: to.id,
  }));
}

export const paths: readonly Path[] = [referenceNodes, adaptedNodes].map((nodes, i) => ({
  id: `homepage-path-${i}` as PathId,
  origin: places.entrance.id,
  destination: places.room.id,
  segments: segments(nodes),
}));

const allPlaces = Object.values(places);
const uniqueSegments = new Map(paths.flatMap((path) => path.segments).map((segment) => [segment.edgeId, segment]));
export const environment: EnvironmentGraph = {
  id: "homepage-building" as EnvironmentId,
  nodes: allPlaces.map(({ id, position }) => ({ id, position })),
  edges: [...uniqueSegments.values()].map((segment) => ({
    id: segment.edgeId, source: segment.from, target: segment.to,
    direction: "bidirectional",
    geometry: { points: [segment.from, segment.to].map((id) => allPlaces.find((place) => place.id === id)!.position) },
  })),
};

export const profiles: readonly Profile[] = [
  { id: "reference" as ProfileId, label: "Profil de référence" },
  { id: "wheelchair" as ProfileId, label: "Usage d’un fauteuil" },
];

export const audits: readonly Audit[] = profiles.map((profile, i) => ({
  id: `homepage-audit-${i}` as AuditId,
  environmentId: environment.id,
  profileId: profile.id,
  assessments: paths.map((path, j) => ({ pathId: path.id, usable: i === 0 || j === 1 })),
  preferredPathId: paths[i].id,
}));

const measurements: readonly PathMeasurement[] = [
  { duration: 120 as Seconds, distance: 80 as Meters },
  { duration: 720 as Seconds, distance: 240 as Meters },
];
export const comparison: PathComparison = {
  reference: { auditId: audits[0].id, pathId: audits[0].preferredPathId!, measurement: measurements[0] },
  compared: { auditId: audits[1].id, pathId: audits[1].preferredPathId!, measurement: measurements[1] },
};

export interface Checkpoint {
  readonly progress: number;
  // Number of completed path segments. A repeated value means no movement.
  readonly cursor: number;
  readonly seconds: number;
  readonly meters: number;
  readonly assisted: boolean;
  readonly activity: string;
}

function checkpoint(progress: number, cursor: number, seconds: number, meters: number, activity: string, assisted = false): Checkpoint {
  return { progress, cursor, seconds, meters, activity, assisted };
}

export const demoRoutes = [
  {
    title: "Trajet de référence", comparedPath: comparison.reference,
    checkpoints: [
      checkpoint(0, 0, 0, 0, "Au départ"),
      checkpoint(0.06, 0, 0, 0, "Accès direct · escalier"),
      checkpoint(0.20, 1, 40, 30, "Accès direct · escalier"),
      checkpoint(0.32, 2, 95, 65, "Vers la salle"),
      checkpoint(0.42, 3, measurements[0].duration, measurements[0].distance, "Arrivée · sans assistance"),
    ],
  },
  {
    title: "Trajet avec accès adapté", comparedPath: comparison.compared,
    checkpoints: [
      checkpoint(0, 0, 0, 0, "Au départ"),
      checkpoint(0.06, 0, 0, 0, "Détour vers l’ascenseur"),
      checkpoint(0.24, 1, 90, 65, "Ascenseur vers le palier"),
      checkpoint(0.42, 2, 210, 120, "Attente au palier"),
      checkpoint(0.55, 2, 390, 120, "Vers le personnel"),
      checkpoint(0.64, 3, 435, 165, "Intervention du personnel", true),
      checkpoint(0.70, 3, 555, 165, "Vers le second élévateur", true),
      checkpoint(0.76, 4, 600, 195, "Second élévateur", true),
      checkpoint(0.84, 5, 675, 225, "Vers la salle", true),
      checkpoint(0.92, 6, measurements[1].duration, measurements[1].distance, "Arrivée · assistance obligatoire", true),
    ],
  },
] as const;

export function preferredPath(route: (typeof demoRoutes)[number]): Path {
  return paths.find((path) => path.id === route.comparedPath.pathId)!;
}

export function pathNodes(path: Path): readonly NodeId[] {
  return [path.origin, ...path.segments.map((segment) => segment.to)];
}
