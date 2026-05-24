---
context: aa-inmobiliaria
bounded-context: Real Estate Management Platform (Honduras)
---

# Glossary

## Property
A real estate listing managed by A&A Inmobiliaria. Has a type (Terreno, Lote, Casa, Comercial), location (departamento + municipio), price, optional financing plan, and a gallery of images. Stored in the `properties` table. Images stored separately in `property_images`.

## Property Status
Lifecycle state of a Property. One of:
- **borrador** — draft, not visible publicly, does not trigger Facebook auto-publish
- **disponible** — active listing, visible publicly; triggers Facebook auto-publish on creation or promotion from borrador
- **apartado** — reserved by a buyer, no longer available for new leads
- **vendido** — sold; triggers a "¡Vendido!" Facebook post on status change

## Lotification (Lotificación)
A subdivision project containing multiple individual Lots. Has a name, location, and tracks total vs. available lots. Referenced by Properties via `lotification_id`.

## Lead
A prospective buyer who expressed interest in a Property. Lifecycle: pendiente → en-conversacion → agendado → cerrado | no-prospera. Contains contact info (name, email, phone) and notes.

## Sale
A completed transaction. References a Property and records buyer details, payment method, and date. Identified by a unique reference number.

## User
An admin or superadmin who manages the platform. Authenticated via email/password (JWT) or Google OAuth. Stored in the `users` table with a `role` field.

## Facebook Auto-Publish
Automated posting to the A&A Inmobiliaria Facebook Page when a Property's status becomes `disponible` (create or promote from borrador) or `vendido`. Implemented as a fire-and-forget side effect in `PropertyUseCases` — property save never fails due to a Facebook error.

## Page Access Token
A never-expiring Facebook Graph API token scoped to the A&A Inmobiliaria Page. Stored in `FACEBOOK_PAGE_ACCESS_TOKEN` env var. Must be regenerated manually via the Facebook Developer Console if invalidated.
