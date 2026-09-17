<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ONE:ACCESS project knowledge

The canonical project documentation is located in `docs/vault/`.

For all work related to the Saturday MVP, read and follow:

- `docs/vault/04-only-mvp.md`

Treat it as the source of truth for MVP scope, messaging, concepts, and priorities.

The MVP document defines the allowed scope, not a requirement to implement every concept it contains.

Prioritize the smallest implementation necessary to:

1. make visitors understand the problem,
2. make visitors understand the ONE:ACCESS proposal,
3. let visitors support the initiative.

Before implementing a new feature, verify that it directly contributes to one of these three goals.

Do not implement features described only in:

- `docs/vault/03-post-mvp.md`

unless explicitly requested.

For deeper context or when a decision is ambiguous, consult:

- `docs/vault/02-synthese-par-grands-sujets.md`
- `docs/vault/01-interview-questions-reponses.md`

Do not invent missing ONE:ACCESS rules, scoring formulas, thresholds, or institutional mechanisms. If the documentation marks something as conceptual or unresolved, preserve that status.