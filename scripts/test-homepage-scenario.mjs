import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// Type checking is covered by `tsc --noEmit`; these tests need no browser or runner dependency.
const output = mkdtempSync(join(tmpdir(), "one-access-scenario-"));
try {
  for (const name of ["scenario", "progression", "presentation", "progression.test"]) {
    const source = readFileSync(new URL(`../lib/homepage-scenario/${name}.ts`, import.meta.url), "utf8");
    const result = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    writeFileSync(join(output, `${name}.js`), result.outputText);
  }
  execFileSync(process.execPath, [join(output, "progression.test.js")], { stdio: "inherit" });
} finally {
  rmSync(output, { recursive: true, force: true });
}
