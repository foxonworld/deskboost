# AGENTS.md

Portable operating instructions for Codex, Roo Code, Antigravity, OpenHands, and other coding agents.

This file is the default project-level guidance to copy into real projects. It combines the portable agent rules, Claude-style coding discipline, and Agentmemory hygiene. Keep it concise, practical, and subordinate to explicit user instructions.

## 1. Source of Truth

When this file is used inside the `ai-workflows/` repo:

- Read `MASTER_GUIDE.md` for the operating model.
- Read `PORTABILITY.md` for copy strategy across tools and projects.
- Use `.roomodes` as the Roo mode source.
- Use `roo/.roo/rules/` as Roo-specific rules.
- Use `shared/skills/` as the canonical skill source.
- Treat `claude/.claude/agents/` as Claude stubs, not the primary architecture.

When this file is copied into another project:

- Read `PROJECT_AI_NOTES.md` before meaningful work, if present.
- Use local project docs, package manifests, config, tests, and nearby code as the source of truth.
- Prefer project-specific instructions over generic workflow guidance when they conflict.
- If instructions conflict, surface the conflict before editing.

## 2. Language Requirement

Always respond in Vietnamese unless the user explicitly asks for another language.

- Keep technical terms, commands, filenames, and code identifiers in English when appropriate.
- Do not switch to English automatically.
- If the user requests another language, comply only for that response.

## 3. Think Before Coding

Do not assume. Do not hide confusion. Surface tradeoffs.

Before implementing:

- State important assumptions explicitly.
- If multiple interpretations exist, present them instead of picking silently.
- If a simpler approach exists, say so.
- If something is unclear and risky, stop and ask.
- For clear tasks, proceed with the smallest safe implementation.

For multi-step tasks, give a short plan:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

## 4. Simplicity First

Write the minimum code that solves the problem.

- No features beyond what was asked.
- No abstractions for single-use code.
- No configurability that was not requested.
- No dependency additions unless explicitly justified and approved.
- No defensive handling for impossible scenarios.
- If the solution is much larger than the problem, simplify.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, reduce it.

## 5. Surgical Changes

Touch only what the request requires.

When editing existing code:

- Preserve existing architecture.
- Reuse nearby patterns, components, utilities, scripts, and conventions.
- Match local style, even if you would normally choose a different style.
- Do not improve adjacent code, comments, or formatting.
- Do not refactor unrelated code.
- If you notice unrelated dead code or risk, mention it instead of deleting it.

When your changes create orphans:

- Remove imports, variables, functions, files, or docs that your own change made unused.
- Do not remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 6. Edit Safety

Ask before:

- Broad rewrites.
- Architecture changes.
- Dependency additions.
- Large multi-file changes.
- Generated file changes.
- Destructive commands.
- Config changes with project-wide impact.

Do not add more modes, skills, scripts, MCP config, backend lanes, extra mobile specialists, community packs, orchestration frameworks, or swarm systems unless explicitly requested.

## 7. Project Onboarding

For a new or stale project, onboard before source edits.

Inspect:

- README and project docs.
- Package manifests and lockfiles.
- Framework/build/test config.
- Routing/app entry points.
- Data/API layer.
- Styling/design system.
- State management.
- Existing tests and scripts.
- Nearby implementation patterns.

Summarize:

- Stack.
- Entry points.
- Scripts with confidence.
- Routing map.
- Data/API layer.
- Styling/design system.
- State management.
- Testing setup.
- Existing conventions.
- Risk areas.
- Do-not-touch-without-approval areas.
- Recommended first checks.
- Memory candidates.

Update `PROJECT_AI_NOTES.md` only with durable findings.

## 8. Frontend Quality Bar

For frontend work, check what is relevant:

- Existing design system, tokens, components, and layout conventions.
- Loading, error, and empty states.
- Accessibility basics: semantic HTML, keyboard/focus behavior, ARIA only when needed.
- Responsive behavior on realistic viewport sizes.
- Type safety and understandable props.
- Avoid derived state in effects when a computed value is enough.
- Avoid premature memoization.
- Avoid broad global state for local UI state.
- Avoid dependency sprawl.

Prefer UI that fits the existing product over generic "AI-generated" polish.

## 9. Verification

Define success criteria and loop until verified.

- Run the smallest useful check for the change.
- Prefer lint, typecheck, targeted tests, and focused smoke checks when available.
- Use existing test tools only; do not invent new tooling.
- For UI changes, verify the affected screen or interaction when feasible.
- Use `docs/verification-matrix.md` if present.
- Report exact commands run and results.
- If checks are skipped, state the reason and residual risk.

Typical check selection:

- Docs-only: readthrough/render check.
- CSS/UI-only: lint if available and visual smoke.
- Component logic: typecheck and targeted unit/component tests.
- Data/API: success/error/loading checks and focused smoke.
- Routing/auth: affected route, redirect, guarded state, logged-out path.
- Refactor: narrow behavior tests before/after.
- Performance-sensitive change: behavior first, then bundle/runtime signal if tooling exists.

## 10. Agentmemory Protocol

If Agentmemory or another memory repo/tool is available, use it only for durable knowledge.

Save to memory only:

- Stable project conventions.
- Durable architecture decisions.
- Repeated debugging lessons.
- Verified setup or command knowledge.
- Stable workflow preferences from the user.
- Important do-not-touch boundaries.

Do not save:

- Secrets, tokens, credentials, private keys, cookies.
- Raw logs.
- Large diffs.
- Temporary failures.
- Speculation.
- One-off task details.
- User-sensitive data that is not necessary for future work.

Before writing memory:

- Compress the note into a short durable fact.
- Prefer updating `PROJECT_AI_NOTES.md` for project-local knowledge.
- Use Agentmemory for cross-project or repeatedly useful knowledge.
- If unsure whether something is durable, do not save it.

Memory update format:

```text
Context: [project/tool/scope]
Durable fact: [short verified convention or lesson]
When useful: [future situation where this matters]
Do not include: secrets, raw logs, large diffs, temporary errors
```

## 11. Working With Existing Changes

The worktree may contain user changes.

- Never revert user changes unless explicitly requested.
- If unrelated files are dirty, ignore them.
- If dirty files affect the task, inspect them and work with them.
- Do not stage or commit unrelated changes silently.
- Before commit/push, confirm scope when the worktree is mixed.

## 12. Git and GitHub

When asked to publish:

- Inspect status before staging.
- Stage only intended files.
- Use a clear, terse commit message.
- Push only after the requested scope is committed.
- Prefer private repos when the user requests private.
- Do not create PRs unless asked.

## 13. Output Style

- Be concise and practical.
- Lead with what changed, what was verified, and what remains risky.
- Use file paths and command names precisely.
- For reviews, findings come first, ordered by severity.
- If no issues are found, say so and mention residual test gaps.

These instructions are working if diffs stay small, project conventions are preserved, verification is explicit, and memory stays clean.
