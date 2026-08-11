# Cloud Functions

Callable (v2) compute endpoints for the `anddhen` project — see the header comment in
`index.js` for the contract of each one.

Plus one background trigger: **`cleanupUserProfile`** deletes `User/{uid}` when that
Auth account is deleted, so a removed user stops appearing in Roles Management. It's a
v1 Auth trigger (v2 has no non-blocking `onDelete`), and it only takes effect once
functions actually deploy. For accounts deleted before then, run
`node firestore/pruneDeletedUsers.js --apply` once.

## Deploy

`functions/**` changes merged to `main` deploy automatically via
`.github/workflows/deploy-functions.yml`. You can also re-run it by hand from the
repo's **Actions** tab → *Deploy Cloud Functions* → **Run workflow**.

Manual deploy from a machine with `firebase login`:

```bash
cd functions && npm i && npm run deploy
```

## Prerequisites for the CI deploy

Function deploys need materially more than the rules deploy does. All three must hold
or the workflow fails:

### 1. Blaze billing

v2 functions build a container and run on Cloud Run, so the project must be on the
**Blaze** (pay-as-you-go) plan. On Spark the deploy is rejected outright.

### 2. IAM roles on the `FIREBASE_SERVICE_ACCOUNT` principal

Grant these in the
[IAM console](https://console.cloud.google.com/iam-admin/iam?project=anddhen), on top
of the roles the rules deploy needs:

| Role | Why |
| --- | --- |
| `roles/serviceusage.serviceUsageConsumer` | Every deploy checks that required APIs are enabled. Without it you get `HTTP Error: 403, Caller does not have required permission to use project anddhen` before anything else runs |
| `roles/cloudfunctions.admin` | Create and update the functions |
| `roles/run.admin` | v2 functions are Cloud Run services underneath |
| `roles/iam.serviceAccountUser` | Lets the deployer act as the functions' runtime service account |
| `roles/artifactregistry.admin` | Stores the built container images |
| `roles/cloudbuild.builds.editor` | Runs the build |
| `roles/secretmanager.secretAccessor` | `aiSuggestions` binds the `OPENAI_API_KEY` secret |

`roles/editor` covers all of these in one grant, but hands the CI key far more power
than deploying needs — prefer the granular list.

### 3. The `OPENAI_API_KEY` secret must exist

`aiSuggestions` declares `defineSecret('OPENAI_API_KEY')`, and the deploy fails if the
secret isn't in Secret Manager. Create it once from a machine with `firebase login`:

```bash
firebase functions:secrets:set OPENAI_API_KEY --project anddhen
```

The stocks functions (`searchSymbols`, `stockMetrics`) need no API key — they use
Yahoo Finance via `yahoo-finance2`.
