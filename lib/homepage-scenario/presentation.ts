import type { NodeId } from "@/domain/environment/node-id";
import { demoRoutes, pathNodes, places, preferredPath } from "./scenario";

export const diagramWidth = 800;

export function routePoints(routeIndex: 0 | 1, spatialReveal: number) {
  return pathNodes(preferredPath(demoRoutes[routeIndex])).map((id) => {
    const place = Object.values(places).find((place) => place.id === id)!;
    return { id, label: place.label, x: place.x, y: 28 + (routeIndex === 1 ? place.y * spatialReveal : 0) };
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
