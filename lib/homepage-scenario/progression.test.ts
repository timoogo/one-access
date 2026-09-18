import assert from "node:assert/strict";
import test from "node:test";
import { audits, comparison, demoRoutes, environment, pathNodes, paths, places, preferredPath, profiles } from "./scenario";
import { getScenarioState } from "./progression";
import { correspondencePoints } from "./presentation";

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
