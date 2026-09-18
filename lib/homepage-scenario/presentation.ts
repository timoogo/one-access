import type { NodeId } from "@/domain/environment/node-id";
import { demoRoutes, pathNodes, places, preferredPath } from "./scenario";
import type { ScenarioState } from "./progression";

export const diagramWidth = 800;

export function getComparisonLayout(progress: number) {
  const phase = (start: number, end: number) => Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return {
    expansion: phase(0.15, 0.50),
    editorialOpacity: 1 - phase(0.22, 0.46),
    editorialOffset: -12 * phase(0.22, 0.46),
    railReveal: phase(0.30, 0.50),
  };
}

const comparedNodes = new Set(pathNodes(preferredPath(demoRoutes[1])));
const sharedNodes = pathNodes(preferredPath(demoRoutes[0])).filter((id) => comparedNodes.has(id));

export function checkpointRail(state: ScenarioState) {
  return sharedNodes.map((nodeId) => ({
    nodeId,
    label: Object.values(places).find((place) => place.id === nodeId)!.label,
    active: state.sharedReachedNodes.includes(nodeId),
    comparison: state.checkpointComparisons.find((checkpoint) => checkpoint.nodeId === nodeId),
  }));
}

export function formatDuration(seconds: number): string {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  if (minutes === 0) return `${roundedSeconds} s`;
  if (remainingSeconds === 0) return `${minutes} min`;
  return `${minutes} min ${remainingSeconds} s`;
}

export function routePoints(routeIndex: 0 | 1, spatialReveal: number, width = diagramWidth) {
  return pathNodes(preferredPath(demoRoutes[routeIndex])).map((id, index, nodes) => {
    const place = Object.values(places).find((place) => place.id === id)!;
    const y = 28 + (routeIndex === 1 ? place.y * spatialReveal : 0);
    const labelAnchor: "start" | "middle" | "end" = index === 0 ? "start" : index >= nodes.length - 2 ? "end" : "middle";
    return {
      id, label: place.label, x: place.x / diagramWidth * width, y,
      shortLabel: sharedNodes.includes(id) ? place.label.split(" · ")[0] : `${place.label.slice(0, id === places.lift.id ? 3 : 4)}.`,
      labelAnchor,
      // Separate shared-node names from intermediate labels on narrow plots.
      labelY: y + (width < 720 && sharedNodes.includes(id) ? -12 : 23),
    };
  });
}

export type RoutePoint = ReturnType<typeof routePoints>[number];

export function segmentDrawing(from: RoutePoint, to: RoutePoint) {
  // Orthogonal schematic bends are presentation, never node identity or measured distance.
  const cornerX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} H ${cornerX} V ${to.y} H ${to.x}`;
}

export function correspondencePoints(ids: readonly NodeId[], spatialReveal: number) {
  const reference = new Map(routePoints(0, spatialReveal).map((point) => [point.id, point]));
  const compared = new Map(routePoints(1, spatialReveal).map((point) => [point.id, point]));
  return ids.flatMap((id) => {
    const from = reference.get(id);
    const to = compared.get(id);
    return from && to ? [{ id, from, to }] : [];
  });
}
