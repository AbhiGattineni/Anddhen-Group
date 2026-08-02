# Anddhen — Django → Firebase Multi-Provider Migration Plan

## Goal
Stop paying ₹8k/month for a hosted Django backend by moving data to Firebase (Firestore +
Storage), while keeping the door open to reintroduce Django later. The frontend talks to a
single **Connector Service** that can switch between a **Firebase** provider and a **Django**
provider at runtime. No model/table is left behind.

```
React UI ─▶ Connector Service ─▶ (Firebase adapter | Django adapter) ─▶ data ─▶ UI
                    ▲
             provider selector (Firebase default; Django togglable)
```

---

## Progress
- **Phase 1 (connector scaffolding) — DONE.** `src/services/connector/` with registry
  (21 resources), django + firebase adapters, ProviderContext + ProviderSwitch, facade.
  Wired into `src/index.js`; `useGetSubsidiaries` migrated as reference. Default = django
  (no behavior change). All files Babel-compile clean.
- **Phase 2 (Firestore setup + schema) — DONE (code).** Env-driven `firebase.js`;
  `firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`;
  `firestore/schema.md` (21 collections), `firestore/seed.js`, `firestore/README.md`.
  Remaining Phase-2 = human console/CLI steps (create project resources, `firebase deploy`,
  run seed) + Phase 1.5 Auth consolidation.
- **Phase 4 (Cloud Functions) — DONE (code).** `functions/` project: `aiSuggestions`
  (OpenAI moved server-side — client key removed), `parseResume` (pdf/docx text
  extraction, replaces Django), `getDefaultWords`/`setDefaultWords` (Firestore
  `config/defaultWords` doc). Frontend rewired: `AISuggestions.jsx` and `ResumeHome.jsx`
  now call the functions via `services/connector/functions.js`. Remaining = human:
  `cd functions && npm i`, set the `OPENAI_API_KEY` secret, `firebase deploy --only functions`,
  and **rotate the exposed OpenAI key**.
- **Next:** Phase 1.5 (Auth console work) ∥ migrate remaining ~20 in-component axios/fetch
  calls to `connector.*`, then Phase 3 per-resource `normalize()` (see §4b), verified
  against the live `anddhen` project.

---

## 0. Key decisions to lock first

### 0.1 Firebase project — DECIDED: consolidate onto `anddhen`
Everything (Auth + Firestore + Storage) lives on the **new `anddhen` project** whose credentials
were supplied. Auth moves off `anddhen-group`. Because the database has **zero records** today,
there is no data migration — only Auth config + existing users need to move.

New single config (`src/services/Authentication/firebase.js`):
```js
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APP_KEY,        // AIzaSyDyF8KL3IriKUnNDYhhZXBoxwqbxxhqqpY
  authDomain: 'anddhen.firebaseapp.com',
  projectId: 'anddhen',
  storageBucket: 'anddhen.firebasestorage.app',
  messagingSenderId: '258132609295',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,          // 1:258132609295:web:57d3f5211a038c85ce167a
  measurementId: 'G-JZEQ2L9FEV',
};
```
Move the literal keys into `.env` (`REACT_APP_FIREBASE_APP_KEY`, `REACT_APP_FIREBASE_APP_ID`),
matching the existing pattern. Because Auth and data now share one project, Firestore rules can
use `request.auth` directly — the strongest, simplest security model.

**Auth migration checklist (see new Phase 1.5):**
- In the `anddhen` console, enable the same sign-in providers currently used on `anddhen-group`:
  Google, Facebook, GitHub, Email/Password.
- Re-register OAuth client IDs / secrets (Google, Facebook app, GitHub OAuth app) and add
  authorized domains (the Vercel domain + `anddhen.firebaseapp.com`).
- Export existing users from `anddhen-group` and import into `anddhen`:
  `firebase auth:export users.json -P anddhen-group` then
  `firebase auth:import users.json -P anddhen --hash-algo=...` (preserves password hashes;
  Google/social users re-link automatically on next sign-in).
- Update `.env` + redeploy; verify each sign-in method end to end.

### 0.2 Compute endpoints cannot become Firestore collections
"Every model/table" migrates cleanly to Firestore. But some endpoints are **compute**, not
storage, and have no table to copy:
- `POST /api/parse-resume/` (resume parsing)
- `finance_agent` services (finance AI)
- OpenAI-backed `AISuggestions`, `HousePricePredictor`
These must move to **Firebase Cloud Functions** (pay-per-invocation, ~free at low volume) or stay
on a tiny function host. They are out of scope for the "copy the DB" work but must be tracked so
the UI features don't break. The connector treats them as a third capability: `callFunction()`.

### 0.3 Secrets currently shipped to the browser
`.env` exposes `REACT_APP_OPENAI_API_KEY = sk-...` (and others) client-side. Moving OpenAI calls
into Cloud Functions is the chance to pull that key server-side. Flagged, not blocking.

---

## 1. Connector Service design

New folder: `src/services/connector/`

```
connector/
  types.js            # JSDoc typedefs: DataProvider interface
  registry.js         # resource -> { collection, djangoPaths } mapping (single source of truth)
  ProviderContext.jsx # React context: active provider ('firebase' | 'django'), setter, persisted
  index.js            # useConnector() hook + connector.<op> facade
  adapters/
    djangoAdapter.js  # wraps existing axios REST (current behavior, unchanged)
    firebaseAdapter.js# Firestore CRUD + Storage uploads
    functionsAdapter.js # Cloud Functions for compute endpoints (shared by both providers)
```

### 1.1 The provider interface (both adapters implement)
```js
list(resource, query?)            // -> array
get(resource, id)                 // -> object
create(resource, data)            // -> created object (with id)
update(resource, id, data)        // -> updated object
remove(resource, id)              // -> void
query(resource, filters, opts?)   // where/order/limit
uploadFile(path, file)            // -> download URL (Storage; Django adapter -> multipart)
callFunction(name, payload)       // compute endpoints, delegates to functionsAdapter
```

### 1.2 Resource registry (the crux)
One table maps each logical resource to both worlds so a single call serves either adapter:

| resource        | Firestore collection   | Django paths (list / detail)                         |
|-----------------|------------------------|------------------------------------------------------|
| todos           | `todos`                | `/api` , `/api/:id/`                                  |
| persons         | `persons`              | `/person/create/`, `/person/:id/`                    |
| partTimers      | `partTimers`           | `/part-timer/`, `/get-part-timer/:userId/`           |
| roles           | `roles`                | `/roles/all/`, `/roles/:id/` …                        |
| colleges        | `collegelist`          | `/colleges/all/`, `/colleges/:id/` …                  |
| collegeDetails  | `social_links`         | `/college_details/` …                                 |
| accessRoles     | `access_roles`         | `/assignrole/`, `/deleteRole/:id/`                    |
| employers       | `employer_details`     | `/employers/`, `/employers/:id/`                     |
| recruiters      | `recrutier_details`    | `/recruiters/`, `/recruiters/:id/`                   |
| consultants     | `consultant_details`   | `/api/consultants/`, `/api/consultants/:id/` …        |
| statusConsultant| `status_consultant`    | `/status-consultants/` …                              |
| users           | `User`                 | `/user/log-first-time/`, `/api/user_and_role_overview/`|
| packages        | `Packages`             | `/packages/`, `/packages/:id/`                       |
| acsParttimerStatus | `PartTimer_status`  | `/acs_parttimer_status*`                              |
| statusUpdates   | `Status_updates`       | `/create_status_update`, `/get_status_by_id/:id` …    |
| products        | `ShopingProduct`       | `/products/`, `/products/:id/` …                      |
| teamMembers     | `team_member`          | `/team_members/` …                                    |
| devices         | `device_allocation`    | `/devices/` …                                         |
| happinessIndex  | `happiness_index`      | `/happiness/`, `/happiness-index/:userId/` …          |
| subsidiaries    | `subsidiary`           | `/subsidiaries/` …                                    |
| transactions    | `transactions`         | `/transactions/`, `/transaction/:id/` …               |

(Collection names mirror the Django `db_table` so a future Django re-sync is 1:1.)

### 1.3 Provider selector UI
Small control (SuperAdmin settings / header dropdown) bound to `ProviderContext`, persisted in
`localStorage`. Default = `firebase`. Env override `REACT_APP_DATA_PROVIDER` for build-time
default. This is the visible "Firebase | Django" switch.

---

## 2. Firestore schema (all 21 collections)

Field names preserved from the Django models. Translation rules:
- **PK / id** — use Firestore auto-id as the doc id; keep any natural key (`user_id`,
  `transaction_id`) as a field too. `User` uses `user_id` as the doc id (it's the Django PK).
- **ForeignKey** — store the referenced doc id as `<field>_id` (string). Optionally denormalize
  a display name to avoid extra reads (e.g. `consultant.recruiter_name`).
- **JSONField** (`technologies`, `enrolled_services`, `includes`, `excludes`) — native
  array/map.
- **DateField / DateTimeField** — Firestore `Timestamp` (store dates as ISO string OR Timestamp;
  pick one convention — recommend Timestamp).
- **FileField / ImageField** (`original_resume`, `consulting_resume`, product/team images) —
  upload to **Firebase Storage**, store the download URL string in the field.
- **choices** (visa_status, transaction_type, subsidiary…) — validated in adapter + security
  rules (Firestore has no enum).
- **unique** (`recruiter.phone`, `consultant.phone_number`, `transaction_id`,
  happinessIndex `unique_together (employee,date)`) — enforce in code (query-before-write) and/or
  a `uniques/` guard collection, since Firestore has no unique constraint.
- **auto timestamps** (`auto_now_add`, `auto_now`) — set `createdAt`/`updatedAt` via
  `serverTimestamp()` in the adapter.
- **shortuuid** (`transaction_id`) — generate client-side (e.g. `nanoid`) in the adapter.

Deliverable: `firestore/schema.md` documenting every collection's fields + a `seed/` script that
creates empty collections and any reference/lookup data (subsidiaries, packages, access_roles).

---

## 3. Security & rules
- `firestore.rules` — require `request.auth != null` for reads/writes; tighten per-collection
  (e.g. only SuperAdmin role writes `subsidiary`, `access_roles`). Enabled by the consolidation
  in §0.1 (Auth + data share the `anddhen` project, so `request.auth` is available in rules).
- `storage.rules` — authed uploads only, size/type limits for resumes and images.
- Move OpenAI/parse-resume keys into Cloud Functions env; drop `REACT_APP_OPENAI_API_KEY` from
  the client `.env`.

---

## 4. Phased execution

**Phase 1 — Connector scaffolding (no behavior change).**
Build `connector/` with registry + `djangoAdapter` that reproduces today's axios calls exactly.
Wrap `useApis.jsx` and the 25 `REACT_APP_API_BASE_URL` call sites to go through the connector.
Default provider stays `django`. App behaves identically. Ship + verify.

**Phase 1.5 — Auth consolidation onto `anddhen`.**
Run the Auth migration checklist in §0.1: enable providers on `anddhen`, re-register OAuth apps,
export/import users, swap `firebaseConfig` + `.env`, verify every sign-in method. Independent of
the data work — can run in parallel with Phase 1.

**Phase 2 — Firestore setup & schema.**
Add Firestore/Storage to the `anddhen` `firebaseConfig`. Write `firestore.rules`,
`storage.rules`, `schema.md`, seed script. Create empty collections + lookup/reference data.

**Phase 3 — Firebase adapter.**
Implement `firebaseAdapter.js` (CRUD, query, Storage uploads, id/timestamp/unique handling).
Unit-test each resource against the registry.

**Phase 4 — Cloud Functions for compute.**
Port `parse-resume`, finance_agent, AI suggestions, house-price into Callable Functions; wire
`functionsAdapter`. Remove client-side secret keys.

**Phase 5 — Flip default to Firebase.**
Set default provider = `firebase`. Full regression via the provider toggle (flip to Django to
compare). Keep Django adapter in place for the future upgrade path.

**Phase 6 — Decommission hosted Django.**
Once Firebase is validated, tear down the ₹8k/month host. Django code stays in the repo; the
connector can point back to a self-hosted/free instance anytime by flipping the toggle.

---

## 4b. Phase 3 — cross-provider shape deltas (serializer-grounded)
Django serializers are mostly `fields='__all__'` and list views return **bare arrays**
(`JsonResponse(list(qs.values()))`), so most shapes already match the Firebase adapter.
Known deltas a per-resource `normalize()` must reconcile before flipping to Firebase:
- **id type**: Django `id` = integer PK; Firebase `id` = string doc-id (transactions:
  `transaction_id`). Audit components that compare/route on `.id`.
- **FK fields**: Django `employer_id`/`recruiter_id`/`consultant_id` = integer PKs
  (PrimaryKeyRelatedField); Firebase = string doc-ids. Keep opaque; don't do math on them.
- **wrapped responses**: `/get_status_by_id/` returns `{status_updates: [...]}`; Firebase
  `byField` returns a bare array. Normalize to one shape.
- **timestamps**: Django returns ISO strings; Firebase returns `Timestamp` objects — the
  adapter should `.toDate()`/ISO-stringify on read for parity.
Recommended seam: optional `normalize.item(doc)` / `normalize.list(arr)` per resource in
registry.js, applied inside each adapter so callers see one canonical shape.

## 4c. Role system (Firebase) — DONE (code)
Single `role` per user on Firestore `User/{uid}.role` ∈ {user, employee, admin,
superadmin}; hierarchy user<employee<admin<superadmin; default `user`.
- `src/services/roles/roles.js` — constants, hierarchy helpers, `getUserRole`,
  `ensureUserRole` (auto-provisions role `user` on first sign-in, no clobber),
  `listUsersWithRoles`, `setUserRole`, `canAssign`/`assignableOptions`.
- `src/services/roles/RoleContext.jsx` — `RoleProvider`/`useRole`, wired in index.js.
- `ProtectedRoute` now gates by `minRole`; routes: `/superadmin`→superadmin,
  `/employeedashboard`→employee.
- UI: `SuperAdmin/RoleAccess/RoleManager.jsx` (list users + change role), added as the
  default tab in `RolesAndAccess`.
- Security: `firestore.rules` — no self-elevation (users can edit their profile but not
  their own role); role changes require admin/superadmin via get() on requester's doc;
  only superadmin may grant/revoke superadmin or touch another admin/superadmin.
- `firebaseAdapter.create` now upserts with `{merge:true}` so User provisioning never
  wipes `role`.
- Bootstrap: `firestore/setSuperAdmin.js` (Admin SDK, bypasses rules) →
  `abhishekgattineni@gmail.com` = superadmin (run after they sign in once).
- Activation (human): user must sign in once; then `node firestore/setSuperAdmin.js`;
  deploy `firestore.rules`. Until Firestore is live, role reads default to `user`
  (dashboards locked) but the app never crashes.

## 5. Notes / risks
- `finance_agent` is not in root `urls.py` today — confirm whether its endpoints are actually
  used by the UI before porting.
- Firestore has no joins; `user_and_role_overview` and consultant+recruiter+employer views need
  denormalization or multiple reads — design per view in Phase 3.
- Firestore reads/writes are billed per document; high-volume list screens should paginate.
- Keep the Django `db_table`-matched collection names so a future Django reconnect maps 1:1.
```
