import type { WorldPoint, WorldScene } from "@/config/animations/philosophy.config";
import { buildRoute, connectorPoints } from "./world";
export interface Rectangle { x: number; y: number; width: number; height: number }
// Liang–Barsky intersection, including the rectangle boundary. This validates
// authored composition only. It never changes placement or routes connectors.
export function segmentIntersectsRectangle(from: WorldPoint, to: WorldPoint, box: Rectangle): boolean {
  let low = 0;
  let high = 1;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  for (const [p, q] of [[-dx, from.x - box.x], [dx, box.x + box.width - from.x], [-dy, from.y - box.y], [dy, box.y + box.height - from.y]]) {
    if (p === 0) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) low = Math.max(low, t); else high = Math.min(high, t);
    if (low > high) return false;
  }
  return true;
}
export function compositionErrors(scenes: readonly WorldScene[]): string[] {
  const errors: string[] = [];
  const route = buildRoute(scenes);
  const ids = new Set<string>();
  for (const scene of scenes) {
    if (ids.has(scene.id)) errors.push(`Duplicate label: ${scene.id}`);
    ids.add(scene.id);
    const b = scene.annotation.text;
    const box = { x: scene.node.x + b.x, y: scene.node.y + b.y, width: b.width, height: b.height };
    for (const other of scenes) {
      const points = connectorPoints(other);
      for (let i = 1; i < points.length; i++) {
        if (segmentIntersectsRectangle(points[i - 1], points[i], box)) errors.push(`Connector ${other.id} crosses text ${scene.id}`);
      }
    }
    for (const segment of route.segments) {
      if (segmentIntersectsRectangle(segment.from, segment.to, box)) errors.push(`Route crosses text ${scene.id}`);
    }
    const { to, margin, side } = scene.annotation;
    const expectedY = side === "top" ? b.y - margin : b.y + b.height + margin;
    if (Math.abs(to.y - expectedY) > .001 || to.x < b.x || to.x > b.x + b.width) errors.push(`Invalid connector endpoint: ${scene.id}`);
  }
  return errors;
}
