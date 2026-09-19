import { scenes, type WorldPoint, type WorldScene } from "@/config/animations/philosophy.config";

export interface RouteSegment { from: WorldPoint; to: WorldPoint; start: number; length: number }
export function buildRoute(items: readonly WorldScene[]) {
  const points: WorldPoint[] = [items[0].node];
  const segments: RouteSegment[] = [];
  const distances: Record<string, number> = { [items[0].id]: 0 };
  let length = 0;
  for (const scene of items.slice(1)) {
    for (const to of [...(scene.via ?? []), scene.node]) {
      const from = points[points.length - 1];
      const segmentLength = Math.hypot(to.x - from.x, to.y - from.y);
      segments.push({ from, to, start: length, length: segmentLength });
      length += segmentLength;
      points.push(to);
    }
    distances[scene.id] = length;
  }
  return { points, segments, distances, length, d: points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ") };
}
export const route = buildRoute(scenes);
export function pointOnRoute(distance: number): WorldPoint {
  const segment = route.segments.find(s => distance <= s.start + s.length) ?? route.segments[route.segments.length - 1];
  if (Math.abs(distance - segment.start - segment.length) < 1e-7) return segment.to;
  if (Math.abs(distance - segment.start) < 1e-7) return segment.from;
  const t = Math.max(0, Math.min(1, (distance - segment.start) / segment.length));
  return { x: segment.from.x + (segment.to.x - segment.from.x) * t, y: segment.from.y + (segment.to.y - segment.from.y) * t };
}
export function connectorPoints(scene: WorldScene): WorldPoint[] {
  return [scene.annotation.from, scene.annotation.elbow, scene.annotation.to].map(p => ({ x: scene.node.x + p.x, y: scene.node.y + p.y }));
}
export function connectorPath(scene: WorldScene) {
  return connectorPoints(scene).map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
}
// These labels also supply existing prose in fullNarrative. They are not
// positioned on the path.
export const alternateBendLabels = [
  { label: "DÉTOUR" }, { label: "ATTENTE" }, { label: "OBSTACLE" }, { label: "ASSISTANCE" },
];
export function compositionBounds(items: readonly WorldScene[]) {
  const points = items.flatMap(scene => {
    const { node: p, annotation: { text: b } } = scene;
    return [p, ...(scene.via ?? []), { x: p.x + b.x, y: p.y + b.y }, { x: p.x + b.x + b.width, y: p.y + b.y + b.height }];
  });
  return { minX: Math.min(...points.map(p => p.x)) - 70, maxX: Math.max(...points.map(p => p.x)) + 70,
    minY: Math.min(...points.map(p => p.y)) - 70, maxY: Math.max(...points.map(p => p.y)) + 70 };
}
