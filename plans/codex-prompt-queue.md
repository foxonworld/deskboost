# Suggested Codex Prompt Queue

| Prompt ID | Mục tiêu | Phase | Owner | Dependency | Codex scope | Validation bắt buộc | Manual review |
|---|---|---|---|---|---|---|---|
| CP-01 | Emergency secret and tracked-file cleanup | Phase 1 | Release Owner | P0-03/P1-01 | Audit then implement cleanup; no history rewrite without explicit approval | `git status; sensitive git ls-files; secret scan; FE/BE builds` | Yes |
| CP-02 | Remove/development-gate AI debug endpoints | Phase 2 | Tuấn/BE | CP-01 | Codex implement backend | `dotnet build; route grep; prod 404 smoke` | Yes |
| CP-03 | Swagger dev-only + CORS fail-closed | Phase 2 | Tuấn/BE | CP-02 | Codex implement backend | `dotnet build; prod swagger/CORS checks` | Yes |
| CP-04 | ASP.NET Core rate limiting | Phase 2 | Tuấn/BE | CP-03 | Codex implement backend | `dotnet build; 429 checks` | Yes |
| CP-05 | AI/upload size + image validation | Phase 2 | Tuấn/BE | CP-04 | Codex implement backend | `dotnet build; invalid/oversize tests` | Yes |
| CP-06 | Refresh/logout revoke flow | Phase 2/3 | Shared | CP-05 | Codex FE+BE auth contract | `npm lint/build; dotnet build; login-refresh-logout smoke` | Yes |
| CP-07 | Admin safety guards | Phase 2 | Tuấn/BE | CP-06 | Codex backend | `dotnet build; self/last-admin cases` | Yes |
| CP-08 | Frontend auth/XSS hardening | Phase 3 | Anh/FE | CP-06 | Codex FE | `npm lint/build; session UX smoke` | Yes |
| CP-09 | Route-level code splitting | Phase 4 | Anh/FE | CP-08 | Codex FE perf | `npm build; route smoke` | Yes |
| CP-10 | Android JDK/build reproducibility | Phase 5 | Anh/FE | CP-01 | Docs/scripts | `java -version; build:mobile; cap sync; assembleDebug` | Yes |
| CP-11 | Android release signing + AAB | Phase 6 | Release Owner | CP-10 | Config/docs + manual key | `bundleRelease; verify signed AAB` | Yes |
| CP-12 | Google OAuth Android verification | Phase 7 | Shared | CP-11 | Audit/manual + docs | `SHA matrix; debug/release/internal login` | Yes |
| CP-13 | Privacy/account deletion implementation | Phase 8 | Shared | CP-12 | Docs + minimal FE; BE if scoped | `builds; links reachable; deletion path tested` | Yes |
| CP-14 | Public repository documentation | Phase 9 | Documentation | CP-01 | Docs only | `link/grep/setup dry-run` | Yes |
| CP-15 | Production deployment configuration | Phase 10 | Shared | CP-03,CP-14 | Docs/config | `deploy smoke checklist` | Yes |
| CP-16 | Release test + Play submission validation | Phase 11/12 | Release Owner | CP-11-15 | Audit/manual validation | `matrix evidence; Play pre-launch report` | Yes |

## Standard Codex Prompt Template

```text
You are Codex working in DeskBoost at D:\FPT\KY7\EXE101\deskboost.
Task: <Task ID + name>.

Requirements:
1. Recall AgentMemory/project notes before editing.
2. Read current repository files listed in the task.
3. Run `git status --short --branch` first.
4. Do not overwrite unrelated user changes.
5. Edit only task scope.
6. No redesign.
7. Do not change API contract outside scope.
8. Do not hardcode secrets.
9. Do not commit credentials, keystores, `.env`, logs, APK/AAB.
10. For large tasks: Audit → Plan ngắn → Implement → Validate → Report.
11. Run validation commands from the task.
12. Report files changed, summary, commands run, test results, remaining risks, manual actions.
13. Update durable project notes/AgentMemory only if long-term decisions changed.
```
