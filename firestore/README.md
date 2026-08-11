# Firestore / Firebase workflow

Everything for the `anddhen` Firebase project (Firestore + Storage) lives here and at
the repo root (`firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`).

## One-time setup
```bash
npm i -g firebase-tools
firebase login
firebase use anddhen          # select the project
```

## Deploy rules + indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Automatic rules deploy (CI)

`firestore.rules` deploys itself. Any change to that file merged to `main` triggers
`.github/workflows/deploy-firestore-rules.yml`, which runs
`firebase deploy --only firestore:rules --project anddhen`. You can also re-run it by
hand from the repo's **Actions** tab → *Deploy Firestore rules* → **Run workflow**.

Vercel builds and hosts the frontend only — it never ships rules. Without this
workflow a rules change stays un-deployed after merge, and any feature relying on the
new rules fails with `PERMISSION_DENIED` while the UI looks fine.

Indexes and storage rules are deliberately **not** automated: deploying
`firestore:indexes` can drop indexes that aren't in `firestore.indexes.json`. Ship
those with the manual command above.

### One-time: the CI service account

1. [Firebase Console](https://console.firebase.google.com/project/anddhen/settings/serviceaccounts/adminsdk)
   → ⚙️ **Project settings** → **Service accounts** → **Generate new private key** →
   **Generate key**. A `.json` file downloads. Treat it as a password — it grants
   write access to the project.
2. Grant it the roles it needs, in the
   [Google Cloud IAM console](https://console.cloud.google.com/iam-admin/iam?project=anddhen)
   (find the `firebase-adminsdk-…@anddhen.iam.gserviceaccount.com` principal → ✏️ edit):
   - **Firebase Rules Admin** (`roles/firebaserules.admin`) — required, publishes rules
   - **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`) — required.
     Every deploy first checks that `firestore.googleapis.com` is enabled; without this
     role the run dies on `HTTP Error: 403, Caller does not have required permission to
     use project anddhen` before it ever reaches the rules
   - **Cloud Datastore Index Admin** — only if you later add `firestore:indexes` to the
     workflow

   Granting the key alone is not enough — a valid credential with no roles still gets a
   403. Deploying functions needs a wider set again; see `functions/README.md`.
3. GitHub → repo **Settings** → **Secrets and variables** → **Actions** →
   **New repository secret**:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: the **entire contents** of the downloaded JSON file, pasted as-is
     (open it in a text editor, select all, paste — including the outer `{ }`)
4. Delete the downloaded file from your machine. GitHub can't show a secret again
   after saving; to rotate, generate a new key and update the secret.

Never commit the JSON, and don't put it in a Claude Code cloud-environment variable —
those are plain text readable by anyone using the environment.

## Remove profiles for deleted Auth accounts

Deleting someone from Firebase Authentication does **not** delete their
`User/{uid}` document — Auth and Firestore are separate stores. They keep appearing
in Roles Management, and their old role and card grants would be inherited by anyone
who later signs up with the same address.

Three ways to clear them, in order of convenience:

- **One row, from the app**: Roles & Access → User Roles → **Remove**. Deletes the
  profile only; the Auth account (if any) is untouched.
- **All at once**: `node firestore/pruneDeletedUsers.js` lists every document whose
  Auth account is gone; add `--apply` to delete them. Needs `serviceAccount.json`
  (see below).
- **Automatically, from now on**: the `cleanupUserProfile` Cloud Function deletes the
  document when an Auth account is deleted. It only works once functions are deployed
  — see `functions/README.md`.

## Seed reference data
1. Console → Project settings → Service accounts → **Generate new private key**.
2. Save as `firestore/serviceAccount.json` (gitignored).
3. From `Anddhen-Group/`:
   ```bash
   node firestore/seed.js
   ```

## Local emulators (test without touching prod)
```bash
firebase emulators:start
```
Point the app at emulators by setting `REACT_APP_USE_EMULATORS=true` (wire-up TODO in
`src/services/connector/firebase.js` if you want emulator support in dev).

## Switching the app to Firebase
1. Complete Auth consolidation (providers + user import) on `anddhen` — see
   `docs/FIREBASE_MIGRATION_PLAN.md` §0.1 / Phase 1.5.
2. Uncomment the `anddhen` block in `.env` (and set the same vars in Vercel).
3. Flip the data source with the **Firebase | Django** toggle (`ProviderSwitch`),
   or set `REACT_APP_DATA_PROVIDER=firebase`.

See `firestore/schema.md` for the full 21-collection field map.
