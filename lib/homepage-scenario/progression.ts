import { demoRoutes, pathNodes, preferredPath, type Checkpoint } from "./scenario";
import type { NodeId } from "@/domain/environment/node-id";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (start: number, end: number, fraction: number) => start + (end - start) * fraction;

function nodeArrivals(route: (typeof demoRoutes)[number]) {
  const arrivals = new Map<NodeId, { progress: number; seconds: number; meters: number }>();
  pathNodes(preferredPath(route)).forEach((id, cursor) => {
    if (arrivals.has(id)) return;
    // First crossing, not a later departure after waiting at the same node.
    const index = route.checkpoints.findIndex((point) => point.cursor >= cursor);
    if (index < 0) return;
    const next = route.checkpoints[index];
    const previous = route.checkpoints[Math.max(0, index - 1)];
    const fraction = next.cursor === previous.cursor ? 0 : (cursor - previous.cursor) / (next.cursor - previous.cursor);
    arrivals.set(id, {
      progress: lerp(previous.progress, next.progress, fraction),
      seconds: lerp(previous.seconds, next.seconds, fraction),
      meters: lerp(previous.meters, next.meters, fraction),
    });
  });
  return arrivals;
}

const referenceArrivals = nodeArrivals(demoRoutes[0]);
const comparedArrivals = nodeArrivals(demoRoutes[1]);
const checkpointComparisons = [...referenceArrivals].flatMap(([nodeId, reference]) => {
  const compared = comparedArrivals.get(nodeId);
  // A remains connected, but its zero arrival costs have no meaningful ratios.
  if (!compared || reference.seconds <= 0 || reference.meters <= 0) return [];
  return [{
    nodeId,
    reference,
    compared,
    timeRatio: compared.seconds / reference.seconds,
    distanceRatio: compared.meters / reference.meters,
  }];
});

function routeState(route: (typeof demoRoutes)[number], progress: number) {
  const checkpoints: readonly Checkpoint[] = route.checkpoints;
  const nextIndex = checkpoints.findIndex((point) => point.progress > progress);
  const previous = checkpoints[nextIndex === -1 ? checkpoints.length - 1 : Math.max(0, nextIndex - 1)];
  const next = nextIndex === -1 ? previous : checkpoints[nextIndex];
  const fraction = next === previous ? 0 : clamp((progress - previous.progress) / (next.progress - previous.progress));
  const cursor = lerp(previous.cursor, next.cursor, fraction);
  const nodes = pathNodes(preferredPath(route));
  return {
    cursor,
    reachedNodes: nodes.filter((_, index) => index <= cursor),
    seconds: lerp(previous.seconds, next.seconds, fraction),
    meters: lerp(previous.meters, next.meters, fraction),
    assisted: previous.assisted,
    activity: previous.activity,
    complete: cursor === nodes.length - 1,
  };
}

// Demo interpolation, not an accessibility score or a shared elapsed-time clock.
export function getScenarioState(input: number) {
  const progress = Number.isNaN(input) ? 0 : clamp(input);
  const reference = routeState(demoRoutes[0], progress);
  const compared = routeState(demoRoutes[1], progress);
  const comparedReached = new Set(compared.reachedNodes);
  const sharedReachedNodes = reference.reachedNodes.filter((id) => comparedReached.has(id));
  return {
    progress,
    spatialReveal: clamp((progress - 0.12) / 0.45),
    reference,
    compared,
    sharedReachedNodes,
    checkpointComparisons: checkpointComparisons.filter((checkpoint) => sharedReachedNodes.includes(checkpoint.nodeId)),
    timeRatio: reference.seconds > 0 ? compared.seconds / reference.seconds : null,
    distanceRatio: reference.meters > 0 ? compared.meters / reference.meters : null,
  };
}

export type ScenarioState = ReturnType<typeof getScenarioState>;
