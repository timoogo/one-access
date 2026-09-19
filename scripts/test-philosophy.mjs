import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "philosophy-invariants-"));
try {
  for (const [name, sourcePath] of Object.entries({ config: "config/animations/philosophy.config.ts", world: "lib/philosophy-world/world.ts", invariants: "lib/philosophy-world/invariants.ts", camera: "lib/philosophy-world/camera.ts" })) {
    const source = readFileSync(sourcePath, "utf8").replaceAll("@/config/animations/philosophy.config", "./config");
    writeFileSync(join(output, `${name}.js`), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
  }
  const require = createRequire(import.meta.url);
  const { scenes } = require(join(output, "config.js"));
  const { route, buildRoute, pointOnRoute } = require(join(output, "world.js"));
  const { compositionErrors, segmentIntersectsRectangle } = require(join(output, "invariants.js"));
  assert.deepEqual(compositionErrors(scenes), [], "All route/connector geometry must avoid every authored text box");
  for (const scene of scenes) assert.deepEqual(pointOnRoute(route.distances[scene.id]), scene.node, scene.id);
  for (let i = 1; i < route.segments.length; i++) assert.deepEqual(route.segments[i - 1].to, route.segments[i].from);
  // The invariant must detect a broken composition, not merely pass the fixture.
  const colliding = scenes.map((s, i) => i === 2 ? { ...s, annotation: { ...s.annotation, text: { x: -30, y: -30, width: 100, height: 100 } } } : s);
  assert.ok(compositionErrors(colliding).length > 0);
  assert.equal(segmentIntersectsRectangle({x:0,y:0},{x:100,y:100},{x:40,y:40,width:20,height:20}), true);
  assert.equal(segmentIntersectsRectangle({x:0,y:0},{x:100,y:0},{x:40,y:40,width:20,height:20}), false);
  // No one-to-one dependency between pillar and information nodes.
  const variable = [scenes[0], scenes[8], scenes[10], { ...scenes[9], id: "extra-one" }, { ...scenes[9], id: "extra-two", node: { x: 1200, y: 950 } }];
  assert.equal(Object.keys(buildRoute(variable).distances).length, variable.length);
  const engine = readFileSync("lib/philosophy-world/timeline.ts", "utf8");
  assert.doesNotMatch(engine, /tweenTo\(|touchmove|wheelAccum|cooldown|snap\s*:/);
  assert.match(engine, /scrub: true/);
  assert.match(engine, /navigateToLabel\(destination.id\)/);
  assert.match(engine, /navigateToLabel\(button.dataset.node!/);
  console.log(`PASS: ${scenes.length} nodes on one continuous route; explicit connectors/text; variable information count; native input architecture.`);
} finally { rmSync(output, { recursive: true, force: true }); }
