import assert from "node:assert/strict";
import test from "node:test";
import { audits, comparison, demoRoutes, environment, pathNodes, paths, places, preferredPath, profiles } from "./scenario";
import { getScenarioState } from "./progression";
import { correspondencePoints, formatDuration } from "./presentation";

test("duration presentation rounds seconds before formatting minutes and seconds", () => {
  const examples: readonly [number, string][] = [
    [0, "0 s"],
    [24, "24 s"],
    [48, "48 s"],
    [78, "1 min 18 s"],
    [222, "3 min 42 s"],
    [120, "2 min"],
    [720, "12 min"],
    [24.49, "24 s"],
    [24.5, "25 s"],
    [59.49, "59 s"],
    [59.5, "1 min"],
    [60.5, "1 min 1 s"],
    [119.5, "2 min"],
  ];
  for (const [seconds, expected] of examples) {
    assert.equal(formatDuration(seconds), expected);
  }
});

test("waiting visibly advances formatted duration while distance remains unchanged", () => {
  const start = getScenarioState(0.42).compared;
  const end = getScenarioState(0.55).compared;
  assert.equal(formatDuration(start.seconds), "3 min 30 s");
  assert.equal(formatDuration(end.seconds), "6 min 30 s");
  assert.equal(start.meters, end.meters);

  const final = getScenarioState(1);
  assert.equal(formatDuration(final.reference.seconds), "2 min");
  assert.equal(formatDuration(final.compared.seconds), "12 min");
  assert.equal(final.timeRatio, 6);
});

test("both preferred paths belong to the same graph and preserve A/B and edge direction", () => {
  for (const path of paths) {
    assert.equal(path.origin, places.entrance.id);
    assert.equal(path.destination, places.room.id);
    assert.equal(path.segments[0].from, path.origin);
    assert.equal(path.segments.at(-1)!.to, path.destination);
    path.segments.forEach((segment, index) => {
      const edge = environment.edges.find((edge) => edge.id === segment.edgeId);
      assert.ok(edge);
      assert.ok(environment.nodes.some((node) => node.id === segment.from));
      assert.ok(environment.nodes.some((node) => node.id === segment.to));
      const forward = edge.source === segment.from && edge.target === segment.to;
      const backward = edge.target === segment.from && edge.source === segment.to;
      assert.ok((forward && edge.direction !== "backward") || (backward && edge.direction !== "forward"));
      if (index) assert.equal(path.segments[index - 1].to, segment.from);
    });
  }
  for (const route of demoRoutes) {
    const audit = audits.find((audit) => audit.id === route.comparedPath.auditId)!;
    assert.equal(audit.environmentId, environment.id);
    assert.ok(profiles.some((profile) => profile.id === audit.profileId));
    assert.equal(audit.preferredPathId, preferredPath(route).id);
    assert.ok(audit.assessments.some((assessment) => assessment.pathId === audit.preferredPathId && assessment.usable));
  }
});

test("C appears independently; connector waits for the second arrival, matched by NodeId", () => {
  const early = getScenarioState(0.20);
  assert.ok(early.reference.reachedNodes.includes(places.landing.id));
  assert.ok(!early.compared.reachedNodes.includes(places.landing.id));
  assert.ok(!getScenarioState(0.41999).sharedReachedNodes.includes(places.landing.id));
  assert.ok(getScenarioState(0.42).sharedReachedNodes.includes(places.landing.id));
  assert.ok(!getScenarioState(0.42).sharedReachedNodes.includes(places.foyer.id));
  assert.ok(getScenarioState(0.84).sharedReachedNodes.includes(places.foyer.id));
  assert.deepEqual(getScenarioState(0).sharedReachedNodes, [places.entrance.id]);
  assert.deepEqual(getScenarioState(1).sharedReachedNodes, pathNodes(paths[0]));
});

test("waiting adds time without distance or movement; assistance reverses with progress", () => {
  const before = getScenarioState(0.43).compared;
  const after = getScenarioState(0.54).compared;
  assert.equal(before.meters, after.meters);
  assert.equal(before.cursor, after.cursor);
  assert.ok(before.seconds < after.seconds);
  assert.equal(getScenarioState(0.639).compared.assisted, false);
  assert.equal(getScenarioState(0.64).compared.assisted, true);
  assert.equal(getScenarioState(0.70).compared.meters, getScenarioState(0.64).compared.meters);
  assert.equal(getScenarioState(0.639).compared.assisted, false);
});

test("checkpoint comparison appears on second arrival and disappears when scrolling back", () => {
  for (const [nodeId, arrival] of [
    [places.landing.id, 0.42],
    [places.foyer.id, 0.84],
    [places.room.id, 0.92],
  ] as const) {
    const before = () => getScenarioState(arrival - 0.00001).checkpointComparisons.find((point) => point.nodeId === nodeId);
    assert.equal(before(), undefined);
    assert.ok(getScenarioState(arrival).checkpointComparisons.some((point) => point.nodeId === nodeId));
    assert.equal(before(), undefined);
  }
});

test("checkpoint costs use each path's first arrival, not current scroll costs or departure after waiting", () => {
  const state = getScenarioState(0.42);
  const landing = state.checkpointComparisons.find((point) => point.nodeId === places.landing.id)!;
  assert.deepEqual(landing.reference, { progress: 0.20, seconds: 40, meters: 30 });
  assert.deepEqual(landing.compared, { progress: 0.42, seconds: 210, meters: 120 });
  assert.equal(landing.timeRatio, 210 / 40);
  assert.equal(landing.distanceRatio, 120 / 30);
  assert.notEqual(landing.timeRatio, state.timeRatio);
  assert.notEqual(landing.distanceRatio, state.distanceRatio);

  const foyer = getScenarioState(0.84).checkpointComparisons.find((point) => point.nodeId === places.foyer.id)!;
  assert.equal(foyer.reference.seconds, 95);
  assert.equal(foyer.reference.meters, 65);
  assert.equal(foyer.compared.seconds, 675);
  assert.equal(foyer.compared.meters, 225);
  assert.equal(foyer.timeRatio, 675 / 95);
  assert.equal(foyer.distanceRatio, 225 / 65);
});

test("revealed checkpoints stay historical, including during waiting and later travel", () => {
  const final = getScenarioState(1).checkpointComparisons;
  for (let sample = 0; sample <= 1000; sample++) {
    const state = getScenarioState(sample / 1000);
    for (const checkpoint of state.checkpointComparisons) {
      assert.deepEqual(checkpoint, final.find((point) => point.nodeId === checkpoint.nodeId));
      assert.ok(state.reference.reachedNodes.includes(checkpoint.nodeId));
      assert.ok(state.compared.reachedNodes.includes(checkpoint.nodeId));
    }
  }
  assert.equal(final.some((point) => point.nodeId === places.entrance.id), false);
});

test("B checkpoint preserves the final time and distance ratios", () => {
  const destination = getScenarioState(0.92).checkpointComparisons.find((point) => point.nodeId === places.room.id)!;
  assert.equal(destination.reference.seconds, 120);
  assert.equal(destination.compared.seconds, 720);
  assert.equal(destination.reference.meters, 80);
  assert.equal(destination.compared.meters, 240);
  assert.equal(destination.timeRatio, 6);
  assert.equal(destination.distanceRatio, 3);
  assert.deepEqual(getScenarioState(1).checkpointComparisons.at(-1), destination);
});

test("final state agrees with domain measurements; no unmeasured scales are invented", () => {
  const final = getScenarioState(1);
  assert.equal(final.reference.seconds, comparison.reference.measurement.duration);
  assert.equal(final.reference.meters, comparison.reference.measurement.distance);
  assert.equal(final.compared.seconds, comparison.compared.measurement.duration);
  assert.equal(final.compared.meters, comparison.compared.measurement.distance);
  assert.equal(final.timeRatio, 6);
  assert.equal(final.distanceRatio, 3);
  assert.equal(final.reference.complete, true);
  assert.equal(final.compared.complete, true);
  assert.equal(final.compared.assisted, true);
  for (const side of [comparison.reference, comparison.compared]) {
    for (const dimension of ["effort", "complexity", "autonomy"]) assert.ok(!(dimension in side.measurement));
  }
  assert.deepEqual(getScenarioState(0.92).compared, final.compared);
});

test("every sampled state is deterministic backwards and connectors require both arrivals", () => {
  const forward = Array.from({ length: 1001 }, (_, index) => getScenarioState(index / 1000));
  for (let index = forward.length - 1; index >= 0; index--) {
    const state = getScenarioState(index / 1000);
    assert.deepEqual(state, forward[index]);
    for (const connection of correspondencePoints(state.sharedReachedNodes, state.spatialReveal)) {
      assert.equal(connection.from.id, connection.to.id);
      assert.ok(state.reference.reachedNodes.includes(connection.id));
      assert.ok(state.compared.reachedNodes.includes(connection.id));
    }
    if (index) {
      for (const side of ["reference", "compared"] as const) {
        assert.ok(state[side].seconds >= forward[index - 1][side].seconds);
        assert.ok(state[side].meters >= forward[index - 1][side].meters);
      }
    }
  }
});

test("progress clamps safely; zero denominators never create a fake differential", () => {
  assert.deepEqual(getScenarioState(-1), getScenarioState(0));
  assert.deepEqual(getScenarioState(2), getScenarioState(1));
  assert.deepEqual(getScenarioState(Number.NaN), getScenarioState(0));
  assert.equal(getScenarioState(0).timeRatio, null);
  assert.equal(getScenarioState(0).distanceRatio, null);
});
