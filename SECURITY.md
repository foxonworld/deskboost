# Security Policy

## Supported status

DeskBoost is currently an MVP / pre-production EXE-Capstone project. It is not yet marked public GitHub ready, Google Play ready, or production ready.

## Reporting a vulnerability

Security contact: TODO: replace with official security/support contact before public release.

Until an official contact is published, report vulnerabilities directly to the project owner through the team's private channel. Do not open a public issue containing secrets, tokens, private keys, passwords, database URLs, screenshots with credentials, or exploit details that expose users.

## Secret handling policy

- Do not commit API keys, JWT secrets, database passwords, OAuth client secrets, refresh tokens, access tokens, cookies, signing keys, keystores, or production `.env` files.
- Use `.env.example` and `appsettings.example.json` for safe placeholder shapes only.
- Rotate and revoke any exposed key before a public repository release.
- Run a Git history secret scan before marking Gate B/public GitHub readiness complete.

## Known MVP tradeoffs

- Browser token storage uses localStorage by MVP decision; secure/native storage remains future work.
- Account deletion is currently a manual request process, not automated instant deletion.
- Rate limiting uses the current app implementation and still needs production deployment validation, especially behind hosting/reverse proxies.
- Android release signing and Play App Signing remain pending manual setup.

## Release blockers

Before public GitHub readiness:

- Rotate/revoke exposed secrets.
- Complete Git history secret scan and decide whether purge/rewrite is required.
- Validate a fresh clone with only example configuration.
- Replace this TODO contact with an official security/support contact.

Do not claim perfect security. Treat the release hardening docs as the active source for remaining security work.
