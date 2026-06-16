# Changelog

All notable release-hardening changes are summarized here. Dates are intentionally omitted until an official release is cut.

## Unreleased

### Added

- Public repository documentation package: root README, MIT license, security policy, and changelog.
- Privacy policy draft, account deletion request documentation, privacy data inventory, and Google Play Data Safety draft.
- Android build, release signing, and Google OAuth Android verification runbooks.
- Safe environment/configuration examples for frontend and backend.

### Changed

- Frontend routes use lazy loading for large public/user/admin pages.
- Auth lifecycle now includes refresh-token storage, refresh/retry behavior, and logout revocation flow.
- Admin user mutations include self/last-admin safeguards.
- Upload and AI diagnosis endpoints validate image type, size, and magic bytes.
- Swagger is development-only and CORS is fail-closed outside development.

### Removed

- Public unauthenticated AI debug endpoints from production source.
- Unsafe frontend HTML rendering in app-download instructions.
- Previously tracked local/secret/log artifacts were prepared for cleanup in CP-01, with manual review still required.

### Security

- Endpoint rate limits were added for auth, password recovery, AI, and upload flows.
- Privacy, account deletion, and AI/image third-party processing disclosures were added.

### Pending manual work

- Rotate/revoke exposed keys.
- Run Git history secret scan and decide on purge/rewrite if needed.
- Replace placeholder support/security contact.
- Validate a fresh clone.
- Select JDK 21, create upload key, build signed AAB, and complete Play Console submission work.
